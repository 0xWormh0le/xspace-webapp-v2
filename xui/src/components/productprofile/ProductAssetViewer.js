import React, { Component } from 'react';
import styled from 'styled-components';
import { ModalBody, MDBModal, MDBModalBody, MDBModalHeader } from 'mdbreact';
import { MDBContainer, MDBModalFooter } from 'mdbreact';
import ReactHtmlParser from 'react-html-parser';
// import UpgradeView from '../UpgradeView';
import ImageViews from './ViewerImage'
import ImageThumbnailViews from './ViewerImageThumbnail'
import SpinViews from './ViewerSpin'
import './productprofile.css';
import Slider from 'react-styled-carousel';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductProfileEdit from './ProductProfileEdit'
import FullscreenFile from './FullscreenFile';
import { ContextMenu, MenuItem } from "react-contextmenu"
import {faChevronLeft, faChevronRight} from "@fortawesome/pro-regular-svg-icons";
import downloadAsset from "./downloadAsset";

const ProductViewHeader = styled.div`
  color: #333330;
  text-align: left;
  h1 {
    font-size: 28px;
    line-height: 36px;
    font-weight: 400;
    margin: 0;
  }
  h5 {
    font-size: 12px;
    line-height: 20px;
    opacity: .5;
  }
  span {
    width: 100%;
    height: 36px;
    border-radius: 10px;
    background-color: #333333;
    padding: 0 25px;
    font-size: 14px;
    line-height: 36px;
    display: block;
    color: #ffffff;
  }
`

const Wrapper = styled.div`
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 0.3rem;
  background-color: #ffffff;
  max-height: 600px;
  padding: 18px 25px;
`

const ProductViewWrapper = styled(Wrapper)`
  padding: 0;
  min-height: 600px;
  h4.publish-txt {
    color: #27AE60;
    font-size: 16px;
    line-height: 24px;
    font-weight: bold;
    text-align: left;
    margin: 0;
    padding: 1rem;
    border-bottom: 2px solid #F4F5FA;
  }
  div.product-viewer {
    padding: 54px;
    padding-top: 20px;
  }
  div.product-details {
    display: flex;
    align-items: center;
    justify-content: space-around;
    h4 {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
      color: #333333;
      font-weight: bold;
      flex: 1;
      margin-top: 15px;
      border-right: 2px solid #F4F5FA;
    }
    h4:last-child {
      border: none;
    }
  }
  div.view-mode {
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      padding: 4px;
      border-radius: 19px;
      border: 1px solid #F4F5FA;
      background-color: rgba(244, 245, 250, .4);
    }
    button {
      width: 76px;
      height: 30px;
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
      border-radius: 15px;
      color: #333333;
    }
    p {
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
      color: #333333;
      margin: 0;
      padding: 10px;
      border: 2px solid #F4F5FA;
      border-radius: 20px;
    }
  }
  div.flex-box {
    display: flex;
    padding: 25px 0;
    height: 390px;
    & > div {
      width: calc(100% - 75px);
      margin-left: 25px;
    }
    header {
      width: 70px;
      flex: none;
      .car-flex {
        display: block;
        padding: 2px;
        .car-nav-item {
          display: block;
          border: 2px solid #F4F5FA;
          border-radius: 10px;
          margin-bottom: 10px;
        }
      }
    }
    iframe {
      position: relative;
      width: 600px;
      height: 600px;
      -webkit-transform: scale(0.6);
      -moz-transform: scale(0.6);
      -o-transform: scale(0.6);
      -webkit-transform: scale(0.6);
      -ms-transform: scale(0.6);
      transform: scale(0.6);
      margin: 0;
      top: -140px;
    }
  }
`

const ViewMode = styled.button`
  background-color: ${props => props.active ? '#00A3FF' : 'white'};
  color: ${props => props.active ? '#fff !important' : '#333333'};
  border: ${props => props.active ? 'none' : '1px solid #F4F5FA'};
`

