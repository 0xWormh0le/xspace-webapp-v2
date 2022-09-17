import React, {Component} from 'react';
import Worker from "./raster.worker";

export default class RasterBackground extends Component {

    constructor(props) {
        super(props)
        this.state = {
            backgroundColor: props.backgroundColor,
            backgroundOpacity: props.backgroundOpacity
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.setState({
                backgroundColor: this.props.backgroundColor,
                backgroundOpacity: this.props.backgroundOpacity,
            })
        }
    }

    render() {
        return (
            <div style={{
                position: 'absolute',
                width: this.props.imgDisplayWidth,
                height: this.props.imgDisplayHeight,
                backgroundColor: this.state.backgroundColor,
                opacity: this.state.backgroundOpacity}}
            />
        )
    }
}