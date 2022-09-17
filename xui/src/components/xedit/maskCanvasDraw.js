import React, { Component } from "react";
import CanvasDraw from "react-canvas-draw";

export default class MaskCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: props.color,
            brushRadius: Math.trunc(props.brushRadius*props.scale),
            lazyRadius: 12,
            imgSource: props.maskUrl,
            scale: props.scale,
            imgName: props.imgName,
            width: props.width,
            height: props.height,
            maskOpacity: props.maskOpacity,
            displayWidth: props.displayWidth,
            displayHeight: props.displayHeight,
            saveableCanvas: null,
            canvasList: [],
            saving: false
        }
    }

    componentDidMount() {
        console.log('maskCanvas', this.state)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log('!!!!!!!!MaskCanvasDraw updated')
        if (this.props.undoCounter > 0) {
            console.log('this.saveableCanvas Undo')
            this.saveableCanvas.undo()
            this.props.undo(-1, false)
            this.props.handleCurrentDrawing(this.saveableCanvas.getSaveData())
        }
        if (this.props.requestDrawing === true) {
            this.props.handleCurrentDrawing(this.saveableCanvas.getSaveData())
        }
        if (prevState.brushRadius !== Math.trunc(this.props.brushRadius*this.props.scale)) {
            this.setState({brushRadius: Math.trunc(this.props.brushRadius*this.props.scale)})
        }
        if (prevProps.maskUrl !== this.props.maskUrl || prevProps.assetIndex !== this.props.assetIndex) {
            console.log('clearing canvas')
            this.setState({imgSource: this.props.maskUrl}, () => {
                this.saveableCanvas.clear()
                this.setState({
                    width: this.props.width,
                    height: this.props.height,
                    displayWidth: this.props.displayWidth,
                    displayHeight: this.props.displayHeight
                })
            })
            // this.props.handleCurrentDrawing(this.saveableCanvas.getSaveData())
        } else if (prevProps.width !== this.props.width || prevProps.height !== this.props.height || prevProps.displayWidth !== this.props.displayWidth ||
            prevProps.displayHeight !== this.props.displayHeight) {
            this.setState({
                width: this.props.width,
                height: this.props.height,
                displayWidth: this.props.displayWidth,
                displayHeight: this.props.displayHeight
            })
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // console.log('maskCanvasDraw will receive Props', nextProps, nextContext)
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        // console.log('maskCanvas willupdate Props', nextProps, nextState, nextContext)
    }

    render () {
        if (this.state.imgSource) {
            return (
                <CanvasDraw
                    ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                    catenaryColor={this.props.catenaryColor}
                    brushColor={this.props.color}
                    brushRadius={this.state.brushRadius}
                    imgSrc={this.state.imgSource}
                    loadTimeOffset={5}
                    canvasWidth={this.state.displayWidth}
                    canvasHeight={this.state.displayHeight}
                    style={{position: 'absolute', cursor: 'none', zIndex: 10, left:0, top:0, opacity:this.props.maskOpacity,
                        height: this.state.displayHeight, width: this.state.displayWidth}}
                />
            )
        } else {
            return (
                <CanvasDraw
                    ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                    catenaryColor={this.props.catenaryColor}
                    brushColor={this.props.color}
                    brushRadius={this.state.brushRadius}
                    loadTimeOffset={5}
                    canvasWidth={this.state.displayWidth}
                    canvasHeight={this.state.displayHeight}
                    style={{position: 'absolute', cursor: 'none', zIndex: 10, left:0, top:0, opacity:this.props.maskOpacity,
                        height: this.state.displayHeight, width: this.state.displayWidth}}
                />
            )
        }
    }
}
