import React from 'react';
import { render } from "react-dom"
import original from './xedit-test.png';
import mask from './xedit-test-mask.png';
import p5 from 'p5';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import Switch from '@material-ui/core/Switch';
import './xEditStyleNew.css';
import redoIcon from './icons/Redo_icon.png'
import undoIcon from './icons/Undo_icon.png'
import moveDownIcon from "./icons/MoveDown_icon.png"
import moveUpIcon from "./icons/MoveUp_icon.png"
import visibleIcon from "./icons/Visible_icon.png"
import imageSettingsIcon from "./icons/ImageSettings_icon.png"
import boundingBoxIcon from "./icons/BoundingBox_icon.png"
import reCenterIcon from "./icons/Re-center_icon.png"
import brushIcon from "./icons/brush_icon.png"
import removeBackgroundIcon from "./icons/GC_icon.png"
import maskCanvas from "./maskCanvasDraw";
import { faCrosshairs } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faTrashAlt} from "@fortawesome/pro-solid-svg-icons";
export default class XeditView1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            undoStatus: false,
            redoStatus: false,
            foregroundStroke: true,
            precisionToolBoxToggle: false,
            // we have to keep a copy of the original image
            originalImage: 0,
            strokeArray: [],
            currentStroke: [],
            brushX: 0,
            brushY: 0,
            strokeWidth: 125,
            strokeColor: 255,
            activeView: 'originalWithMask',
            originalOpacity: 1,
            maskOpacity: 0.5,
            originalXLoction: 0,
            maskXLocation: 0,
            rasterXLocation:0,
            imgDisplayHeight: 1,
            imgDisplayWidth: 1,
            imgNaturalHeight: 1,
            imgNaturalWidth: 1,
            thumbnailHeight: 90,
            thumbnailWidth: 90,
            canvasWidth: 0,
            canvasHeight: 0,
            raster: '',
            scale: 1,
            scaleX: 1,
            scaleY: 1,
            isDrawing: false,
            notUpdated:true,
            p5Mask: null,
            p5Raster: null,
            maskChannel: [],
            outputBackgroundColor: 255,
            outputBackgroundOpacity: 0,
            previousMaskState: '',
            maskStateChange: true,
            zoom: 1,
            zoomWidth: 0,
            zoomHeight: 0,
            zoomImageWidth: 0,
            zoomImageHeight: 0,
            zoomImageUpperLeftX: '',
            zoomImageUpperLeftY: '',
            zoomImageDestUpperLeftX: '',
            zoomImageDestUpperLeftY: '',
            lastScrollPos: '',
            offCanvas: false,
        };

        // functions
        this.precisionBrush = this.precisionBrush.bind(this)
        this.cRedo = this.cRedo.bind(this)
        this.cUndo = this.cUndo.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.onImgLoad = this.onImgLoad.bind(this)
        this._onMouseMove = this._onMouseMove.bind(this)
        this._handleDraw = this._handleDraw.bind(this)
        this._handleStrokeWidth = this._handleStrokeWidth.bind(this)
        this._handleStrokeInputWidth = this._handleStrokeInputWidth.bind(this)
        this._handleMaskOpacity = this._handleMaskOpacity.bind(this)
        this._handleNewBackgroundOpacity = this._handleNewBackgroundOpacity.bind(this)
        this._BackgroundBrushToggle = this._BackgroundBrushToggle.bind(this)
        this._handleZoom = this._handleZoom.bind(this)
        this._handleLoop = this._handleLoop.bind(this)

        this.state.renderMaskRef = React.createRef()
        this.state.renderRasterRef = React.createRef()
        this.state.renderThumbnailRef = React.createRef()
        this.state.renderZoomRef = React.createRef()
    }

    // admin functions
    // componentWillMount() {
    //     document.title = 'XSPACE | Batch Mask Editor'
    // }

    componentDidMount() {
        document.title = 'XSPACE | Batch Mask Editor'

        console.log("canvas width", this.container.offsetWidth)
        window.addEventListener('mousedown', this._handleDraw, false)
        window.addEventListener('mouseup', this._handleDraw, false)

        // setup p5 instance for drawing on the mask by loading in the mask as a p5 object
        p5.disableFriendlyErrors = true
        this.maskSketch = new p5((p) => {
            p.disableFriendlyErrors = true
            p5.disableFriendlyErrors = true
            let drawing = []
            let currentPath = []
            let p5Mask = ''
            let canvas = ''
            let outputCanvas = ''

            p.preload = () => {
                p.disableFriendlyErrors = true
                p.pixelDensity(1)
                p5Mask = p.loadImage(`${mask}`)
                p5Mask.loadPixels()
                this.setState({p5Mask: p5Mask})
            }

            p.setup = () => {
                p.disableFriendlyErrors = true
                // p.frameRate()
                // p.image(this.p5Mask, 0, 0)
                console.log(this.state.imgDisplayWidth.valueOf(), this.state.imgDisplayHeight.valueOf(), this.state.imgNaturalWidth.valueOf(), this.state.imgNaturalHeight.valueOf())
                p.pixelDensity(1)
                canvas = p.createCanvas(this.state.imgDisplayWidth.valueOf(), this.state.imgDisplayHeight.valueOf())
                    .parent(this.state.renderMaskRef.current)
                canvas.mousePressed(this.startPath)
                outputCanvas = p.createGraphics(this.state.imgNaturalWidth.valueOf(), this.state.imgNaturalHeight.valueOf())
                outputCanvas.image(p5Mask, 0, 0, this.state.imgNaturalWidth.valueOf(), this.state.imgNaturalHeight.valueOf())
                this.setState({
                    maskStateChange: true,
                    scaleX: this.state.imgNaturalWidth / this.state.imgDisplayWidth,
                    scaleY: this.state.imgNaturalHeight / this.state.imgDisplayHeight
                })
            }

            this.startPath = () => {
                currentPath = []
                drawing.push(currentPath)
            }

            p.draw = () => {
                if (!this.state.offCanvas) {
                    if (this.state.isDrawing) {
                        let point = {
                            x: p.mouseX,
                            y: p.mouseY,
                            c: this.state.strokeColor,
                            w: this.state.strokeWidth
                        }
                        currentPath.push(point)
                    }
                    // can use this for zoom: https://p5js.org/reference/#/p5/image
                    outputCanvas.noFill()

                    // console.log('drawing', drawing)
                    for (let i = 0; i < drawing.length; i++) {
                        let path = drawing[i]
                        // console.log('examplepath', path[0])
                        try{outputCanvas.stroke(path[0].c)}
                        catch(err) {
                            outputCanvas.stroke(this.state.strokeColor)
                        }
                        try{outputCanvas.strokeWeight(path[0].w)}
                        catch(err) {
                            outputCanvas.stroke(this.state.strokeWidth)
                        }
                        outputCanvas.beginShape()
                        for (let j = 0; j < path.length; j++) {
                            outputCanvas.vertex(path[j].x * this.state.scaleX, path[j].y * this.state.scaleY)
                        }
                        outputCanvas.endShape()
                    }
                    // outputCanvas.updatePixels()
                    this.setState({p5Mask: outputCanvas})
                    p.image(outputCanvas, 0, 0, this.state.imgDisplayWidth.valueOf(), this.state.imgDisplayHeight.valueOf())
                }
                // console.log('mask frame rate', p.frameRate())
            }
        })
        console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRR', this.maskSketch);

        // setup p5 instance for the raster-image by loading in the original image as a p5 object and then applying the
        // mask from the previous mask p5 object to it mask URL: https://p5js.org/reference/#/p5.Image
        p5.disableFriendlyErrors = true
        this.rasterSketch = new p5((p) => {
            p.disableFriendlyErrors = true
            p5.disableFriendlyErrors = true
            let outputCanvas = ''
            let p5Original = ''
            let originalCanvas = ''
            let zoomCanvas1 = ''
            let zoomCanvas2 = ''
            let zoomCanvas3 = ''
            let x = ''
            let y = ''
            p.preload = () => {
                p.disableFriendlyErrors = true
                p5Original = p.loadImage(`${original}`)
            }

            p.setup = () => {
                p.disableFriendlyErrors = true
                // p.frameRate()
                p.pixelDensity(1)
                p.createCanvas(this.state.imgDisplayWidth.valueOf()+this.state.zoomWidth.valueOf(), this.state.imgDisplayHeight.valueOf())
                    .parent(this.state.renderRasterRef.current)
                outputCanvas = p.createGraphics(this.state.imgNaturalWidth.valueOf(), this.state.imgNaturalHeight.valueOf())
                outputCanvas.image(p5Original, 0, 0, this.state.imgNaturalWidth.valueOf(), this.state.imgNaturalHeight.valueOf())
                outputCanvas.loadPixels()
                originalCanvas = p.createGraphics(this.state.imgNaturalWidth.valueOf(), this.state.imgNaturalHeight.valueOf())
                originalCanvas.image(p5Original, 0, 0, this.state.imgNaturalWidth.valueOf(), this.state.imgNaturalHeight.valueOf())
                originalCanvas.loadPixels()
                zoomCanvas1 = p.createGraphics(this.state.zoomWidth.valueOf(), this.state.zoomHeight.valueOf())
                zoomCanvas1.background(0)
                zoomCanvas2 = p.createGraphics(this.state.zoomWidth.valueOf(), this.state.zoomHeight.valueOf())
                zoomCanvas2.background(0)
                zoomCanvas3 = p.createGraphics(this.state.zoomWidth.valueOf(), this.state.zoomHeight.valueOf())
                zoomCanvas3.background('rgba(0,0,0,0)')
            }
            p.draw = () => {
                p.clear()
                p.tint(255,255)
                let bgColor = 'rgba(' + `${this.state.outputBackgroundColor}` + ',' + `${this.state.outputBackgroundColor}` + ',' + `${this.state.outputBackgroundColor}` + ',' + `${this.state.outputBackgroundOpacity}` + ')'
                // console.log('bgColor', bgColor)
                p.background(bgColor)
                if (!this.state.offCanvas) {
                    if (this.state.maskStateChange) {
                        // console.log('updating mask')
                        p.pixelDensity(1)
                        console.log('test pixel', this.state.p5Mask.pixels[0])
                        if (this.state.p5Mask.pixels[0] !== 'undefined') {
                            let index = 0
                            this.setState({maskStateChange: false})
                            for (let x = 0; x < outputCanvas.width; x++) {
                                for (let y = 0; y < outputCanvas.height; y++) {
                                    index = (x + y * outputCanvas.width) * 4
                                    if (this.state.p5Mask.pixels[index] < 10) {
                                        outputCanvas.pixels[index] = this.state.outputBackgroundColor
                                        outputCanvas.pixels[index + 1] = this.state.outputBackgroundColor
                                        outputCanvas.pixels[index + 2] = this.state.outputBackgroundColor
                                        outputCanvas.pixels[index + 3] = 0
                                    } else {
                                        outputCanvas.pixels[index] = originalCanvas.pixels[index]
                                        outputCanvas.pixels[index + 1] = originalCanvas.pixels[index + 1]
                                        outputCanvas.pixels[index + 2] = originalCanvas.pixels[index + 2]
                                        outputCanvas.pixels[index + 3] = originalCanvas.pixels[index + 3]
                                    }
                                }
                            }
                            // console.log(outputCanvas)
                            outputCanvas.updatePixels()
                            this.setState({p5Raster: outputCanvas})
                        }
                    }

                    // zoom gets calculated every frame based on x,y position on the mask/original canvas
                    // the calculation for zoom in the following function is as follows :
                    // arg 1: src img/canvas
                    // arg 2: (Integer) X coordinate of the source's upper left corner
                    // arg 2: (Integer): Y coordinate of the source's upper left corner
                    // arg 2: (Integer): source image width
                    // arg 2: (Integer): source image height
                    // arg 2: (Integer): X coordinate of the destination's upper left corner
                    // arg 2: (Integer): Y coordinate of the destination's upper left corner
                    // arg 2: (Integer): destination image width
                    // arg 2: (Integer): destination image height
                    zoomCanvas1.clear()
                    zoomCanvas1.copy(originalCanvas, this.state.zoomImageUpperLeftX, this.state.zoomImageUpperLeftY,
                        this.state.zoomImageWidth, this.state.zoomImageHeight,
                        this.state.zoomImageDestUpperLeftX, this.state.zoomImageDestUpperLeftY,
                        this.state.zoomWidth, this.state.zoomHeight)
                    zoomCanvas2.clear()
                    zoomCanvas2.copy(this.state.p5Mask, this.state.zoomImageUpperLeftX, this.state.zoomImageUpperLeftY,
                        this.state.zoomImageWidth, this.state.zoomImageHeight,
                        this.state.zoomImageDestUpperLeftX, this.state.zoomImageDestUpperLeftY,
                        this.state.zoomWidth, this.state.zoomHeight)
                    // TODO: adjust transparency of zoomCanvas2

                    zoomCanvas3.clear()
                    zoomCanvas3.copy(outputCanvas, this.state.zoomImageUpperLeftX, this.state.zoomImageUpperLeftY,
                        this.state.zoomImageWidth, this.state.zoomImageHeight,
                        this.state.zoomImageDestUpperLeftX, this.state.zoomImageDestUpperLeftY,
                        this.state.zoomWidth, this.state.zoomHeight)
                    // zoom view starts at 0,0
                    // raster view starts at the edge of the zoom view and 0 height

                }
                p.image(zoomCanvas1, 0, 0, this.state.zoomWidth, this.state.zoomHeight)
                p.image(zoomCanvas3, 0, this.state.zoomHeight, this.state.zoomWidth, this.state.zoomHeight)
                p.image(outputCanvas, this.state.zoomWidth, 0, this.state.imgDisplayWidth, this.state.imgDisplayHeight)
                p.tint(255,Math.trunc(this.state.maskOpacity*255))
                p.image(zoomCanvas2, 0, 0, this.state.zoomWidth, this.state.zoomHeight)


                // console.log('raster frame rate', p.frameRate())
            }
        })
        console.log('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM', this.rasterSketch);

    }

    componentDidUpdate(prevProps, prevState,snapshot) {
        if (this.state.notUpdated) {
            this.setState({
                    canvasWidth: this.container.offsetWidth,
                    canvasHeight: this.container.offsetHeight,
                    zoomWidth: Math.trunc(Number(this.container.offsetWidth/3)),
                    zoomHeight: Math.trunc(Number(this.container.offsetHeight/2)),
                }
            )
        }}

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.state.canvasWidth.valueOf() === nextState.canvasWidth.valueOf()) {
            if (this.state.notUpdated) {
                this.setState({notUpdated: false})
            }
        } else {
            this.setState({notUpdated: true})
        }
    }

    componentWillUnmount() {
        // this.maskSketch.remove();
        // this.rasterSketch.remove();
        // this.maskSketch = null;
        // this.rasterSketch = null;
        window.removeEventListener('mousedown', this._handleDraw, false)
        window.removeEventListener('mouseup', this._handleDraw, false)

    }

    // image handling functions

    _handleZoom (e) {
        if (e.deltaX !== "undefined") {
            console.log(e.deltaX, e.deltaY)
            let z = 1
            if (e.deltaY > 0) {
                z = this.state.zoom*1.25
                if (z > 6) {
                    this.setState({zoom: 6})
                } else {
                    this.setState({zoom: z})
                }
            } else {
                z = this.state.zoom/1.25
                this.setState({zoom: z})
            }
            let x
            let y
            try{x = e.nativeEvent.offsetX} catch(err) {x = this.state.brushX}
            try{y = e.nativeEvent.offsetY} catch(err) {y = this.state.brushY}
            let zidulx = 0
            let ziduly = 0
            let ziw = this.state.zoomWidth*z
            let zih = this.state.zoomHeight*z
            let uplx = (this.state.scaleX*x) - Number(.5*ziw)
            let uply = (this.state.scaleY*y) - Number(.5*zih)
            if (uplx < 0) {
                zidulx = Math.abs(uplx)
                uplx = 0
            } else if (uplx > this.state.imgNaturalWidth) {
                uplx = this.state.imgNaturalWidth
            }
            if (uply < 0) {
                ziduly = Math.abs(uply)
                uply = 0
            } else if (uply > this.state.imgNaturalHeight) {
                uply = this.state.imgNaturalHeight
            }

            this.setState({
                brushX: Math.trunc(Number(x)),
                brushY: Math.trunc(Number(y)),
                zoomImageUpperLeftX: Math.trunc(Number(uplx)),
                zoomImageUpperLeftY: Math.trunc(Number(uply)),
                zoomImageDestUpperLeftX: Math.trunc(Number(zidulx)),
                zoomImageDestUpperLeftY: Math.trunc(Number(ziduly)),
                zoomImageWidth: Math.trunc(Number(ziw)),
                zoomImageHeight: Math.trunc(Number(zih)),
            })
        }
    }


    _handleDraw (e) {
        // console.log(e)
        if (e.type === 'mouseup') {
            this.setState({isDrawing: false})
            this.setState({maskStateChange: true})
        } else {
            if (e.target.id === "defaultCanvas0") {
                // console.log('isDrawing')
                this.setState({isDrawing: true})
            }
        }
        // console.log(e)
    }

    _handleStrokeWidth(e) {
        this.setState({strokeWidth: Number(e.target.value)})
    }

    _handleStrokeInputWidth(e) {
        this.setState({strokeWidth: e.target.value === '' ? 0 : Number(e.target.value)})
    }

    _handleMaskOpacity(e) {
        if (e.target.ariaValueNow === null) {console.log('caught Nan')} else {
            let updatedValue = (e.target.ariaValueNow === '' ? 0 : parseFloat(e.target.ariaValueNow))/100
            this.setState({maskOpacity: updatedValue})
        }
    }

    _handleNewBackgroundOpacity(e) {
        let updatedValue = (e.target.ariaValueNow === '' ? 0 : parseFloat(e.target.ariaValueNow))/100
        console.log(updatedValue)
        this.setState({outputBackgroundOpacity: updatedValue})
    }

    _BackgroundBrushToggle(e) {
        this.setState({foregroundStroke: !this.state.foregroundStroke})
        this.state.foregroundStroke ? this.setState({strokeColor: 0}) : this.setState({strokeColor: 255})
    }

    _handleLoop(e) {
        if (e.type !== 'undefined') {
            if (e.type === 'mouseenter') {
                console.log(e.type, 'offcanvas=false')
                this.setState({offCanvas: false})
            } else if (e.type === 'mouseleave') {
                console.log(e.type, 'offcanvas=true')
                this.setState({offCanvas: true})
            }
        }
    }

    _onMouseMove(e) {
        console.log('brushX', e.nativeEvent.offsetX, 'brushY', e.nativeEvent.offsetY)
        let x
        let y
        try{x = e.nativeEvent.offsetX} catch(err) {x = this.state.brushX}
        try{y = e.nativeEvent.offsetY} catch(err) {y = this.state.brushY}
        let zidulx = 0
        let ziduly = 0
        let ziw = this.state.zoomWidth*this.state.zoom
        let zih = this.state.zoomHeight*this.state.zoom
        let uplx = (this.state.scaleX*x) - Number(.5*ziw)
        let uply = (this.state.scaleY*y) - Number(.5*zih)
        if (uplx < 0) {
            zidulx = Math.abs(uplx)
            uplx = 0
        } else if (uplx > this.state.imgNaturalWidth) {
            uplx = this.state.imgNaturalWidth
        }
        if (uply < 0) {
            ziduly = Math.abs(uply)
            uply = 0
        } else if (uply > this.state.imgNaturalHeight) {
            uply = this.state.imgNaturalHeight
        }

        this.setState({
            brushX: Math.trunc(Number(x)),
            brushY: Math.trunc(Number(y)),
            zoomImageUpperLeftX: Math.trunc(Number(uplx)),
            zoomImageUpperLeftY: Math.trunc(Number(uply)),
            zoomImageDestUpperLeftX: Math.trunc(Number(zidulx)),
            zoomImageDestUpperLeftY: Math.trunc(Number(ziduly)),
            zoomImageWidth: Math.trunc(Number(ziw)),
            zoomImageHeight: Math.trunc(Number(zih)),
        })
    }

    onImgLoad({target:img}) {
        if (this.state.notUpdated) {
            console.log("onImgLoad received:", img)
            this.setState({
                imgDisplayHeight: img.height,
                imgDisplayWidth: img.width,
                imgNaturalHeight: img.naturalHeight,
                imgNaturalWidth: img.naturalWidth,
            })
            console.log('image height, image width:', img.height, img.width, img.naturalHeight, img.naturalWidth)
        }
    }

    cRedo() {
        console.log("'cRedo' clicked")
    }

    cUndo() {
        console.log("'cUndo' clicked")
    }

    handleClose(e) {
        console.log("'handleClose' fired", e)
    }

    handleSave(e) {
        console.log("'handleSave' fired", e)
    }

    precisionBrush(e) {
        // console.log('precisionbrush clicked', e)
        this.setState({precisionToolBoxToggle: !this.state.precisionToolBoxToggle})
    }

    render() {

        window.addEventListener('mousedown', this._handleDraw, false)
        window.addEventListener('mouseup', this._handleDraw, false)
        // claim constants
        let leftSubPanel = ''
        let precisionToolbox = ''
        let maskDrawingCanvas = <div/>
        //
        // // create zoom options
        // const zoomOptions = [{'data': "fit", 'title': "Fit Screen (ctrl+0)"},
        //     {'data': .1, 'title': "10%"},
        //     {'data': .25, 'title': "25%"},
        //     {'data': .5, 'title': "50%"},
        //     {'data': .5, 'title': "50%"},
        //     {'data': 1, 'title': "Actual Pixels (ctrl+1)"},
        //     {'data': 1.25, 'title': "125%"},
        //     {'data': 1.5, 'title': "150%"},
        //     {'data': 1.75, 'title': "175%"},
        //     {'data': 2, 'title': "200%"},
        //     {'data': 3, 'title': "300%"},
        //     {'data': 4, 'title': "400%"},
        //     {'data': 5, 'title': "500%"},
        //     {'data': 6, 'title': "600%"},
        //     {'data': 8, 'title': "800%"},
        //     {'data': 10, 'title': "1000%"},]
        //
        // const zoomList = zoomOptions.map((zoomOption) => {
        //
        //     return {}
        // })

        if (this.state.precisionToolBoxToggle) {
            // brushBox.classList.add('active')
            this.handleBlur = () => {
                if (this.state.strokeWidth < 0) {
                    this.setState({strokeWidth: 0})
                } else if (this.state.strokeWidth > 250) {
                    this.setState({strokeWidth: 250})
                }
            }

            precisionToolbox =
                <React.Fragment>
                    <div style={{
                        width: 125,
                        height: '100%',
                        position: "absolute",
                        left: 50,
                        backgroundColor: '#313134',
                        color: '#ffffff',
                        top: 0,
                        fontSize: 12
                    }}>
                        <div>
                            <br/>
                            <Grid container spacing={1} alignItems="center" direction="column">
                                <Grid item>
                                    <Typography id="input-slider" gutterBottom style={{fontSize: 12}}>
                                        Brush Size
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Input
                                        value={this.state.strokeWidth}
                                        margin="dense"
                                        onChange={this._handleStrokeInputWidth}
                                        onBlur={this.handleBlur}
                                        inputProps={{
                                            step: 1,
                                            min: 0,
                                            max: 250,
                                            type: 'number',
                                            'aria-labelledby': 'input-slider',
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography id="input-slider" gutterBottom style={{fontSize: 12}}>
                                        B-Ground/ F-Ground
                                    </Typography>
                                </Grid>
                                <Grid item xs onClick={e => this._BackgroundBrushToggle(e)}>
                                    <Switch
                                        checked={Boolean(this.state.foregroundStroke)}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </React.Fragment>
        }

        if (this.state.mask) {
            let imgName = this.state.mask
            try {
                imgName = (imgName[imgName.length - 1])
            } catch (err) {
                console.log(err)
                imgName = "saveableAsset"
            }

            maskDrawingCanvas = (
                <maskCanvas
                    color: {this.state.strokeColor}
                    brushRadius: {this.state.strokeWidth}
                    lazyRadius: {12}
                    imgSource: {this.state.mask}
                    scale: {this.state.scale}
                    imgName: {imgName}
                />
                )
        }

        return (
            <div>
                <div className="xEdit-workspace" style={{display: 'block'}}>
                    <section id="xEdit-canvas" ref={el => (this.container = el)} className="xEdit-canvasContainer">
                        <div className={"xEdit-canvas-parent-container"}>
                            <img className="xEdit-original" src={original} style={{opacity: this.state.originalOpacity}} onLoad={this.onImgLoad}/>
                            {/*<div ref={this.state.renderMaskRef} className="xEdit-mask" onMouseMove={this._onMouseMove}*/}
                            {/*     onWheel={this._handleZoom} onMouseEnter={this._handleLoop}*/}
                            {/*     onMouseLeave={this._handleLoop} style={{opacity: this.state.maskOpacity}}/>*/}
                            {maskDrawingCanvas}
                            {/*<div ref={this.state.renderRasterRef} className="xEdit-raster-image"/>*/}
                            {/*<FontAwesomeIcon icon={faCrosshairs} style={{ position: 'absolute', zIndex: 10, color: 'rgba(255,255,255,1)', right: '50%', top: '50%'}} size="1x"/>*/}
                        </div>
                    {/*    <div className="xEdit-mask-opacity-bar">*/}
                    {/*        <Grid container spacing={2}>*/}
                    {/*            <Typography id="continuous-slider" style={{color: '#ffffff', left: '45%', paddingRight:'2%', paddingTop: '2.75%'}}>*/}
                    {/*                Mask Opacity*/}
                    {/*            </Typography>*/}
                    {/*            <Grid item xs>*/}
                    {/*                <Slider defaultValue={50} onChange={(e) => this._handleMaskOpacity(e)}*/}
                    {/*                        max={100} min={0} step={1} aria-labelledby="continuous-slider" />*/}
                    {/*            </Grid>*/}
                    {/*        </Grid>*/}
                    {/*    </div>*/}
                    {/*    <div className="xEdit-raster-opacity-bar">*/}
                    {/*        <Grid container spacing={2} direction="row">*/}
                    {/*            <Typography id="continuous-slider" style={{color: '#ffffff', left: '45%', paddingRight:'2%', paddingTop: '2.75%'}}>*/}
                    {/*                New Background Opacity*/}
                    {/*            </Typography>*/}
                    {/*            <Grid item xs>*/}
                    {/*                <Slider defaultValue={0} onChange={(e) => this._handleNewBackgroundOpacity(e)}*/}
                    {/*                        max={100} min={0} step={1} aria-labelledby="continuous-slider" />*/}
                    {/*            </Grid>*/}
                    {/*        </Grid>*/}
                    {/*    </div>*/}
                    {/*</section>*/}
                    {/*<section className="xEdit-menu-bar" style={{width: 50}}>*/}
                    {/*    <div className="xEdit-splitter"/>*/}
                    {/*    <div className="xEdit-vertical-align" style={{flex: 2, width: '100%'}}>*/}
                    {/*        <ul id="xEdit-tool-menu" style={{paddingInlineStart: 10}}>*/}
                    {/*            <li id="xEdit-grab-cut" className="xEdit-left-menu-listitem-a" style={{marginBottom: 8,}}>*/}
                    {/*                <img src={removeBackgroundIcon} alt='' className="xEdit-left-menu-icon-panel"/>*/}
                    {/*            </li>*/}
                    {/*            <li id="xEdit-precision-brush" className="xEdit-left-menu-listitem-a"*/}
                    {/*                onClick={(e) => this.precisionBrush(e)}>*/}
                    {/*                <img src={brushIcon} alt=''className="xEdit-left-menu-icon-panel"/>*/}
                    {/*            </li>*/}
                    {/*            <li id="xEdit-re-center" className="xEdit-left-menu-listitem-a">*/}
                    {/*                <img src={reCenterIcon} alt='' className="xEdit-left-menu-icon-panel"/>*/}
                    {/*            </li>*/}
                    {/*            <li id="xEdit-bounding-box" className="xEdit-left-menu-listitem-a">*/}
                    {/*                <img src={boundingBoxIcon} alt=''className="xEdit-left-menu-icon-panel"/>*/}
                    {/*            </li>*/}
                    {/*        </ul>*/}
                    {/*    </div>*/}
                    {/*</section>*/}
                    {/*<section>*/}
                    {/*    {precisionToolbox}*/}
                    {/*</section>*/}

                    {/*<section id="xEdit-box-bar" className="medium">*/}
                    {/*    <div id="xEdit-navigator-box">*/}
                    {/*        <div id="xEdit-zoom-menu">*/}
                    {/*            <a id="xEdit-zoom=out" title="Zoom out">-</a>*/}
                    {/*            <a id="xEdit-zoom-level">Fit</a>*/}
                    {/*            <input type="range" defaultValue="50" min="0" max="100" step="1" id="xEdit-zoom-slider"/>*/}
                    {/*            <a id="xEdit-zoom-in" title="Zoom in">+</a>*/}
                    {/*            <input type="text" defaultValue="100%" id="xEdit-zoom-input"/>*/}
                    {/*            /!*{zoomList}*!/*/}
                    {/*        </div>*/}
                    {/*        <div className="xEdit-splitter"/>*/}
                    {/*    </div>*/}
                    {/*    <div id="xEdit-layer-box">*/}
                    {/*        <div className="xEdit-title">Views</div>*/}
                    {/*        <div className="xEdit-splitter"/>*/}
                    {/*        <div id="xEdit-layer-box-content">*/}
                    {/*            <div className="xEdit-ss-wrapper">*/}
                    {/*                <div className="xEdit-ss-content">*/}
                    {/*                    <div id="xEdit-layer-list">*/}
                    {/*                        <div className="layer">*/}
                    {/*                            /!*<div ref={this.state.renderThumbnailRef} className="xEdit-thumbnail"/>*!/*/}
                    {/*                            <img src={imageSettingsIcon}*/}
                    {/*                                 title="Image Settings" alt='' className="xEdit-more"/>*/}
                    {/*                            <img src={visibleIcon} className="xEdit-visibility"*/}
                    {/*                                 title="Visible" alt=''/>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*                <div className="xEdit-ss-scroll .xEdit-ss-hidden" style={{height: '99.0385%', top: '0%'}}/>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div id="xEdit-box-bar-bottom"/>*/}
                    {/*    <div id="xEdit-next-image" title="Next image">*/}
                    {/*        <img src={moveUpIcon} alt=''/>*/}
                    {/*    </div>*/}
                    {/*    <div id="xEdit-previous-image" title="Previous image">*/}
                    {/*        <img src={moveDownIcon} alt=''/>*/}
                    {/*    </div>*/}
                    {/*</section>*/}
                    {/*<section id="xEdit-bottom-bar">*/}
                    {/*<span id="xEdit-history" style={{marginRight: 32}}>*/}
                    {/*    <a className={this.state.undoStatus ? 'active' : 'disabled'} title="Undo ctrl+z" onClick={(e) => this.cUndo(e)}>*/}
                    {/*        <img src={undoIcon} alt=''/>*/}
                    {/*        Undo*/}
                    {/*    </a>*/}
                    {/*    <a className={this.state.redoStatus ? 'active' : 'disabled'} title="Redo ctrl+y" onClick={(e) => this.cRedo(e)}>*/}
                    {/*        <img src={redoIcon} alt=''/>*/}
                    {/*        Redo*/}
                    {/*    </a>*/}
                    {/*</span>*/}
                    {/*    <a title="Close" className="xEdit-close" style={{color: '#ffffff', marginRight:32, fontFamily: "Roboto", fontWeight:700, letterSpacing:2, textTransform:'uppercase'}} onClick={(e) => this.handleClose(e)}>CLOSE</a>*/}
                    {/*    <a title="Save" className="xEdit-save" style={{color: '#ffffff', fontFamily: "Roboto", fontWeight:700, letterSpacing:2, textTransform:'uppercase'}} onClick={(e) => this.handleSave(e)}>SAVE</a>*/}
                    </section>
                </div>
            </div>
        );
    }
}
// <FontAwesomeIcon icon={faTrashAlt} style={{ color: 'rgba(52,52,52,0.5)'}} size="1.5x" />