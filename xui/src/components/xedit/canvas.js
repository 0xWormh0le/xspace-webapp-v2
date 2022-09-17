import React from 'react';
import MaskCanvas from "./maskCanvasDraw";
import RasterBackground from "./rasterBackground"
// import RasterView from "./rasterViewer2";
// import MaskView from "./maskViewer2"
// import original from "./xedit-test.png";
// import mask from "./xedit-test-mask.png";
// import p5 from 'p5';
import RasterView from "./rasterViewer";
import ZoomView from "./zoomView"

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalLink: props.originalImg,
            maskLink: props.maskImg,
            scale: 1,
            notUpdated: true,
            imgDisplayHeight: 1,
            imgDisplayWidth: 1,
            imgNaturalHeight: 1,
            imgNaturalWidth: 1,
            maskOpacity: 0.5,
            currentDrawing: [],
            requestDrawing: false,
            requestRasterUpdate: false,
            rasterInitialized: false
        }
        this.tallestHeight = 725
        this.widestWidth = 600
        
        this.onImgLoad = this.onImgLoad.bind(this)
        this.handleCurrentDrawing = this.handleCurrentDrawing.bind(this)
        this.handleRasterUpdate = this.handleRasterUpdate.bind(this)
        this.rasterInitializer = this.rasterInitializer.bind(this)


        // this.state.renderRasterRef = React.createRef()
        // this.state.renderZoomMaskRef = React.createRef()
        // this.state.renderZoomRasterRef = React.createRef()
    }

    componentDidMount() {
        this.setState({
            originalLink: this.props.originalImg,
            maskLink: this.props.maskImg})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('canvas updated', this.state, this.props)
        console.log('first link', this.state.originalLink)
        if (this.props.assetIndex !== prevProps.assetIndex) {
            this.handleRasterUpdate(false)
        }
        if (this.props.originalImg !== this.state.originalLink) {
            console.log('updating image', this.props.originalImg, prevProps.originalLink)
            this.setState({
                originalLink: this.props.originalImg,
                maskLink: this.props.maskImg
            })
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
    }
    
    componentWillUnmount() {
    }

    onImgLoad({target:img}) {
        console.log('onImgLoad fired')
        this.setState({notUpdated: true}, () => {
            let height
            let width
            const mh = this.tallestHeight
            const mw = this.widestWidth
            // console.log("onImgLoad received:", img)
            if (img.naturalWidth <= img.naturalHeight) {
                console.log('width less than height')
                if (img.naturalHeight > mh) {
                    height = mh
                    width = img.naturalWidth / img.naturalHeight * mh
                } else {
                    height = img.naturalHeight
                    width = img.naturalWidth
                }
            } else {
                console.log('height less than width')
                if (img.naturalWidth > mw) {
                    console.log('height less than width')
                    width = mw
                    height = img.naturalHeight / img.naturalWidth * mw
                } else {
                    height = img.naturalHeight
                    width = img.naturalWidth
                }
            }
            this.setState({
                imgDisplayHeight: Math.trunc(height),
                imgDisplayWidth: Math.trunc(width),
                imgNaturalHeight: img.naturalHeight,
                imgNaturalWidth: img.naturalWidth,
                scale: height/img.naturalHeight/2,
                notUpdated: false
            }, () => {
                this.props.handleImgLoad(true)
                console.log('image height, image width:', img.height, img.width, img.naturalHeight, img.naturalWidth)
            })
        })
    }

    handleRasterUpdate(value) {
        if(value) {
            this.setState({requestDrawing: value})
        }
    }

    handleCurrentDrawing(newDrawing) {
        if (newDrawing.detail) {
            // console.log('newDrawing', newDrawing.detail)
            this.setState({requestDrawing: true})
        }
        else {
            // console.log("handleCurrentDrawing received:", newDrawing)
            this.setState({requestDrawing: false})
            this.setState({currentDrawing: newDrawing})
        }
    }

    rasterInitializer = (value) => {
        this.setState({
            rasterInitialized: value
        })
    }
    
    render() {
        let maskDrawingCanvas
        let rasterCanvas
        let rasterBackground
        let zoomCanvas
        let imgName

        if (this.state.originalLink) {
            if (this.state.imgNaturalWidth !== 1) {
                if (this.state.maskLink) {
                    imgName = this.state.maskLink.split('/')
                    try {
                        imgName = (imgName[imgName.length - 1])
                    } catch (err) {
                        console.log(err)
                        imgName = "saveableAsset"
                    }
                } else {
                    // we don't have a link to go off of so we'll just use a blank canvas based on the original image
                    imgName = this.state.originalLink.split('/')
                    try {
                        imgName = (imgName[imgName.length - 1])
                    } catch (err) {
                        console.log(err)
                        imgName = "saveableAsset"
                    }

                }
                maskDrawingCanvas = (
                    <MaskCanvas
                        color={this.props.strokeColor}
                        catenaryColor={this.props.catenaryColor}
                        brushRadius={this.props.strokeWidth}
                        lazyRadius={12}
                        maskUrl={this.state.maskLink}
                        scale={this.state.scale}
                        imgName={imgName}
                        width={this.state.imgNaturalWidth}
                        height={this.state.imgNaturalHeight}
                        maskOpacity={this.props.maskOpacity}
                        displayWidth={this.state.imgDisplayWidth}
                        displayHeight={this.state.imgDisplayHeight}
                        undo={this.props.undo}
                        undoCounter={this.props.undoCounter}
                        handleCurrentDrawing={this.handleCurrentDrawing}
                        requestDrawing={this.state.requestDrawing}
                        assetIndex = {this.props.assetIndex}
                    />
                )
            if (this.state.notUpdated === false) {
                rasterCanvas = (
                    <RasterView
                        originalImg={this.state.originalLink}
                        maskImg={this.state.maskLink}
                        drawing={this.state.currentDrawing}
                        scale={this.state.scale}
                        imgDisplayWidth={this.state.imgDisplayWidth}
                        imgDisplayHeight={this.state.imgDisplayHeight}
                        imgNaturalWidth={this.state.imgNaturalWidth}
                        imgNaturalHeight={this.state.imgNaturalHeight}
                        handleSave={this.props.handleSave}
                        requestSave={this.props.requestSave}
                        original_url={this.props.original_url}
                        mask_url={this.props.mask_url}
                        product_info={this.props.product_info}
                        requestUpdate={this.state.requestRasterUpdate}
                        rasterInitialized={this.state.rasterInitialized}
                        rasterInitializer={this.rasterInitializer}
                    />
                )
            }
            zoomCanvas = (
                <ZoomView/>
            )
            rasterBackground = (
                <RasterBackground
                    imgDisplayWidth={this.state.imgDisplayWidth}
                    imgDisplayHeight={this.state.imgDisplayHeight}
                    backgroundColor={this.props.rasterBackgroundColor}
                    backgroundOpacity={this.props.rasterBackgroundOpacity}/>
            )
            }

            return (
                <div style={{display: 'flex', flexDirection:'row', justifyContent: 'space-around', maxHeight: '90%', maxWidth: '70%', marginTop:"auto"}}>
                    <div style={{position: "relative", top: 0, left:0, maxHeight: "inherit", width: Math.trunc(this.widestWidth*.3)}} onClick={(e)=>this.handleCurrentDrawing(e)}>
                        <img style={{position: 'relative', zIndex: 1, left:0, top:0, maxHeight: this.tallestHeight, maxWidth: this.widestWidth}} src={this.state.originalLink} onLoad={this.onImgLoad} alt='original'/>
                        {maskDrawingCanvas}
                    </div>
                    <div style={{position: "relative", top: 0, left:0, maxHeight: "inherit", width: Math.trunc(this.widestWidth*.3)}}>
                        {zoomCanvas}
                    </div>
                    <div style={{position: "relative", display: 'flex', top: 0, left:0, maxHeight: "inherit", width: Math.trunc(this.widestWidth*.3)}}>
                        <div style={{zIndex:20, order:0}}>
                            {rasterBackground}
                        </div>
                        <div style={{zIndex:21, opacity: 1, order:1}}>
                            {rasterCanvas}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<div/>)
        }
    }
}