const StyledSlider = styled(Slider)`
  &&& {
    overflow-x: hidden;
    max-height: 340px;
    border-radius: 10px;
    border: 2px solid #F4F5FA;
    min-height: 300px;
    img {
      max-height: 290px;
      width: auto;
      margin: 0;
    }
  }
`

const ProductDescWrapper = styled(Wrapper)`
  text-align: left;
  height: 100%;
  h4 {
    font-size: 16px;
    line-height: 26px;
    color: #333330;
    font-weight: bold;
    margin: 0;
    padding-bottom: 3.5%;
  }
  .description {
    height: 20%;
    position: relative;
    margin-bottom: 7.5%;
    overflow-y: scroll;
    line-height: 20px;
    ::-webkit-scrollbar {display: none;}
    p {
      font-size: 14px;
      line-height: 20px;
      color: #000000;
      display: block;
      display: -webkit-box;
      width: 100%;
      margin: 0 auto;
      -webkit-line-clamp: 6;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      overflow-y: scroll;
      overflow-x: hidden;
      overflow-wrap: break-word;
      scrollbar-width: none;
      ::-webkit-scrollbar {display: none;}
    }
  }
  .span {
    position: absolute;
    top: 27.5%;
    right: 10%;
    color: #00A3FF;
    font-size: 14px;
    line-height: 20px;
    :hover {
      cursor: pointer;
    }
  }
  div.detail {
    color: #333330;
    padding-bottom: 10px;
    p {
      font-size: 12px;
      opacity: .5;
      line-height: 20px;
      margin: 0;
    }
    h5 {
      font-size: 18px;
      line-height: 26px;
      margin: 0;
    }
  }
  button {
    bottom: 0px;
    width: 100%;
    height: 58px;
    background-color: #00A3FF;
    border-radius: 29px;
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
    color: #fff;
    border: none;
    margin-top: 18px;
  }
`

const ProductInfoModal = styled(MDBModal)`
  overflow-y: hidden;
  .modal-content {
    max-width: 848px;
    height: auto;
    margin: 0 auto;
    margin-top: 10%;
    .modal-header {
      border: none;
      overflow-y: hidden;
      .modal-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        b {
          color: #333333;
          font-size: 16px;
          line-height: 26px;
        }
        button {
          width: 120px;
          border: none;
          height: 38px;
          font-size: 14px;
          font-weight: bold;
          line-height: 20px;
          background-color: white;
          margin: 0 5px;
          border-radius: 19px;
        }
        button:first-child {
          color: #EB5757;
          :hover {
            background-color: #EB5757;
            color: white;
          }
        }
        button:last-child {
          color: #27AE60;
          :hover {
            background-color: #27AE60;
            color: white;
          }
        }
      }
      button.close {
        display: none;
      }
    }
    .modal-body {
      overflow-y: hidden;
      width: 100%;
    }
  }
`

const FullscreenFileModal = styled(MDBModal)`
  .modal-content {
    border-radius: 10px;
    .modal-body {
      width: 100%;
      padding: 0;
    }
  }
`
const StyledModal = styled(MDBModal)`
  min-width: 848px;
  height: auto;
  .modal-content {
    border-radius: 10px;
  }
  .modal-header {
    height: auto;
    border: none;
    .modal-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 90%;
      b {
        color: #333333;
        font-size: 16px;
        line-height: 26px;
        :hover {
          cursor: pointer;
        }
      }
    }
  }

  .modal-body {
    height: auto;
    .container {
      height: auto;
      padding: 45px 90px;
      h4 {
        font-size: 18px;
        line-height: 26px;
        color: #333330;
        font-weight: 400;
        text-align: center;
        margin-bottom: 25px;
      }
      .row {
        justify-content: space-between;
        padding-bottom: 25px;
      }
      .card-item {
        width: 133px;
        height: auto;
        padding-top: 30px;
        border: 2px solid rgba(61, 61, 61, .2);
        border-radius: 10px;
        text-align: center;
        img {
          width: 32px;
          margin-bottom: 9px;
        }
        h6, p {
          font-size: 11px;
          line-height: 26px;
          margin: 0;
          font-weight: 400;
        }
        h6 {
          font-weight: bold;
        }
      }
      center {
        display: flex;
        align-items: center;
        justify-content: center;
        a, button {
          width: 133px;
          height: 38px;
          background-color: #00A3FF;
          color: #ffffff;
          font-size: 14px;
          font-weight: bold;
          line-height: 20px;
          border-radius: 19px;
          border: none;
        }
        a {
          text-decoration: none;
          color: #333333;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          margin-right: 30px;
          :hover {
            background-color: #00A3FF;
            color: white;
          }
        }
      }
    }
  }
`

