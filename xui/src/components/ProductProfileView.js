import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import {
  MDBContainer,
  Button,
  Thumbnail,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  MDBInput,
  toast,
  ToastContainer
} from 'mdbreact';

import TextInput from '../lib/TextInput';
import Slider from 'react-styled-carousel';

import axios from 'axios';

import { File } from './productprofile/File';
import Files from './productprofile/Files';
import ProductAssetViewer from './productprofile/ProductAssetViewer';
import AssetList from './productprofile/AssetList';
// import PhotoCommentThread from './productprofile/PhotoCommentThread'
import UpgradeView from './UpgradeView'
import ReactHtmlParser from 'react-html-parser';
import $ from 'jquery';
import { API_ROOT } from '../index';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { base64 } from 'jszip/lib/defaults';

export default class ProductProfileView extends Component {

  state = {
    modal: false,
    atSubLimit: false,
    billmodal: false,
    message: '',
    title: '',
    messageno: 0,
    sortBy: 'Sort By',
    step: 0,
    product: {},
    viewMode: 0,
    editing: 0,
    imgtype: '2D',
    isCompact: true,
    batchDeleteCounter: 0,
    batchUploadCounter: 0,
    totalDelete: 0,
    totalUpload: 0,
    updateProduct: {},
    asset: {
      fileName:'',
      fileSize:'',
      lastUpdateDateTime:'',
      viewOrder:'',
    },
    activeView:'',
    productupload: {},
    previewedImages: '',
    totalPermissions: false,
    modalPermissions: false,
    dropdownOpen: false,
    sortByOpen: false,
    productEditOpen: false,
    fullscreenFileOpen: false,
    commentThreadOpen: false,
    deletePermission: false,
    permissionUser: 'View',
    bulkOpen: false,
    bulkAction: 'Download',//'Select A Bulk Action',
    modelmessage: '',
    directory: {},
    width: 0,
    height: 0,
    fileChecked: [],
    searchFilter: '',
    assets2d: [],
    assets360: []
  }

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);

    this.previewImage = this.previewImage.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);

    this.deleteDialog = this.deleteDialog.bind(this);
    this.toggleBulkAction = this.toggleBulkAction.bind(this);
    this.selectPermission = this.selectPermission.bind(this);
    this.toggleTotalPermissions = this.toggleTotalPermissions.bind(this);
    this.updateSearchFilter = this.updateSearchFilter.bind(this);

    this.toggleBillingDialog = this.toggleBillingDialog.bind(this);
    this.togglePermissionsDialog = this.togglePermissionsDialog.bind(this);
    this.evaluateAccess = this.evaluateAccess.bind(this);
    this.retrieveData = this.retrieveData.bind(this);
    //this.zipdata = this.zipdata.bind(this);
    this.bulkOperation = this.bulkOperation.bind(this);
    this.downloadZipIfAllReady = this.downloadZipIfAllReady.bind(this);
    this.zipFiles = this.zipFiles.bind(this);
    this.checkItem = this.checkItem.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.totalBatchHandler = this.totalBatchHandler.bind(this);

    this.userData = JSON.parse(localStorage.getItem('persist:root'));
    var data = JSON.parse(this.userData['auth']);
    this.user_id = data['access']['user_id'];

    this.link = window.location.href;
    this.link = this.link.split("/");
    this.flag = 0;

    this.file_confirmation = [false, false];
    this.file_name = [];
    this.urlList = [];
    this.zip = '';//new JSZip();
  }

  updateSearchFilter(e) {
    this.setState({ "searchFilter": e.target.value }, () => {

      this.displayImage()
    })
  }

  toggleTotalPermissions() {
    this.setState({
      totalPermissions: !this.state.totalPermissions
    })
  }

  togglePermissionsDialog() {
    this.setState({
      modalPermissions: !this.state.modalPermissions
    })
  }

  toggleBillingDialog() {
    this.setState({
      billmodal: !this.state.billmodal
    });
  }


  deleteDialog(event) {
    if (event.target.id === 'no') {
      this.setState({
        deletePermission: !this.state.deletePermission,
        message: ''
      })
    } else {
      this.setState({
        deletePermission: !this.state.deletePermission,
        message: 'Do you really want to delete files ?'
      })
    }
  }


  toggle(event) {
    try {

      if (event.currentTarget.getAttribute('name') === "close") {
        this.setState({
          modal: !this.state.modal
        });
      }
    } catch (err) {
      this.setState({
        modal: !this.state.modal
      });
    }
  }

  previewImage(url) {
    this.setState({ 'previewedImages': url })
  }

  removeKeyValue(object, key, value) {
    if (value == undefined)
      return;
    for (var i in object) {
      if (object[i][key] == value) {
        object.splice(i, 1);
      }
    }
  }

  downloadZipIfAllReady(id, file_confirmation, zip, filenameSave) {
    console.log(id)
    console.log(file_confirmation)
    console.log(zip)
    console.log(filenameSave)
    file_confirmation.every(function (element, index, array) {
      if (element) {
        console.log(zip);
        //console.log(id + ' / ' + file_confirmation);
        zip.generateAsync({ type: "blob" })
          .then(function (content) {
            var a = document.querySelector("#" + id);
            a.download = filenameSave;
            a.href = URL.createObjectURL(content);
            a.click();
          });
      }
      //return element;
    })
  }

  urlToPromise(url) {
    return new Promise(function (resolve, reject) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  zipFiles(id, urls, file_name, file_confirmation, filenameSave) {
    var __ = this;
    var zip = new JSZip();
    if (urls.length > 1) {
      var base64Data = [];
      var dic = { base64: true, binary: true };
      for (var i = 0; i < urls.length; i++) {
        /*-------------------------------------------------- */
        var fname = file_name[i];
        var imageUrl = urls[i];

        zip.file(fname, this.urlToPromise(imageUrl), dic);
        /*----------------------------------------------- */
      }

      file_confirmation[0] = true;
      __.downloadZipIfAllReady(id, file_confirmation, zip, filenameSave);
    } else {
      alert('Please select more than one file.');
    }
  }

  bulkOperation(event) {
    if (event.target.id === 'Download') {
      this.urlList = [];
      this.file_name = [];

      //console.log(this.state.fileChecked);
      for (var i = 0; i < this.state.fileChecked.length; i++) {
        var url = this.state.fileChecked[i].location.split('/');//https://dbrdts7bui7s7.cloudfront.net/
        this.urlList.push(this.state.fileChecked[i].location);//
        this.file_name.push(this.state.fileChecked[i].name);
      }
      var rightNow = new Date();
      var res = rightNow.toISOString().slice(0,10).replace(/-/g,"");
      this.filenameSave = "XSPACE_Content_";
      this.filenameSave = this.filenameSave+res+".zip";
      console.log(this.urlList)
      // this.zipFiles('download', this.urlList, this.file_name, this.file_confirmation, this.filenameSave);

      //console.log(this.urlList);
    } else if (event.target.id === 'deleteOption') {

      if (this.state.fileChecked.length <= 0) {
        this.setState({ message: 'No File Selected for operation.' });
        return false;
      }
      else {
        this.setState({ message: '' });
        this.setState({ deletePermission: !this.state.deletePermission });
        this.urlList = [];
        this.createdDateList = [];
        this.file_name = [];

        //var userData = JSON.parse(localStorage.getItem('persist:root'));
        //var data = JSON.parse(userData['auth']);
        //var user_id = data['access']['user_id'];

        for (var i = 0; i < this.state.fileChecked.length; i++) {
          var url = this.state.fileChecked[i].location.split('/');//https://dbrdts7bui7s7.cloudfront.net/
          this.urlList.push(this.state.fileChecked[i].location);
          this.createdDateList.push(this.state.fileChecked[i].lastModified)//'https://s3.amazonaws.com/storage.xspaceapp.com/' +
          console.log(this.urlList[i]);
        }

        var formdata = new FormData();
        formdata.append('fileList', this.urlList);
        var len = this.urlList.length;

        //start the counter at 0, and when complete, execute delete so multiple delete alerts do not appear
        this.setState({batchDeleteCounter: 0},()=> {
          for (var i = 0; i < len; i++) {

            var link = window.location.href;
            link = link.split("/");

            var slug = this.link[5];
            // Display the key/value pairs

            //delete the files
            this.props.deleteFilesRSAA(slug, this.urlList[i], this.createdDateList[i]);


          }
          this.retrieveData();
          this.set2DMode();
        });

      alert('singleFileDeleteSuccess')
      }

    }
    else {
      alert('Please select Bulk Operation');
    }

  }

  checkItem(e) {
    let fileChecked = this.state.fileChecked;

    if (e.target.checked) {
      //console.log(e.target);
      fileChecked.push({ "name": e.target.name, "location": e.target.value });
      this.setState({ fileChecked });
      //fileChecked = e.target.checked;
    } else {
      this.removeKeyValue(fileChecked, 'name', e.target.name);
      //console.log(fileChecked);
    }
  }

  get3DImage() {
    document.getElementById("productdisplay").innerHTML = "<iframe width='500' height='500' src='https://s3.amazonaws.com/storage.xspaceapp.com/model3d/index.html?model=https://s3.amazonaws.com/storage.xspaceapp.com/model3d/assets/female-croupier-2013-03-26.obj'" + "</iframe>";
  }


  get360Image() {

    // try {
    //   var id = this.user_id;
    //   var user = localStorage.getItem("username");
    //   var product = this.link[4];
    //   var pid = this.link[5];
    //   var slug = this.link[6];
    //   var { width, height } = this.state
    //
    //   if (width > 1600) {
    //     width = 600
    //     height = 500
    //   }
    //   else if (width > 1000) {
    //     width = 480
    //     height = 400
    //   }
    //   else if (width > 600) {
    //     width = 400
    //     height = 300
    //   }
    //
    //
    //
    //   var widthString = width + 'px'
    //   var heightString = height + 'px'
    //
    //   // fetch(API_ROOT + '/api/get_product_360/', {
    //   //   method: 'GET',
    //   //   headers: {
    //   //     'Accept': 'application/json',
    //   //     'Content-Type': 'application/json',
    //   //   },
    //   //   body: JSON.stringify({
    //   //     'location': user,
    //   //     'product': product,
    //   //     'pid': pid,
    //   //     'slug': slug,
    //   //     'itype': this.state.imgtype
    //   //   })
    //   // }).then(res => res.json())
    //   //   .catch(error => console.error('Error:', error))
    //   //   .then(productupload => {
    //   //     try {
    //   //       console.log('productupload,', productupload)
    //   //       if (productupload['success'] === 'true') {
    //   //         var licensepath = productupload['licensepath'];
    //   //
    //   //         var csspath = productupload['csspath'];
    //   //         var jquerypath = productupload['jquerypath'];
    //   //         var imagerotatorpath = productupload['imagerotatorpath'];
    //   //         var xmlpath = productupload['xmlpath'];
    //   //         var baseimagepath = productupload['baseimage'];
    //   //
    //   //         //console.log(productupload['files']);
    //   //
    //   //         var htmldata = '<link type="text/css" rel="stylesheet" href="' + csspath + '"/>'
    //   //           + '<div id="content" style="width: ' + widthString + ';height:' + heightString + ';border: 1px dotted #cecfd2;">'
    //   //           + '<div id="wr360PlayerId" className="wr360_player" style="background-color:#FFFFFF;">'
    //   //           + '</div>'
    //   //           + '</div>';
    //   //
    //   //         var loadScript = function (src) {
    //   //           var tag = document.createElement('script');
    //   //           tag.async = false;
    //   //           tag.src = src;
    //   //
    //   //           document.getElementsByTagName('head').innerHTML = tag;
    //   //         }
    //   //
    //   //         loadScript(jquerypath);
    //   //         loadScript(imagerotatorpath);
    //   //
    //   //         document.getElementById("productdisplay").innerHTML = htmldata;
    //   //
    //   //         var rotator = window.WR360.ImageRotator.Create("wr360PlayerId");
    //   //         rotator.licenseFileURL = licensepath;
    //   //         rotator.settings.configFileURL = xmlpath;//+"published/360_assets/"+productLabel+"/"+productLabel+".xml";
    //   //         rotator.settings.graphicsPath = baseimagepath;
    //   //         rotator.settings.zIndexLayersOn = false;
    //   //         rotator.settings.googleEventTracking = false;
    //   //         rotator.settings.responsiveBaseWidth = 0;
    //   //         rotator.settings.responsiveMinHeight = 0;
    //   //         rotator.runImageRotator();
    //   //
    //   //       } else {
    //   //         document.getElementById("productdisplay").innerHTML = '<span>No 360 Image available for this product</span>';
    //   //       }
    //   //
    //   //     } catch (err) { }
    //   //   });
    // } catch (e) {
    //   console.error(e);
    // }

  }

  selectPermission(event) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      permissionUser: event.target.innerText
    });
  }

  toggleDropdown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleSortBy() {
    this.setState({
      sortByOpen: !this.state.sortByOpen
    });
  }

  toggleBulkAction() {
    this.setState({
      bulkOpen: !this.state.bulkOpen
    });
  }

  componentDidMount(){

    var link = window.location.href;
    link = link.split("/");
    var slug = this.link[5];

    this.props.fill2DScript(slug);
    this.props.fill360Script(slug);

    this.props.runBillingCheck().then((res) => {
        var maxStorageBool = this.props.billingCheck["at_max_storage"];
        if (maxStorageBool == true){
            this.setState({"atSubLimit": true})
        }

     }).catch((err) => {
      console.log(err)
    })

    this.retrieveData()

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.product !== this.props.product) {
      console.log('product', this.props.product)
      console.log('product state', this.props.product['url2d'], this.props.product['url2d']['url'], this.props.product)
      //console.log(this.props.product);
      this.setState({
        'product': this.props.product['productData'],
        'assets2d': this.props.product['url2d']['url'],
        'assets360': this.props.product['threeSixtyAssets']
      })
      // console.log('assets360', this.props.product['threeSixtyAssets'])
    }

    if(prevProps.fileUpload !== this.props.fileUpload) {
      this.setState({batchUploadCounter: this.state.batchUploadCounter+=1}, ()=> {
        console.log('comparing:', this.state.batchUploadCounter, 'and', this.state.totalUpload)
        if (this.state.batchUploadCounter >= this.state.totalUpload) {
          if (this.state.batchUploadCounter.valueOf() > 1) {
            alert(`${this.state.batchUploadCounter}` + " Files Uploaded Successfully")
          } else {
            alert("File Uploaded Successfully")
          }
          this.retrieveData()
          this.setState({totalUpload: 0})
      }
      })
    }

    if(prevProps.deleteFileObjs !== this.props.deleteFileObjs) {
      this.setState({batchDeleteCounter: this.state.batchDeleteCounter+=1},()=> {
        console.log('comparing:', this.state.batchDeleteCounter, 'and', this.state.totalDelete)
        if (this.state.batchDeleteCounter >= this.state.totalDelete) {
          if (this.state.batchDeleteCounter.valueOf() > 1) {
            alert(`${this.state.batchDeleteCounter}` + " Files Deleted Successfully")
          } else {
            alert("File Deleted Successfully")
          }
          this.retrieveData()
          this.setState({totalDelete: 0})
        }
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  totalBatchHandler (batchType, number) {
    console.log('totalBatchHandler', batchType, number)
    if (batchType === 'upload') {
      this.setState({totalUpload: number})
      console.log('set totalUpload state to', number )
    } else if (batchType === 'delete') {
      this.setState({totalDelete: number})
      console.log('set totalDelete state to', number )
    }
  }

  retrieveData() {
    window.scrollTo(0, 0)
    const { findProduct, getProductInline, findMessageThread } = this.props;

    var user = localStorage.getItem("username");
    var slug = this.link[5];
    var itype = this.state.imgtype;
    var view = this.state.activeView;
    // console.log(slug)
    // console.log(itype)
    //var slug = this.link[5];


    let productData = {
      "SKU": 'None',
      "UPCType": 'None',
      "upccode": 'None',
      "category": 'None',
      "name": 'None',
      "manufacturer": 'None',
      "description": 'None',
      "price": '0',
      "length": '0',
      "width": '0',
      "height": '0'
    }
    this.setState({ updateProduct: productData });

    let product = {
      "SKU": 'None',
      "UPCType": 'None',
      "upccode": 'None',
      "category": 'None',
      "name": 'None',
      "productID": '0',
      "uniqueID": '0',
      "manufacturer": 'None',
      "description": 'None',
      "price": '0',
      "length": '0',
      "width": '0',
      "height": '0'
    }

    this.setState({ product: product });
    findProduct(slug)

    document.title = 'XSPACE | Product Profile';
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    window.addEventListener('change', this.checkItem);
  }

  handleInputChange = (event) => {
    const target = event.target,
      value = target.type ===
        'checkbox' ? target.checked : target.value,
      name = target.name
    this.setState({
      [name]: value
    });
  }

  evaluateAccess(){
    if(this.state.atSubLimit === true){
        this.toggleBillingDialog();
    }
    else{
        this.openAssetDialog();
    }
  }

  clearError() {
    $('#message').html('');
  }


  render() {

    let { product, step, editing, productspecs, viewMode, updateProduct, assets2d, assets360 } = this.state

    const errors = this.props.errors || {}

    const responsive = [
      { breakPoint: 1280, cardsToShow: 4 }, // this will be applied if screen size is greater than 1280px. cardsToShow will become 4.
      { breakPoint: 760, cardsToShow: 2 },
    ];

    //console.log(this.flag);
    if (this.state.viewMode === 3) {
      this.get3DImage();
    }
    else if (this.state.viewMode !== 0) {
      if (this.flag >= 1) {
        this.get360Image();
        //this.displayImage();
        /*this.state.thumbnail2d = '<img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="64" height="64" ' +
          'alt="Product Image" style="margin:4px 4px;box-shadow: 2px 2px 5px 2px #888888;">';
        document.getElementById("productimages").innerHTML = this.state.thumbnail2d;*/
        this.flag--;
      }
    }
    else {
      //console.log(this.flag);
      if (this.flag <= 2) {
        // this.displayImage();
        this.flag++;
      }
    }

    let dropdownToggle = (
      <Dropdown isopen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
        <DropdownToggle caret color="primary">{this.state.permissionUser}</DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={this.selectPermission}>View</DropdownItem>
          <DropdownItem onClick={this.selectPermission}>Read Only</DropdownItem>
          <DropdownItem onClick={this.selectPermission}>Read and Write</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )

    let permissionsModal = (
      <MDBModal isopen={this.state.modalPermissions} toggle={this.togglePermissionsDialog} size="lg">
        <MDBModalHeader toggle={this.togglePermissionsDialog}>Add A New User To Custom Permissions</MDBModalHeader>
        <MDBModalBody>
          <div className="row">
            <div className="col-sm-6">
              <h4>Types of Custom Permissions</h4>
              <br />
              <h5>View Only (Default)</h5>
              <p>This setting only allows specified users on XSPACE to view this page if they have a link and view its assets.  They may not edit or retrieve information from this product.</p>
              <h5>Read Only</h5>
              <p>Just like the view only setting but now they can download information and assets.</p>
              <h5>Read and Write</h5>
              <p>This setting only allows specified users on XSPACE retrieve information and content as well as edit content. Content will only be updated once the owner approves the changes.</p>
            </div>
            <div className="col-sm-6">
              <p>Username</p>
              <TextInput name="Name" placeholder="Enter a username" />
              <p>Desired Permission Setting</p>
              {dropdownToggle}

            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">

            </div>
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="secondary" onClick={this.togglePermissionsDialog}>Cancel</Button>{' '}
          <Button color="primary">Add Selected User</Button>
        </MDBModalFooter>
      </MDBModal>
    )

    let deletePermission = (
      <MDBModal isopen={this.state.deletePermission} centered>
        <MDBModalHeader toggle={this.deleteDialog}><div className="row" style={{ marginLeft: '120px' }}>Action Permission</div></MDBModalHeader>
        <MDBModalBody>
          <div className="container">
            <div className="row">
              <b>{this.state.message}</b>
            </div>
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="green" id="deleteOption" onClick={this.bulkOperation}>Yes</Button>
          <Button color="red" id="no" onClick={this.deleteDialog}>No</Button>
        </MDBModalFooter>
      </MDBModal>
    )

    let totalPermissionsSection = (
      <a></a>
    )

    let permissionsOption = (
      <p className="pd-perm-edit" onClick={this.toggleTotalPermissions}>Edit Permissions</p>
    )

    let upgrade = (
      <Modal className="form-dark" contentClassName="card card-image" isopen={this.state.billmodal} toggle={this.toggleBillingDialog} size="lg" centered>
        <ModalHeader className="white-text" toggle={this.toggleBillingDialog}>Upgrade Your Subscription Plan </ModalHeader>
        <ModalBody >
          <UpgradeView
            fieldValues={this.fieldValues}
            processing={this.state.processing}
            submit={this.submit}>
          </UpgradeView>
        </ModalBody>
      </Modal>
    );

    if (this.state.totalPermissions) {
      permissionsOption = (<p className="pd-perm-edit pd-red" onClick={this.toggleTotalPermissions}>Close Permissions</p>)
      totalPermissionsSection = (
        <div className="row animated fadeInLeft">
          <div className="col-sm-6 pd-perm">
            <h3 className="pd-perm-left-align">Permissions</h3>
            <p className="pd-perm-left-align">Current Permissions Setting: <b>Private (Default)</b></p>
            <div className="pcw-sm-outer-radio">
              <label className="pcw-sm-container">Private (default)
                <input type="radio" name="radio" />
                <span className="checkmark"></span>
              </label>
              <p>This setting marks your product as private. Only you can have access to the products link and its assets.</p>
              <label className="pcw-sm-container">View/Read Only
                <input type="radio" name="radio" />
                <span className="checkmark"></span>
              </label>
              <p>This setting only allows specified users on XSPACE to view this page if they have a link and use its assets.</p>
              <label className="pcw-sm-container">Public
                <input type="radio" name="radio" />
                <span className="checkmark"></span>
              </label>
              <p>This setting marks your product as public. Anyone can have access to the products link and its assets.</p>
            </div>
          </div>
          <div className="col-sm-6 pd-perm">
            <h3 className="pd-perm-left-align">Custom User Permissions</h3>
            <p className="pd-perm-left-align">Add User Products Permissions</p>
            <hr />
            <div className="row">
              <div className="col-sm-6">
                <p className="pd-perm-left-align"><b>User</b></p>
              </div>
              <div className="col-sm-6">
                <p className="pd-perm-left-align"><b>Permissions</b></p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <p>No users found</p>
                <a onClick={this.togglePermissionsDialog}><p className="pd-perm-add-user">Add User</p></a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <MDBContainer>
        {permissionsModal}
        {deletePermission}
        {upgrade}
        <div className="text-center">
          <div className="container">
            <ProductAssetViewer
              userInfo={this.props.userInfo}
              product={this.state.product}
              assets2d={this.state.assets2d}
              assets360={this.state.assets360}
              updateProduct={this.props.updateProduct}
              retrieveData={this.retrieveData}
              windowWidth={this.state.width}
              windowHeight={this.state.height}
              findMessageThread={this.props.findMessageThread}
              createMessage={this.props.createMessage}
              deleteFilesRSAA={this.props.deleteFilesRSAA}
              setXEditWorkload={this.props.setXEditWorkload}
              xEditWorkload={this.props.xEditWorkload}/>

            <br />
            <AssetList
              assets2d={this.state.assets2d}
              assets360 = {this.state.assets360}
              createFileUploadRSAA={this.props.createFileUploadRSAA}
              deleteFilesRSAA={this.props.deleteFilesRSAA}
              userInfo={this.props.userInfo}
              accessToken={this.props.accessToken}
              totalBatchHandler={this.totalBatchHandler}
              create360={this.props.create360RSAA}
              />
          </div>
        </div>
      </MDBContainer>
    )
  }
}
