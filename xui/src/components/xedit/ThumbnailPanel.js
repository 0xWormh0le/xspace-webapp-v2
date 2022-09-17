import React, { Component } from "react";
import XEditThumbnailViews from "./ThumbnailViewer"

export default class ThumbnailPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assetList: props.assetList,
            activeAssetIndex:0
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.assetList !== prevProps.assetList) {
            this.setState({assetList: this.props.assetList})
        }
    }

    render() {
        let previewView = <div/>
        if (this.state.assetList) {
            if (this.state.assetList.length > 0) {
                // console.log('assetList length in thumbnail view', this.state.assetList.length, this.state.assetList)
                previewView = <XEditThumbnailViews assetList={this.state.assetList}
                                                   handleAssetIndex={this.props.handleAssetIndex}
                                                   viewMode={0}/>
            }
        }
        return(
            <div className="xEdit-box-bar" style={{position: 'absolute', width: 100, top: 0, right: 0, bottom: 0, backgroundColor: '#292c31', display: 'flex', flexFlow: 'column'}}>
                {previewView}
            </div>
        )
    }
}