export default class ProductAssetViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product: props.product,
            updateProduct: props.product,
            productEditOpen: false,
            fullscreenFileOpen: false,
            isCompact: true,
            billModal: false,
            modalNewFolder: false,
            activeItem: false,
            viewMode: 0,
            count: false,
            current360ViewIndex: 0,
            current2dViewIndex: 0,
            windowWidth: props.windowWidth,
            windowHeight: props.windowHeight,
            spinWasActive: false,
            // xAxisTableLeft: 0,
            // xAxisTableWidth: 0,
            imageIndex: 0,
            assets2d: props.assets2d,
            assets360: props.assets360,
        }

        this.set2DMode = this.set2DMode.bind(this);
        this.set3DMode = this.set3DMode.bind(this);
        this.setARMode = this.setARMode.bind(this);
        this.submit = this.submit.bind(this);
        this.evaluateAccess = this.evaluateAccess.bind(this);
        this.openAssetDialog = this.openAssetDialog.bind(this);
        this.closeAssetDialog = this.closeAssetDialog.bind(this);
        this.expandDescription = this.expandDescription.bind(this);
        this.selectSortBy = this.selectSortBy.bind(this);
        this.toggleFull = this.toggleFull.bind(this);
        this.toggleProductInfoDialog = this.toggleProductInfoDialog.bind(this);
        this.toggleFullscreenFileDialog = this.toggleFullscreenFileDialog.bind(this);
        this.handleNext360 = this.handleNext360.bind(this)
        this.handlePrev360 = this.handlePrev360.bind(this)
        this.handleNextImage = this.handleNextImage.bind(this)
        this.handlePrevImage = this.handlePrevImage.bind(this)
        this.handleContextMenu1 = this.handleContextMenu1.bind(this)
        this.handleContextMenu2 = this.handleContextMenu2.bind(this)
        this.handleContextMenu3 = this.handleContextMenu3.bind(this)
        this.handleImageIndexChange = this.handleImageIndexChange.bind(this)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.state.product !== nextProps.product) {
            this.setState({product: nextProps.product})
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.product !== prevProps.product) {
            this.setState({product: this.props.product})
        }
        if (this.props.assets2d !== prevProps.assets2d) {
            this.setState({assets2d: this.props.assets2d})
        }
        if (this.props.assets360 !== prevProps.assets360) {
            this.setState({assets360: this.props.assets360})
        }
        if (this.props.windowWidth !== prevProps.windowWidth) {
            this.setState({windowWidth: this.props.windowWidth})
        }
        if (this.props.windowHeight !== prevProps.windowHeight) {
            this.setState({windowHeight: this.props.windowHeight})
        }
    }

    componentWillUnmount() {
    }

    handleContextMenu1(){
        downloadAsset({fileInfo: this.state.assets2d[this.state.imageIndex], fileType: this.state.viewMode})
    }

    handleContextMenu2(){
        // send asset to xEdit
        this.props.setXEditWorkload({
            'originalAssets': [this.state.assets2d[this.state.imageIndex].link],
            'maskAssets': [this.state.assets2d[this.state.imageIndex].maskLink],
            'product_info': [this.state.product]
        })
        console.log('set xeditworkload to:', {'originalAssets': [this.state.assets2d[this.state.imageIndex].link], 'maskAssets': [this.state.assets2d[this.state.imageIndex].maskLink]})
        window.location.assign("/#/product-asset/editor")
    }

    handleContextMenu3(){
        // send product to xEdit
        if (this.state.assets2d.length > 0) {
            let assetLinkList = []
            let maskLinkList = []
            this.state.assets2d.map((asset) => {
                assetLinkList.push(asset.link)
                maskLinkList.push(asset.maskLink)
            })
            console.log('set xeditworkload to:', {
                'originalAssets': assetLinkList,
                'maskAssets': maskLinkList,
                'product_info': [this.props.product],
            } )
            this.props.setXEditWorkload({
                'originalAssets': assetLinkList,
                'maskAssets': maskLinkList,
                'product_info': [this.props.product],
            })
            window.location.assign("/#/product-asset/editor")
        }
    }

    handleImageIndexChange(e) {
        console.log('handleImageChange fired with', e.target.id)
        let a = e.target.id
        let currentIndex = this.state.imageIndex
        const originalIndex = this.state.imageIndex
        // console.log(a)
        if (a) {
            console.log('a', a)
            if (a === 'previousImageAsset2D') {
                if (currentIndex === 0) {
                    currentIndex = this.state.assets2d.length - 1
                    // console.log('handleImageChange changed value from', this.state.imageIndex, 'to', currentIndex)
                } else {
                    currentIndex = currentIndex - 1
                    // console.log('handleImageChange changed value from', this.state.imageIndex, 'to', currentIndex)
                }
                if (originalIndex !== currentIndex) {
                    this.setState({imageIndex: currentIndex})
                }
            } else if (a === 'nextImageAsset2D') {
                if (currentIndex === this.state.assets2d.length - 1) {
                    currentIndex = 0
                    // console.log('handleImageChange changed value from', this.state.imageIndex, 'to', currentIndex)
                } else {
                    currentIndex = currentIndex + 1
                    // console.log('handleImageChange changed value from', this.state.imageIndex, 'to', currentIndex)
                }
                if (originalIndex !== currentIndex) {
                    this.setState({imageIndex: currentIndex})
                }
            } else if (a === 'previousAsset360') {
                if (this.state.assets360.html.length > 0) {
                    if (this.state.assets360.length !== 1) {
                        if (this.state.current360ViewIndex > 0) {
                            this.setState({current360ViewIndex: this.state.current360ViewIndex - 1}, () =>
                                console.log('set current360ViewIndex to', this.state.current360ViewIndex))
                        } else {
                            this.setState({current360ViewIndex: this.state.assets360.html.length - 1}, () =>
                                console.log('set current360ViewIndex to', this.state.current360ViewIndex))
                        }
                    }
                }
            } else if (a === 'nextAsset360') {
                if (this.state.assets360.html.length > 0) {
                    if (this.state.assets360.length !== 1) {
                        if (this.state.current360ViewIndex < this.state.assets360.html.length - 1) {
                            this.setState({current360ViewIndex: this.state.current360ViewIndex + 1}, () =>
                                console.log('set current360ViewIndex to', this.state.current360ViewIndex))
                        } else {
                            this.setState({current360ViewIndex: 0}, () =>
                                console.log('set current360ViewIndex to', this.state.current360ViewIndex))
                        }
                    }
                }
            }
        }
        if (originalIndex !== currentIndex) {
            this.setState({imageIndex: currentIndex})
            console.log('newIndex:', currentIndex)
            console.log('asset info', this.state.assets2d[currentIndex])
        }
    }

    handleNext360() {
        console.log('handleNext360 fired')
        if (this.state.assets360) {
            if (this.state.assets360.html.length > 0) {
                if (this.state.assets360.length !== 1) {
                    if (this.state.current360ViewIndex < this.state.assets360.html.length) {
                        // this.setState({current360ViewIndex: this.state.current360ViewIndex + 1})
                    }
                }
            }
        }
    }

    handlePrev360() {
        console.log('handlePrev360 fired')
        if (this.state.assets360) {
            if (this.state.assets360.html.length > 0) {
                if (this.state.assets360.length !== 1) {
                    if (this.state.current360ViewIndex > 0) {
                        // this.setState({current360ViewIndex: this.state.current360ViewIndex - 1})
                    }
                }
            }
        }
    }

    handleNextImage() {
        console.log('handleNextImage fired')
        if (this.state.assets2d) {
            if (this.state.assets2d.length > 0) {
                console.log('this.state.assets2d.length', this.state.assets2d.length)
                if (this.state.assets2d.length !== 1) {
                    if (this.state.current2dViewIndexViewIndex < this.state.assets2d.length) {
                        this.setState({current2dViewIndexViewIndex: this.state.current2dViewIndexViewIndex + 1})
                    }
                }
            }
        }
    }

    handlePrevImage() {
        console.log('handlePrevImage fired')
        if (this.state.assets2d) {
            if (this.state.assets2d.length > 0) {
                if (this.state.assets2d.length !== 1) {
                    if (this.state.current2dViewIndexViewIndex > 0) {
                        this.setState({current2dViewIndexViewIndex: this.state.current2dViewIndexViewIndex - 1})
                    }
                }
            }
        }
    }

    openAssetDialog() {
        this.setState({ modalAsset: true });
    }

    closeAssetDialog() {
        this.setState({modalAsset: false, modalmessage:''});
    }

    evaluateAccess() {
        this.openAssetDialog();
    }

    nextItem() {
        let view = this.state.activeItem;
        if (this.state.assets2d.length > view){
            this.setState({"activeItem":view+1})
        } else if (this.state.assets2d.length >= view) {
            this.setState({"activeItem":1})
        }
    }

    previousItem() {
        let view = this.state.activeItem;
        let check = this.state.assets2d.length;

        if (view > 1){
            this.setState({"activeItem":view-1})
        } else if (view === 1){
            this.setState({"activeItem":check})
        }

    }

    set2DMode = (e) => {
        e.preventDefault()
        this.setState({
            "viewMode": 0,
            "imgtype": '2D'
        });
    }

    set3DMode = (e) => {
        e.preventDefault()
        this.setState({
            "viewMode": 1,
            "imgtype": '360'
        });
    }

    setARMode = (e) => {
        e.preventDefault()
        this.setState({
            "viewMode": 2
        })
    }

    selectSortBy(event) {
        this.setState({
            sortByOpen: !this.state.sortByOpen,
            sortBy: event.target.innerText
        });
    }

    expandDescription() {
        this.setState({isCompact: !this.state.isCompact})
    }

    toggleProductInfoDialog() {
        this.setState({
            productEditOpen: !this.state.productEditOpen, updateProduct: this.state.product
        })
    }

    toggleFullscreenFileDialog() {
        this.setState({
            fullscreenFileOpen: !this.state.fullscreenFileOpen
        })
    }

    toggleFull(idx) {
        // console.log("xyx"+this.state.assets2d)
        // console.log(idx)
        let { assets2d, assets360} = this.props
        var asset = assets2d[idx]
        var active = idx + 1;
        // console.log(asset)
        this.setState({
            asset: asset,
            activeItem: active,
            commentThreadOpen: !this.state.commentThreadOpen,
        });
        this.openAssetDialog();
    }

    onChange = (name, value) => {
        let myProduct = this.state.updateProduct
        myProduct[name] = value;
        console.log(myProduct);
        this.setState({updateProduct: myProduct})
    }

    submit() {
        var link = window.location.href;
        link = link.split("/");
        var slug = link[5];
        const { updateProduct } = this.state
        // var user = localStorage.getItem("username");
        console.log('this.state.product ===> ', updateProduct)
        this.props.updateProduct(slug, updateProduct.SKU, updateProduct.name,
            updateProduct.price, updateProduct.height, updateProduct.width, updateProduct.length,
            updateProduct.description, updateProduct.category, updateProduct.manufacturer,
            updateProduct.upccode, updateProduct.UPCType).then(() => {
            this.toggleEditMode();
            this.toggleProductInfoDialog();
            this.props.retrieveData();
        }).catch(err => {
            console.log(err)
        })
    }

    toggleEditMode = () => {
        let { editing } = this.state;
        this.setState({ "editing": (editing + 1) % 2 });
    }

    render() {
        let {viewMode, isCompact } = this.state
        let productView = (<p>Loading...</p>)
        let uuid = 'missing id'
        let previewView = (<div> - </div>)
        let preview360View = (<div> - </div>)
        let prevHandler = <div/>
        let nextHandler = <div/>
        let previewViewHolder = <div><div id='previewImage'></div><div id='preview360'></div><div id='preview3D'></div></div>
        let thumbnailStrip = (<div> - </div>)
        let productEditModal = (<div> - </div>)
        let fullscreenFileModal = (<div> - </div>)

        function htmlTransformCallback (node) {
            if (node.type === 'tag' && node.name === 'br') {
                return null;
            }
        }

        switch (viewMode) {
            case 0:
                // 2D bucket
                // previewView = <ImageViews assets2d={this.props.assets2d} toggleFull={this.toggleFull} handleImageIndexChange={this.handleImageIndexChange}/>
                previewView = <ImageViews assets2d={this.props.assets2d} toggleFull={this.toggleFull} />
                previewViewHolder = <div style={{marginLeft: 0}}><div key="2d101" id='previewImage'>{previewView}</div><div key="360101" id='preview360' style={{visibility: 'hidden'}}/><div id='preview3D' style={{visibility: 'hidden'}}/></div>
                prevHandler = <div/>
                nextHandler = <div/>
                thumbnailStrip = <div style={{left: 0, marginLeft: 0, width: 70, maxHeight: '100%'}}>
                    <ImageThumbnailViews assets={this.state.assets2d} toggleFull={this.toggleFull} viewMode={viewMode}/>
                </div>
                productView = (<div style={{ marginTop: 0 }}>
                    <img src="https://s3.amazonaws.com/storage.xspaceapp.com/media/img/XSPACE-logo-watermark.png"
                         className="img-fluid img-thumbnail" width="384" height="384" />
                </div>)
                break;
            case 1:
                // 360 bucket
                prevHandler = <FontAwesomeIcon icon={faChevronLeft} id="previousAsset360" style={{position: 'relative', color: 'rgba(52,52,52,0.5)', zIndex:99, left: 0, marginTop:170, marginLeft: 0, cursor: 'pointer'}} size="2x" onClick={() => this.handlePrev360} />
                nextHandler = <FontAwesomeIcon icon={faChevronRight} id="nextAsset360" style={{position: 'relative', color: 'rgba(52,52,52,0.5)', zIndex:99, right: 0, marginTop:170, marginLeft: 0, cursor: 'pointer'}} size="2x" onClick={() => this.handleNext360} />
                preview360View = <SpinViews assets={this.state.assets360} toggleFull={this.toggleFull} current360ViewIndex={this.state.current360ViewIndex}/>
                previewViewHolder = <div style={{marginLeft: 0, borderRadius: 10, border: "2px solid #F4F5FA", }}><div key="2d101" id='previewImage' style={{visibility: 'hidden'}}/><div/><div key="360102" id='preview360' style={{overflowX: 'hidden', maxHeight: 340, minHeight: 300}}>{preview360View}</div><div id='preview3D' style={{visibility: 'hidden'}}/></div>
                thumbnailStrip = <div style={{left: 0, marginLeft: 0, width: 70}}>
                    <ImageThumbnailViews assets={this.state.assets2d} toggleFull={this.toggleFull}
                                         viewMode={viewMode}/>
                </div>
                productView = (
                    <img src="https://s3.amazonaws.com/storage.xspaceapp.com/media/img/XSPACE-logo-watermark.png"
                         className="img-fluid img-thumbnail" width="384" height="384" />
                )
                break;
            case 2:
                // 3D bucket
                prevHandler = <div/>
                nextHandler = <div/>
                previewViewHolder = <div><div id='previewImage' style={{visibility: 'hidden'}}/><div key="360101" id='preview360' style={{visibility: 'hidden'}}/><div id='preview3D'><p>3D models coming soon</p></div></div>
                thumbnailStrip = <div style={{left: 0, marginLeft: 0}}>
                    <ImageThumbnailViews assets={this.state.assets2d} toggleFull={this.toggleFull}
                                         viewMode={viewMode}/>
                </div>
                productView = (<div style={{ marginTop: 0 , marginLeft: 0}}>
                    <h3>3D models are currently not available for this product.</h3>
                </div>)
                break;
        }

        // IF THERE IS A PRODUCT
        if (this.state.product) {
            if (this.state.product.uniqueID) {
                uuid = this.state.product.uniqueID.substring(0, 8)
            }
        }

        let assetModal = (
            <StyledModal isOpen={this.state.modalAsset} toggle={this.closeAssetDialog} centered>
                <MDBModalBody>
                    <div className="row">
                        <div className="col-md-12" style={{ margin: 'auto' }}>
                            <MDBContainer>
                                <FullscreenFile
                                    userInfo={this.props.userInfo}
                                    processing={this.state.processing}
                                    cancel={this.closeAssetDialog}
                                    activeItem={this.state.activeItem}
                                    assets2d={this.state.assets2d}
                                    findMessageThread={this.props.findMessageThread}
                                    createMessage={this.props.createMessage}
                                    deleteFilesRSAA={this.props.deleteFilesRSAA}
                                    previousItem={this.previousItem}
                                    nextItem={this.nextItem}>
                                </FullscreenFile>
                            </MDBContainer>
                            <center>
                            </center>
                        </div>
                    </div>
                </MDBModalBody>
                <MDBModalFooter>
                </MDBModalFooter>
            </StyledModal>
        )

        // PRODUCT VIEW
        if (this.state.product) {
            productView = (
                <div>
                    <ProductViewHeader>
                        <div className="row">
                            <div className="col-sm-9">
                                <h1>{this.state.product.name}</h1>
                                <h5>{this.state.product.category}</h5>
                            </div>
                            <div className="col-sm-3">
                                <span>{`XSPACE ID: ${uuid}`}</span>
                            </div>
                        </div>
                    </ProductViewHeader>
                    <div className="row">
                        <div className="col-sm-9">
                            <ProductViewWrapper>
                                <h4 className="publish-txt">Published</h4>
                                <div className="product-viewer">
                                    <div className="view-mode">
                                        <div>
                                            <ViewMode onClick={(e) => {
                                                this.set2DMode(e)
                                            }} active = {viewMode === 0}>2D</ViewMode>
                                            <ViewMode onClick={(e) => {
                                                this.set3DMode(e)
                                            }} active = {viewMode === 1}>360</ViewMode>
                                            <ViewMode onClick={(e) => {
                                                this.setARMode(e)
                                            }} active = {viewMode === 2}>3D</ViewMode>
                                        </div>
                                    </div>
                                    {/*<div className="flex-box" style={{marginLeft: 0}} onClick={(e) => {this.handleImageIndexChange(e)}}>*/}
                                    <div className="flex-box" style={{marginLeft: 0}} onClick={(e) => {this.handleImageIndexChange(e)}}>
                                        {thumbnailStrip}
                                        {prevHandler}
                                        {previewViewHolder}
                                        {nextHandler}
                                    </div>
                                    <div className="product-details">
                                        <h4>{`UPC: ${this.state.product.upccode}`}</h4>
                                        <h4>{`UPC Type: ${this.state.product.UPCType}`}</h4>
                                        <h4>{`SKU: ${this.state.product.SKU}`}</h4>
                                    </div>
                                </div>
                            </ProductViewWrapper>
                        </div>
                        <div className="col-sm-3">
                            <ProductDescWrapper>
                                <h4>Product Description</h4>
                                <div className="description">
                                    {this.state.product.description ? ReactHtmlParser(this.state.product.description, { transform: htmlTransformCallback  })
                                        : <p>'There are no descriptions here yet.'</p>}

                                </div>
                                <div>
                                    <span className="span" onClick={this.expandDescription}> {isCompact ? 'expand' : 'minimize'}
                                    </span>
                                </div>
                                <div className="detail">
                                    <p>Manufacturer</p>
                                    <h5>{this.state.product.manufacturer}</h5>
                                </div>
                                <div className="detail">
                                    <p>Price</p>
                                    <h5>${this.state.product.price}</h5>
                                </div>
                                <div className="detail">
                                    <p>Length</p>
                                    <h5>{this.state.product.length} inch</h5>
                                </div>
                                <div className="detail">
                                    <p>Width</p>
                                    <h5>{this.state.product.width} inch</h5>
                                </div>
                                <div className="detail">
                                    <p>Height</p>
                                    <h5>{this.state.product.height} inch</h5>
                                </div>
                                <button onClick={this.toggleProductInfoDialog}>Edit Info</button>
                            </ProductDescWrapper>
                        </div>
                    </div>
                </div>
            )

            productEditModal = (
                <ProductInfoModal isOpen={this.state.productEditOpen}  size="fluid" style={{position: 'inherit', margin: '0 auto', marginTop: '10%', height: 'auto'}}>
                    <MDBModalHeader>
                        <b>Edit Product</b>
                        <div>
                            <button onClick={this.toggleProductInfoDialog}>Cancel</button>
                            <button onClick={this.submit}>Submit</button>
                        </div>
                    </MDBModalHeader>
                    <MDBModalBody style={{margin: 'auto', height: 'auto'}}>
                        <ProductProfileEdit
                            processing={this.state.processing}
                            cancel={this.toggleProductInfoDialog}
                            categories={this.props.retrieveProducts}
                            product={this.state.product}
                            onChange={this.onChange}
                            minimal={true}>
                        </ProductProfileEdit>
                    </MDBModalBody>
                </ProductInfoModal>
            )

            fullscreenFileModal = (
                <FullscreenFileModal isopen={this.state.fullscreenFileOpen} size="lg 12">
                    <ModalBody>
                        <FullscreenFile
                            userInfo={this.props.userInfo}
                            processing={this.state.processing}
                            cancel={this.toggleFullscreenFileDialog}
                            activeItem={this.state.activeItem}
                            assets2d={this.state.assets2d}
                            findMessageThread={this.props.findMessageThread}
                            createMessage={this.props.createMessage}
                            deleteFilesRSAA={this.props.deleteFilesRSAA}
                            previousItem={this.previousItem}
                            nextItem={this.nextItem}>
                        </FullscreenFile>
                    </ModalBody >
                </FullscreenFileModal>
            )


            // upgradeModal = (
            //     <Modal className="form-dark" contentClassName="card card-image" isopen={this.state.billModalOpen} toggle={this.toggleBillingDialog} size="lg" centered>
            //         <ModalHeader className="white-text" toggle={this.toggleBillingDialog}>Upgrade Your Subscription Plan </ModalHeader>
            //         <ModalBody >
            //             <UpgradeView
            //                 fieldValues={this.fieldValues}
            //                 processing={this.state.processing}
            //                 submit={this.submit}>
            //             </UpgradeView>
            //         </ModalBody>
            //     </Modal>
            // )
        }

        return (
            <div>
                {productEditModal}
                {/*{upgradeModal}*/}
                {assetModal}
                {productView}
                <ContextMenu id="assetView">
                    <MenuItem data={{foo: 'bar'}} onClick={this.handleContextMenu1} download>
                        Download Image
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem data={{foo: 'bar'}} onClick={this.handleContextMenu2}>
                        Edit Image in Editor
                    </MenuItem>
                    <MenuItem data={{foo: 'bar'}} onClick={this.handleContextMenu3}>
                        Edit Product in Editor
                    </MenuItem>
                </ContextMenu>
            </div>
        )
    }
}
