import React, {Component} from 'react';
import Worker from './raster.worker';

export default class RasterView extends Component {

    constructor(props) {
        super(props);
        this.worker = new Worker()
        this.state = {
            isLoaded: false,
            saving: false,
            originalImgData: null,
            maskImgData: null,
            rasterCtx: null,
            maskLoaded: false,
            originalLoaded: false,
            offscreenOriginalContext: null,
            offscreenMaskContext: null,
            offscreenCanvas1Context: null,
            originalImgBitmap: null,
            maskImgBitmap: null,
            imgDisplayHeight: props.imgDisplayHeight,
            imgDisplayWidth: props.imgDisplayWidth,
            initialized: props.rasterInitialized,
        }
        this.renderRasterRef = React.createRef()
        this.offscreenOriginalRef = React.createRef()
        this.offscreenMaskRef = React.createRef()
        this.offscreenCanvas1Ref = React.createRef()
        this.loadOriginal = this.loadOriginal.bind(this)
        this.loadMask = this.loadMask.bind(this)
        this.updateDrawing = this.updateDrawing.bind(this)
        this.renderRaster = this.renderRaster.bind(this)
        this.save = this.save.bind(this)
        this.update = this.update.bind(this)
    }

    componentDidMount = () => {
        console.log('rasterViewer mounted with', this.state, this.props)

        const offscreenOriginalCanvas = document.getElementById('offscreenOriginalRef')
        const offscreenMaskCanvas = document.getElementById('offscreenMaskRef')
        const offscreenCanvas1Canvas = document.getElementById('offscreenCanvas1Ref')
        const rasterCanvas = this.renderRasterRef.current

        let offscreenOriginalContext = offscreenOriginalCanvas.getContext('2d')
        let offscreenMaskContext = offscreenMaskCanvas.getContext('2d')
        let offscreenCanvas1Context = offscreenCanvas1Canvas.getContext('2d')
        let rasterCanvasCtx = rasterCanvas.getContext('2d')

        offscreenOriginalContext.canvas.width = this.props.imgNaturalWidth
        offscreenOriginalContext.canvas.height = this.props.imgNaturalHeight
        offscreenMaskContext.canvas.width = this.props.imgNaturalWidth
        offscreenMaskContext.canvas.height = this.props.imgNaturalHeight
        offscreenCanvas1Context.canvas.width = this.props.imgNaturalWidth
        offscreenCanvas1Context.canvas.height = this.props.imgNaturalHeight
        rasterCanvasCtx.canvas.width = this.props.imgDisplayWidth
        rasterCanvasCtx.canvas.height = this.props.imgDisplayHeight

        offscreenOriginalContext.createImageData(this.props.imgNaturalWidth, this.props.imgNaturalHeight)
        offscreenMaskContext.createImageData(this.props.imgNaturalWidth, this.props.imgNaturalHeight)
        offscreenCanvas1Context.createImageData(this.props.imgNaturalWidth, this.props.imgNaturalHeight)
        rasterCanvasCtx.createImageData(this.props.imgNaturalWidth, this.props.imgNaturalHeight)

        offscreenOriginalContext.save()
        offscreenMaskContext.save()
        offscreenCanvas1Context.save()
        rasterCanvasCtx.save()

        this.setState({rasterCtx: rasterCanvasCtx,
            offscreenOriginalContext: offscreenOriginalContext,
            offscreenCanvas1Context: offscreenCanvas1Context,
            offscreenMaskContext: offscreenMaskContext}, () =>
        {
            if (this.props.originalImg) {
                console.log('firing loadmask from componentDidMount')
                if (this.props.imgDisplayWidth && this.props.imgDisplayHeight) {
                    this.loadMask(this.props.maskImg, this.props.originalImg,
                        {width:this.props.imgDisplayWidth, height: this.props.imgDisplayHeight})
                } else {
                    this.loadMask(this.props.maskImg, this.props.originalImg)
                }
            }
        })
        this.worker.addEventListener('message', (d) => {
            console.log('received on the front end', d)
            if (d.data.type === 'update') {
                // console.log('rasterViewer received from worker:', data)
                this.setState({isLoaded: true, initialized: true}, () => {
                    this.props.rasterInitializer(true)
                    this.state.rasterCtx.putImageData(d.data.data, 0, 0)
                })
            } else if (d.data.type === 'save') {
                this.setState({isLoaded: true, initialized: true}, () => {
                    this.props.handleSave(false, false, d.data.data)
                })
            }
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.requestSave === true) {
            this.save()
        }
        if (this.props.requestSave === false) {
            if (this.state.saving === true) {
                this.setState({saving: false})
            }
        }
        if (this.props.originalImg !== prevProps.originalImg) {
            this.setState({
                originalLoaded: false,
                maskLoaded: false,
            }, () => {
                console.log('rasterViewer received props:', this.props)
                console.log('firing update from componentDidUpdate')
                this.update()
            })
        }
        if (this.props.rasterInitialized) {
            if (this.props.rasterInitialized !== this.state.initialized) {
                console.log('raster initialized updated as:', this.props.rasterInitialized, this.state.initialized)
                this.setState({initialized: this.props.rasterInitialized})
            }
        }
        if (this.props.imgDisplayHeight !== prevProps.imgDisplayHeight) {
            this.setState({imgDisplayHeight: this.props.imgDisplayHeight})
        }
        if (this.props.imgDisplayWidth !== prevProps.imgDisplayWidth) {
            this.setState({imgDisplayWidth: this.props.imgDisplayWidth})
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.drawing !== nextProps.drawing) {
            this.updateDrawing(nextProps.drawing)
        }
    }

    componentWillUnmount() {
        // stop the worker
        this.worker.removeEventListener('message',() => {})
        this.worker.terminate()
    }

    update() {
        console.log('update fired')
        if (this.state.isLoaded === true) {
            this.setState({isLoaded: false}, ()=>{
                this.loadMask(this.props.maskImg, this.props.originalImg,
                    {width:this.props.imgDisplayWidth, height: this.props.imgDisplayHeight})
            })
        } else {
            console.log('wait fired in update function')
            setTimeout(this.update, 500)
            }
    }

    loadOriginal(newDims, explicitPath, type) {
        console.log('loadOriginal received:', explicitPath)
        if (explicitPath) {
            console.log('fetching:', explicitPath)
            fetch(this.props.originalImg,{
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers:
                    {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Access-Control-Allow-Headers': 'x-requested-with'
                    }
            })
                .then(r => r.blob())
                .then(b => createImageBitmap(b)
                    .then((bitmap) => {
                        // draw the image off screen and get the pixel data back
                        const offscreenCanvas = document.getElementById('offscreenOriginalRef')
                        let offscreenContext = offscreenCanvas.getContext('2d')
                        offscreenContext.clearRect(0,0, offscreenContext.canvas.width, offscreenContext.canvas.height)
                        offscreenContext.canvas.width=bitmap.width
                        offscreenContext.canvas.height=bitmap.height
                        newDims.width=bitmap.width
                        newDims.height=bitmap.height
                        this.state.offscreenOriginalContext.drawImage(bitmap, 0, 0)
                        const imgData = this.state.offscreenOriginalContext.getImageData(0, 0, bitmap.width, bitmap.height)
                        console.log('imgData out of the offscreenOriginalContext', imgData)
                        this.setState({
                            originalImgData: imgData,
                            originalLoaded: true,
                            originalImgBitmap: bitmap.data}, () => {
                            console.log('here3', type, newDims)
                            this.renderRaster(type, newDims)
                        })
                    })
                )
        } else {
            if (typeof(this.props.originalImg) !== 'undefined') {
                console.log('second link:', this.props.originalImg)
                fetch(this.props.originalImg,{
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers:
                    {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET',
                        'Access-Control-Allow-Headers': 'x-requested-with'
                    }
                })
                    .then(r => r.blob())
                    .then(b => createImageBitmap(b)
                        .then((bitmap) => {
                            // draw the image off screen and get the pixel data back
                            console.log('bitmap', bitmap.data)
                            this.state.offscreenOriginalContext.drawImage(bitmap, 0, 0)
                            const imgData = this.state.offscreenOriginalContext.getImageData(0, 0, bitmap.width, bitmap.height)
                            console.log('imgData out of the offscreenOriginalContext', imgData)
                            this.setState({
                                originalImgData: imgData,
                                originalLoaded: true,
                                originalImgBitmap: bitmap.data}, () => {
                                console.log('here4', type)
                                this.renderRaster(type)
                            })
                        })
                    )
            } else {
                console.log('CAUGHT UNDEFINED')
            }
        }
    }

    save() {
        if (this.state.isLoaded === true) {
            if (this.state.saving === false) {
                this.setState({isLoaded: false, saving: true}, () => {
                    this.worker.postMessage({type: 'save', data: {
                            original_url: this.props.original_url,
                            mask_url: this.props.mask_url,
                            product_info: this.props.product_info
                        }})
                })
            } else {
                console.log('already saving')
            }
        } else {
            if (this.state.saving === false) {
                console.log('wait fired in save function')
                setTimeout(this.save, 500)
            } else {
                console.log('already saving')
            }
        }
    }

    loadMask(explicitPathMask, explicitPathOriginal, newDims) {
        console.log('loadMask received:', explicitPathMask, explicitPathOriginal, newDims)
        if (explicitPathMask) {
            console.log('explicit')
            fetch(explicitPathMask,{
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers:
                    {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET',
                        'Access-Control-Allow-Headers': 'x-requested-with'
                    }
            })
                .then(r => r.blob())
                .then(b => createImageBitmap(b)
                    .then((bitmap) => {
                        // draw the image off screen and get the pixel data back
                        // reset the context
                        const offscreenCanvas = document.getElementById('offscreenMaskRef')
                        let offscreenContext = offscreenCanvas.getContext('2d')
                        offscreenContext.clearRect(0,0, offscreenContext.canvas.width, offscreenContext.canvas.height)
                        offscreenContext.canvas.width=bitmap.width
                        offscreenContext.canvas.height=bitmap.height
                        this.state.offscreenMaskContext.drawImage(bitmap, 0, 0)
                        const imgData = this.state.offscreenMaskContext.getImageData(0, 0, bitmap.width, bitmap.height)
                        if (this.state.initialized) {
                            console.log('explicit1A')
                            this.setState({
                                maskImgData: imgData,
                                maskLoaded: true,
                                maskImgBitmap: bitmap
                            }, () => {
                                this.loadOriginal(newDims, explicitPathOriginal, 'explicit')
                            })
                        } else {
                            console.log('explicit1B')
                            this.setState({
                                maskImgData: imgData,
                                maskLoaded: true,
                                maskImgBitmap: bitmap
                            }, () => {
                                this.loadOriginal(newDims, explicitPathOriginal, 'initial')
                            })
                        }
                    })
                )
        } else {
            if (typeof(this.props.originalImg) !== "undefined") {
                console.log('MASK', this.props.maskImg)
                if (this.props.maskImg) {
                    console.log('MASK1')
                    fetch(this.props.maskImg,{
                        method: 'GET',
                        mode: 'cors',
                        cache: 'no-cache',
                        headers:
                            {
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET',
                                'Access-Control-Allow-Headers': 'x-requested-with'
                            }
                    })
                        .then(r => r.blob())
                        .then(b => createImageBitmap(b)
                            .then((bitmap) => {
                                // draw the image off screen and get the pixel data back
                                this.state.offscreenMaskContext.drawImage(bitmap, 0, 0)
                                const imgData = this.state.offscreenMaskContext.getImageData(0, 0, bitmap.width, bitmap.height)
                                if (this.state.initialized) {
                                    this.setState({
                                        maskImgData: imgData,
                                        maskLoaded: true,
                                        maskImgBitmap: bitmap
                                    }, () => {
                                        this.loadOriginal(newDims, explicitPathOriginal, 'explicit')
                                    })
                                } else {
                                    this.setState({
                                        maskImgData: imgData,
                                        maskLoaded: true,
                                        maskImgBitmap: bitmap
                                    }, () => {
                                        this.loadOriginal(newDims, explicitPathOriginal, 'initial')
                                    })
                                }
                            })
                        )
                } else {
                    //  we need to create a blank mask and just fill it with white so that the raster is the original
                    //  image
                    console.log('MASK2')
                    const offscreenMaskCanvas = document.getElementById('offscreenMaskRef')
                    let offscreenMaskContext = offscreenMaskCanvas.getContext('2d')
                    // console.log('offscreenMaskContext', offscreenMaskContext)
                    offscreenMaskContext.fillStyle = "#FFFFFF"
                    console.log('creating a mask of size:', this.props.imgNaturalWidth, this.props.imgNaturalHeight)
                    offscreenMaskContext.fillRect(0, 0, this.props.imgNaturalWidth, this.props.imgNaturalHeight)
                    const imgData = offscreenMaskContext.getImageData(0, 0, this.props.imgNaturalWidth, this.props.imgNaturalHeight)
                    createImageBitmap(imgData).then((b) => {
                        if (this.state.initialized) {
                            this.setState({
                                maskImgData: imgData,
                                maskLoaded: true,
                                maskImgBitmap: b
                            }, () => {
                                this.loadOriginal(newDims, explicitPathOriginal, 'explicit')
                            })
                        } else {
                            this.setState({
                                maskImgData: imgData,
                                maskLoaded: true,
                                maskImgBitmap: b
                            }, () => {
                                this.loadOriginal(newDims, explicitPathOriginal, 'initial')
                            })
                        }
                    })
                }
            } else {
                console.log('CAUGHT UNDEFINED')
            }
        }
    }

    updateDrawing(drawing) {
        // parse the drawing dict
        console.log('drawing', drawing)
        if (drawing !== 'undefined') {
            drawing = JSON.parse(drawing)
            if (this.state.isLoaded === true) {
                this.worker.postMessage({
                        type: 'updateMask',
                        drawing: drawing,
                    }
                )
            } else {
                console.log('wait fired in updateDrawing function')
                setTimeout(this.updateDrawing, 500)
            }
        }
    }

    renderRaster(type, newDims) {
        console.log('render raster received:', type, newDims)
        const originalData = this.state.originalImgData
        const maskData = this.state.maskImgData
        const maskImgBitmap = this.state.maskImgBitmap
        const displayWidth = this.props.imgDisplayWidth
        const displayHeight = this.props.imgDisplayHeight
        if (type === 'initial') {
            this.offscreen = document.createElement('canvas')
            this.offscreen.width = this.state.imgDisplayWidth
            this.offscreen.height = this.state.imgDisplayHeight
            let offscreenCanvas = this.offscreen.transferControlToOffscreen()
            console.log('sending back initial')
            this.worker.postMessage({
                    type: 'start',
                    originalImage: originalData,
                    maskImage: maskData,
                    drawing: this.props.drawing,
                    scale: this.props.scale,
                    canvas: offscreenCanvas,
                    maskImgBitmap: maskImgBitmap,
                    displayWidth: displayWidth,
                    displayHeight: displayHeight,
                    sizes: {
                        dwidth: this.props.imgDisplayWidth,
                        dheight: this.props.imgDisplayHeight,
                        nwidth: this.props.imgNaturalWidth,
                        nheight: this.props.imgNaturalHeight,
                    },
                }, [offscreenCanvas]
            )
        } else {
            console.log('sending back switching info')
            this.offscreen = null
            this.offscreen = document.createElement('canvas')
            this.offscreen.width = this.state.imgDisplayWidth
            this.offscreen.height = this.state.imgDisplayHeight
            let offscreenCanvas = this.offscreen.transferControlToOffscreen()

            // force raster canvas to resize to new image incoming
            console.log('before resize', document.getElementById('renderRasterRef'))
            const rasterCanvas = document.getElementById('renderRasterRef')
            const rasterCtx = rasterCanvas.getContext('2d')
            rasterCanvas.width=newDims.width
            rasterCanvas.height=newDims.height
            rasterCtx.clearRect(0,0, rasterCtx.canvas.width, rasterCtx.canvas.width)
            console.log('after resize', document.getElementById('renderRasterRef'))

            this.worker.postMessage({
                    type: 'newImageIncoming',
                    originalImage: originalData,
                    maskImage: maskData,
                    drawing: this.props.drawing,
                    scale: this.props.scale,
                    canvas: offscreenCanvas,
                    maskImgBitmap: maskImgBitmap,
                    displayWidth: displayWidth,
                    displayHeight: displayHeight,
                    sizes: {
                        dwidth: this.props.imgDisplayWidth,
                        dheight: this.props.imgDisplayHeight,
                        nwidth: originalData.width,
                        nheight: originalData.height,
                    },
                }, [offscreenCanvas]
            )
        }
    }

    render() {

        return (
            <div style={{width: '100%', height: '100%'}}>
                <div style={{}}>
                    <canvas
                        style={{maxWidth: this.state.imgDisplayWidth, maxHeight:this.state.imgDisplayHeight}}
                        ref={this.renderRasterRef}
                        id='renderRasterRef'
                    >
                    </canvas>
                </div>
                <canvas
                    style={{width: 0, height: 0, opacity: 0, overflow:"hidden"}}
                    ref={this.offscreenOriginalRef}
                    id='offscreenOriginalRef'
                >
                </canvas>
                <canvas
                    style={{width: 0, height: 0, opacity: 0, overflow:"hidden"}}
                    ref={this.offscreenMaskRef}
                    id='offscreenMaskRef'
                >
                </canvas>
                <canvas
                    style={{width: 0, height: 0, opacity: 0, overflow:"hidden"}}
                    id='offscreenCanvas1Ref'
                >
                </canvas>

            </div>
        )
    }
}
