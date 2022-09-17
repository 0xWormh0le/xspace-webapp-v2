import React from 'react';
// import original from './xedit-test.png';
// import mask from './xedit-test-mask.png';
import Canvas from './canvas'
import LeftToolPanel from "./leftToolPanel";
import BottomToolPanel from "./bottomToolPanel";
import ThumbnailPanel from "./ThumbnailPanel";
import {API_ROOT} from "../../index";
import axios from "axios";

export default class XeditView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalAssetList: [],
            maskAssetList: [],
            workingImgLoaded: false,
            mask: null,
            original: null,
            backgroundBrush: true,
            strokeColor: 'rgba(0,0,0,1)',
            catenaryColor: 'rgba(255,255,255,1)',
            strokeWidth: 125,
            undoClickCounter: 0,
            requestSave: false,
            maskOpacity: 0.5,
            assetIndex: 0,
            productIndex: 0,
            rasterBackgroundColor: '#FFFFFF',
            rasterBackgroundOpacity: 1.0,
            productInfoList:[]
        }

        this.handleImgLoad = this.handleImgLoad.bind(this)
        this.handleBackgroundBrush = this.handleBackgroundBrush.bind(this)
        this.handleStrokeInputWidth = this.handleStrokeInputWidth.bind(this)
        this.handleStrokeWidth = this.handleStrokeWidth.bind(this)
        this.handleUndo = this.handleUndo.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleAssetIndex = this.handleAssetIndex.bind(this)
        this.handleMaskOpacity = this.handleMaskOpacity.bind(this)
        this.getAllProductInfo = this.getAllProductInfo.bind(this)
        this.handleRasterBackgroundOpacity = this.handleRasterBackgroundOpacity.bind(this)
    }

    componentDidMount(){
        document.title = 'XSPACE | Editor'
        if (this.props.getXEditWorkload.originalAssets) {
            if (this.props.getXEditWorkload.originalAssets.length > 0) {
                if (this.props.getXEditWorkload.maskAssets.length > 0) {
                    console.log('mounting xedit with 1:', this.props.getXEditWorkload.originalAssets,
                        this.props.getXEditWorkload.maskAssets,
                        this.props.getXEditWorkload.originalAssets[0],
                        this.props.getXEditWorkload.maskAssets[0],
                        this.props.getXEditWorkload.product_info)
                    this.setState({
                        originalAssetList: this.props.getXEditWorkload.originalAssets,
                        maskAssetList: this.props.getXEditWorkload.maskAssets,
                        original: this.props.getXEditWorkload.originalAssets[0],
                        mask: this.props.getXEditWorkload.maskAssets[0],
                        productInfoList: this.props.getXEditWorkload.product_info})
                } else {
                    console.log('mounting xedit with 2:', this.props.getXEditWorkload.originalAssets,
                        this.props.getXEditWorkload.originalAssets[0],
                        this.props.getXEditWorkload.product_info)
                    this.setState({
                        originalAssetList: this.props.getXEditWorkload.originalAssets,
                        original: this.props.getXEditWorkload.originalAssets[0],
                        productInfoList: this.props.getXEditWorkload.product_info
                    })
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdate (before):', prevProps, prevState, snapshot)
        console.log('xeditView componentDidUpdate (after):', this.props, this.state)
    }

    handleImgLoad(value) {
        // console.log('handleImgLoad fired with:', `${value}`)
        this.setState({workingImgLoaded: value})
    }

    handleAssetIndex(value) {
        this.setState({
            original: this.state.originalAssetList[value],
            mask: this.state.maskAssetList[value],
            assetIndex: value})
    }

    handleUndo(value, event) {
        // console.log('handleUndo received:', value, event.type)
        if (event) {
            if (event.type === 'click') {
                // console.log('adding 1')
                let tempCount = this.state.undoClickCounter
                this.setState({undoClickCounter: tempCount + value})
            }
        } else {
            if (value === -1) {
                // console.log('subtracting 1')
                let tempCount = this.state.undoClickCounter
                this.setState({undoClickCounter: tempCount + value})
            }
        }
    }

    handleSave(value, event, data) {
        // console.log('handleSave fired with:', value, event, data)
        if (event) {
            if (event.type === 'click') {
                console.log('handleSave fired')
                if (this.state.requestSave !== true) {
                    this.setState({requestSave: true})
                }
            }
        } else {
            if (value === false) {
                this.setState({requestSave: false})
                this.props.saveAsset(data)
            }
        }
    }

    handleClose(event) {
        if (event.type === 'click') {
            this.setState({original: null, mask: null})
        }
    }

    handleMaskOpacity(event) {
        if (event.target.ariaValueNow === null) {console.log('caught Nan')} else {
            let updatedValue = (event.target.ariaValueNow === '' ? 0 : parseFloat(event.target.ariaValueNow))/100
            this.setState({maskOpacity: updatedValue})
        }
    }

    handleRasterBackgroundOpacity(event) {
        if (event.target.ariaValueNow === null) {console.log('caught Nan')} else {
            let updatedValue = (event.target.ariaValueNow === '' ? 0 : parseFloat(event.target.ariaValueNow))/100
            this.setState({rasterBackgroundOpacity: updatedValue})
        }
    }

    handleBackgroundBrush(event) {
        // console.log('handleBB received:', event.type)
        if (event.type === 'click') {
            // console.log('handleBB fired')
            const tempValue = this.state.backgroundBrush
            this.setState({backgroundBrush: !this.state.backgroundBrush})
            // console.log('tempValue', tempValue)
            if (tempValue === false) {
                // console.log('setting stroke color to rgba(0,0,0,1)')
                this.setState({
                    strokeColor: 'rgba(0,0,0,1)',
                    catenaryColor: 'rgba(255,255,255,1)'})
            } else {
                // console.log('setting stroke color to rgba(255,255,255,1)')
                this.setState({
                    strokeColor: 'rgba(255,255,255,1)',
                    catenaryColor: 'rgba(0,0,0,1)'})
            }
        }
    }

    handleStrokeInputWidth(e) {
        // console.log('handleStrokeInputWidth fired with:', e.target.value)
        this.setState({strokeWidth: e.target.value === '' ? 0 : Number(e.target.value)})
    }

    handleStrokeWidth(e) {
        this.setState({strokeWidth: Number(e.target.value)})
    }

    getAllProductInfo() {
        let apiUrl = API_ROOT + '/api/xEdit-products/?format=datatables'

        let thisScope = this;
        const config = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'authorization': 'Bearer ' + this.props.accessToken
            },
        }

        const body = JSON.stringify({
            "userid": this.user_id,
        });

        // const result1 = axios.post(apiUrl,body,config);

        axios.post(apiUrl, body, config)
            .then(function (response) {
                const newProduct = response.data.data.map((product) => {
                    return product;
                });
                thisScope.setState({
                    productData: newProduct,
                    productDataLoaded: true
                })
            })
    }

    render() {
        let canvas = (
            <Canvas
                handleImgLoad={this.handleImgLoad}
                undo={this.handleUndo}
                handleSave={this.handleSave}
                undoCounter={this.state.undoClickCounter}
                requestSave={this.state.requestSave}
                strokeColor={this.state.strokeColor}
                strokeWidth={this.state.strokeWidth}
                catenaryColor={this.state.catenaryColor}
                maskImg={this.state.mask}
                originalImg={this.state.original}
                maskOpacity={this.state.maskOpacity}
                assetIndex={this.state.assetIndex}
                original_url={this.state.originalAssetList[this.state.assetIndex.valueOf()]}
                mask_url={this.state.originalAssetList[this.state.assetIndex.valueOf()]}
                product_info={this.state.productInfoList[this.state.productIndex.valueOf()]}
                rasterBackgroundColor={this.state.rasterBackgroundColor}
                rasterBackgroundOpacity={this.state.rasterBackgroundOpacity}
            />
        )

        let leftPanel = (
            <LeftToolPanel
                backgroundBrush={this.state.backgroundBrush}
                strokeWidth={this.state.strokeWidth}
                handleBackgroundBrush={this.handleBackgroundBrush}
                handleStrokeInputWidth={this.handleStrokeInputWidth}
                handleStrokeWidth={this.handleStrokeWidth}/>
        )

        let thumbnailPanel = (
            <ThumbnailPanel
                assetList={this.state.originalAssetList}
                handleAssetIndex={this.handleAssetIndex}/>
        )

        let bottomPanel = (
            <BottomToolPanel
                undo={this.handleUndo}
                save={this.handleSave}
                close={this.handleClose}
                handleMaskOpacity={this.handleMaskOpacity}
                handleRasterBackgroundOpacity={this.handleRasterBackgroundOpacity}/>
        )

        return (
            <div style={{position: 'absolute', backgroundColor: '#171719', top:108, bottom:0, left:0, right:0, paddingTop: 25, paddingLeft: 68}}>
                {leftPanel}
                {canvas}
                {thumbnailPanel}
                {bottomPanel}
            </div>
        )
    }
}