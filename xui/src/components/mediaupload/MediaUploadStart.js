import React, { Component } from 'react';
import styled from 'styled-components'
import { Input, Label, Button, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, Dropdown,
    DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalBody, ModalHeader } from 'mdbreact';


const ContainerMine = styled.div`
  padding: 16px 60px 16px 60px;
  
  .row {
    justify-content: space-between !important;
  }
  .roworder1 {
    margin: 45px 25px 25px 0px
  }
  .roworder2 {
    margin-left: -15px;
    margin-right: -15px;
    margin-top: 45px;
  }
  .roworder3 {
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 35px;
  }
  
  select {
    border: 2px solid #adadad !important;
    border-radius: 15px;
    height: 60px !important;
    width: 600px;
    font-size: 20px;
    font-weight: normal;
    color: #adadad;
    padding-left: 40px;
  }
  
  .fa-chevron-down {
    font-size: 30px;
    right: 20px;
  }
  
  .uploaderzip {
      align-items: center;
      background-color: rgba(0, 0, 0, 0.02);
      cursor: pointer;
      display: flex;
      height: 100px;
      justify-content: center;
      // outline: 3px dashed #ccc;
      // outline-offset: 5px;
      position: relative;
      
      label {
        font-size: 16px;
        line-height: 20px;
      }
      //
      // .visually-hidden {
      //   osition: absolute !important;
      //   height: 1px;
      //   width: 1px;
      //   overflow: hidden;
      //   clip: rect(1px, 1px, 1px, 1px);
      // }
      //
      // input.visually-hidden:focus + label {
      //   outline: thin dotted;
      // }
      // input.visually-hidden:focus-within + label {
      //   outline: thin dotted;
      // }
  }
  .uploaderzip input {
    // display: none;
  }
  .uploaderzip img, .uploaderzip .icon {
    pointer-events: none;
  }
  .uploaderzip,
  .uploaderzip .icon {
    transition: all 100ms ease-in;
  }
  .uploaderzip .icon {
    color: #eee;
    color: rgba(0, 0, 0, 0.2);
    font-size: 5em;
  }
  .uploaderzip img {
    left: 50%;
    opacity: 0;
    max-height: 100%;
    max-width: 100%;
    position: absolute;
    top: 50%;
    transition: all 300ms ease-in;
    -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
    z-index: -1;
  }
    .uploaderzip img.loaded {
    opacity: 1;
  }
`

export default class MediaUploadStart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'overlayColor': 'rgba(255, 255, 255, 0.3)',
            categoryDropDownOpen: false,
            modal: false,
            currentValue: '',
            name: '',
            activeColor: '#00A3FF',
            baseColor: '#9B9B9B',
            selected: false,
            selectedFile: null,
            active: false,
        };

        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onClick = this.onClick.bind(this);
    };

    componentDidMount() {
        this._isMounted = true;
        document.title = 'XSPACE | Media Upload';
    };

    componentWillUnmount() {
        this._isMounted = false;
    };

    onDragEnter(e) {
        e.preventDefault();
        console.log('onDragEnter');
        this.setState({ active: true });
    };

    onDragLeave(e) {
        e.preventDefault();
        console.log('onDragLeave');
        this.setState({ active: false });
    };

    onDragOver(e) {
        e.preventDefault();
        console.log('onDragOver');
        this.setState({ active: true });
    };

    onDrop(e) {
        e.preventDefault();
        let target;
        if (e.type === "change") {
            target = e.target.files[0];
        } else {
            target = e.dataTransfer.files[0];
        }
        console.log('onDrop', target);
        if (target !== null) {
            this.props.handleFileSubmit(target)
            this.setState({selectedFile: target.name})
            this.setState({active: true})
            this.setState({selected: true})
        } else {
            this.setState({active: false})
            this.setState({selected: false})
        }
    };

    onClick = () => {
        this.fileInputRef.current.click();
    };


    fileInputRef = React.createRef();

    render() {

        const boxText = this.state.selected ?  this.state.selectedFile : 'Drag and drop your zip file here Or click to browse your computer';
        const borderColor = this.state.active ? this.state.activeColor : this.state.baseColor;
        let { upc, sku, manufacturer, name, description, price, currentValue, error, standardsOptionList } = this.state;

        return (
            <ContainerMine>
                <Modal isopen={this.state.modal}>
                    <ModalHeader toggle={this.toggleDialog}>Creating A New Product</ModalHeader>
                    <ModalBody>
                        Please wait while we upload and process your file...
                    </ModalBody>
                </Modal>
                <div class="animated border-bottom pb-2">
                    <h5 className="text-center lead">In order to upload 2D Photos, 360 View Models, Video & 3D Models for your business</h5>
                    <h5 className="text-center lead">please ensure that all file names included in the zip file have part of their name corresponding</h5>
                    <h5 className="text-center lead">to either a product name or UPC already in the Product Library.</h5>
                </div>
                <div className="animated text-center py-3">
                    <p className="py-0 my-0 lead" style={{fontSize: "16px"}}>Note: If you are uploading content for a product that has not been created in the Product Library</p>
                    <p className="py-0 my-0 lead" style={{fontSize: "16px"}}>Please first add the necessary products and information before attempting to upload a zip file</p>
                </div>
                <div
                    className="uploaderzip mt-4"
                    onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave}
                    onDragOver={this.onDragOver}
                    onDrop={this.onDrop}
                    onClick={this.onClick}
                    // style={{outlineColor: borderColor, height: "149px", borderRadius: "23px", outlineRadius: "23px"}}>
                    style={{ border: "3px dashed" + borderColor, height: "149px", borderRadius: "23px", outline: "hidden !important"}}>
                    {/*<img src={state.imageSrc} className={`uploadImg ${state.loaded && 'loaded'}`} alt=''/>*/}
                    {/*<img className='upload-img' src={uploadImg} alt=''/>*/}
                    <input type="file"
                           ref={this.fileInputRef}
                           hidden
                           accept="application/zip,application/x-zip,application/x-zip-compressed"
                           onChange={this.onDrop}/>
                    <label style={{color: this.state.active ? this.state.activeColor : "#333330", opacity: this.state.active ? "0.85":"0.5"}}> {boxText} </label>
                </div>
            </ContainerMine>
        );
    }
}
