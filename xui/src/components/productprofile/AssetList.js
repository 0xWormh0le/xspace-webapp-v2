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
} from 'mdbreact';
import ReactHtmlParser from 'react-html-parser';
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu"
import Moment from 'react-moment';

// import singleShot from '../../assets/img/single-shot.png'
// import fourShots from '../../assets/img/four-shots.png'
import fiveShots from '../../assets/img/five-shots.png'
import viewModels from '../../assets/img/view-models.png'
import multiAxis from '../../assets/img/multi-axis.png'
// import videoPlayer from '../../assets/img/video-player.png'
// import AV from '../../assets/img/ar-icon.png'

import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
// import { base64 } from 'jszip/lib/defaults';

import $ from 'jquery';
import { API_ROOT } from '../../index';

import TextInput from '../../lib/TextInput';

const AssetListView = styled.div`
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 0.3rem;
  background-color: #ffffff;
  color: #333333;
  width: 100%;
  margin: 0px;
  .container {
    padding: 0;
    width: 100%;
    margin: 0px;
  }
  div.button-row {
    padding: 20px 25px;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #F4F5FA;
    button {
      width: 133px;
      height: 38px;
      background-color: #00A3FF;
      font-size: 14px;
      line-height: 20px;
      font-weight: bold;
      color: #ffffff;
      border: none;
      border-radius: 19px;
    }
    button.new-asset-btn {
      margin-right: 13px;
    }
  }
`

const AssetView = styled.div`
  padding: 20px 25px;
  color: #333333;
  div {
    text-align: left;
    color: #333333;
  }
  div.row {
    color: #333333;
    padding: 5px 0;
    .row:nth-child(2n+1) {
      background-color: #F4F5FA;
    }
  }
  p {
    font-size: 12px;
    color: #333330;
    line-height: 20px;
    margin: 0;
  }
  h4 {
    color: #333333;
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
    text-align: left;
    margin-bottom: 10px;
  }
  div.header {
    border-bottom: 2px solid #F4F5FA;
    h5 {
      color: #333330;
      font-size: 12px;
      line-height: 20px;
      margin: 0;
      text-align: left;
      font-weight: bold;
    }
  }
  div.form-check.my-3 {
    text-align: left;
    padding: 0;
    margin: 0 !important;
    color: #333333;
    label {
      font-size: 12px;
      color: #333330;
      line-height: 20px;
      padding-left: 20px;
    }
    label:before {
      width: 12px;
      height: 12px;
      border-radius: 3px;
    }
    i {

    }
  }
  .form-check-input[type="checkbox"]:checked + label:before, label.btn input[type="checkbox"]:checked + label:before {
    width: 9px;
    height: 15px;
  }
`

const StyledModal = styled(MDBModal)`
  min-width: 848px;
  .modal-content {
    border-radius: 10px;
  }
  .modal-header {
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
    .container {
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
        height: 133px;
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
export default class AssetList extends Component {
  constructor(props) {
    super(props);

    this.deleteDialog = this.deleteDialog.bind(this);
    this.evaluateAccess = this.evaluateAccess.bind(this);
    this.openAssetDialog = this.openAssetDialog.bind(this);
    this.closeAssetDialog = this.closeAssetDialog.bind(this);
    this.openNewFolderDialog = this.openNewFolderDialog.bind(this);
    this.closeNewFolderDialog = this.closeNewFolderDialog.bind(this);
    this.closeFolderDialog = this.closeFolderDialog.bind(this);
    this.createNewFolderDialog = this.createNewFolderDialog.bind(this);
    this.getFileList = this.getFileList.bind(this);
    this.selectBulk = this.selectBulk.bind(this);
    this.checkItem = this.checkItem.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.bulkOperation = this.bulkOperation.bind(this);
    this.downloadZipIfAllReady = this.downloadZipIfAllReady.bind(this);
    this.zipFiles = this.zipFiles.bind(this);
    this.handleCreate360 = this.handleCreate360.bind(this)
    this.handleContextMenu1 = this.handleContextMenu1.bind(this)

    this.state = {
      assets2d: props.assets2d,
      totalImages: 0,
      assets360: props.assets360,
      deletePermission: false,
      fileChecked: {},
      fileCheckedIndices: [],
      uploading: false,
      create360Modal: false,
    }

    this.file_confirmation = [false, false];

    this.directory = [
      {
        "group": {
          "title": "2D Photos",
          "files": [
            {
              "title": "",
              "dateModified": "",
              "size": ""
            },
            {
              "title": "",
              "dateModified": "",
              "size": ""
            },
            {
              "title": "",
              "dateModified": "",
              "size": ""
            },
          ]
        },
        "group2": {
          "title": "3D Photos",
          "files": [
            {
              "title": "OK",
              "dateModified": "",
              "size": ""
            }
          ]
        }
      }]
  }

  componentDidMount() {
    if (this.state.assets2d) {
      this.setState({totalImages: this.props.assets2d.length})
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('component updating with,', this.state.assets2d.length, prevState.assets2d.length)
    // console.log(this.state.fileCheckedIndices)
    if (this.props.assets2d) {
      if (prevProps.assets2d) {
        if (this.props.assets2d.length !== prevProps.assets2d.length) {
          this.setState({totalImages: this.props.assets2d.length})
        }
      } else {
        this.setState({totalImages: this.props.assets2d.length})
      }
    }
  }

  selectBulk(event) {
    this.setState({
      bulkOpen: !this.state.sortByOpen,
      bulkAction: event.target.innerText
    });
  }

  handleContextMenu1(e, data) {
    console.log('handle context menu fired with', e)
    console.log(data)
    console.log(e.target)
    console.log(e.detail)
    console.log(e.nativeEvent)
    console.log(e.relatedTarget)
    console.log(e.view)
    console.log(e.type)
  }

  handleCreate360(value) {
    console.log('handleCreate360 clicked', value)
    if (value === 'none') {
      this.setState({create360Modal: !this.state.create360Modal})
    } else {
      this.setState({create360Modal: value})
    }
  }

  downloadZipIfAllReady(id, file_confirmation, zip, filenameSave) {
    console.log(id, file_confirmation, zip, filenameSave)
    file_confirmation.every(function (element, index, array) {
      if (element) {
        //console.log(id + ' / ' + file_confirmation);
        zip.generateAsync({ type: "blob" })
          .then(function (content) {
            var a = document.getElementById("downloadArea");
            console.log(a)
            console.log(filenameSave)
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
    if (urls.length > 0) {
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
      alert('Please select a file');
    }
  }

  createNewFolderDialog() {
    var folder = $('#s3NewFolder').val();
    var re = /^[a-zA-Z0-9_]+$/;///^[a-zA-Z]+$/
    if (!re.test(folder)) {
      //alert('Special characters are not allowed');
      $('#message').html('<b style="color:red;">Special characters are not allowed except underscore ( _ ).</b>');
      return false;
    }
    if (folder !== '2D' && folder !== '360' && folder !== '') {
      $('#message').html('<b>Your folder is being created please wait...</b>');
      var userData = JSON.parse(localStorage.getItem('persist:root'));
      var data = JSON.parse(userData['auth']);
      var user_id = this.props.userId;//data['access']['user_id'];

      var link = window.location.href;
      link = link.split("/");
      link = '/' + link[4] + '/' + link[5] + '/' + link[6] + '/';
      //console.log(folder);
      var formdata = new FormData();
      formdata.append('location', link + folder + '/');
      formdata.append('viewFolder', link);
      formdata.append('userId', user_id);
      formdata.append('request', 'post');

      fetch(API_ROOT + '/api/create_s3_folder/', {
        method: 'post',
        body: formdata
      })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
          let fileList = [];
          let displayFolder = document.getElementById('folderList');
          displayFolder.innerHTML = '';
          for (let i = 0; i < response['files'].length; i++) {
            let a = response['files'][i].split('/').length;
            let b = response['files'][i].split('/');
            //console.log(a);
            if (a > 8 && b[7] !== '2D' && b[7] !== '360') {
              fileList.push(b[7]);
              displayFolder.innerHTML += '<option value="' + b[7] + '">' + b[7] + '</option>';
            }
          }
          $('#message').html('<b style="color:green;">Folder created successfully.</b>');
        });
    } else {
      //alert('You are not allowed to create folder with this name');
      $('#message').html('<b style="color:red;">You are not allowed to create folder with this name.</b>');
    }
  }

  openAssetDialog() {
    this.setState({ modalAsset: true });
  }

  closeAssetDialog() {
    this.setState({modalAsset: false, modalmessage:''});
  }

  openNewFolderDialog() {
    this.getFileList();
    this.setState({ modalNewFolder: true });
  }

  closeNewFolderDialog() {
    //window.location.reload()
    //this.setState({modalNewFolder: false,modalmessage:''});
  }

  closeFolderDialog() {
    this.setState({ modalNewFolder: false, modalmessage: '' });
  }

  getFileList() {
    $('#message').ready(function () {
      $('#message').html('');
    });
    var link = window.location.href;
    link = link.split("/");
    link = '/' + link[4] + '/' + link[5] + '/' + link[6] + '/';
    //console.log(folder);

    var userData = JSON.parse(localStorage.getItem('persist:root'));
    var data = JSON.parse(userData['auth']);
    var user_id = this.props.userId;//data['access']['user_id'];

    //console.log(window.btoa(link));

    fetch(API_ROOT + '/api/create_s3_folder/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'userId': user_id,
        'request': 'get',
        'viewFolder': window.btoa(link).toString()
      })
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        //console.log(response);
        let fileList = [];
        let displayFolder = document.getElementById('folderList');
        displayFolder.innerHTML = '';
        for (let i = 0; i < response['files'].length; i++) {
          let a = response['files'][i].split('/').length;
          let b = response['files'][i].split('/');
          //console.log(a);
          if (a > 8 && b[7] !== '2D' && b[7] !== '360') {
            fileList.push(b[7]);
          }
        }
        if (fileList.length > 0) {
          displayFolder.innerHTML = '<option value="none">--Select--</option>';
          for (let i = 0; i < fileList.length; i++) {
            displayFolder.innerHTML += '<option value="' + fileList[i] + '">' + fileList[i] + '</option>';
          }
        } else {
          displayFolder.innerHTML = '<option>--No Folder added--</option>';
        }


      });
  }

  bulkOperation(event) {
    let url;
    let i;
    if (event.target.id === 'Download') {
      // this.urlList = [];
      // this.file_name = [];
      let urlList = []
      let filenames = []

      // console.log(this.state.fileChecked);
      //   var url = this.state.fileChecked[i].location.split('/');//https://dbrdts7bui7s7.cloudfront.net/
      //   this.urlList.push(this.state.fileChecked[i].location);
      for (i = 0; i < this.state.fileCheckedIndices.length; i++) {
        url = this.props.assets2d[i].link.split('/')
        urlList.push(this.props.assets2d[i].link)
        filenames.push(url[url.length - 1])
      }
      const rightNow = new Date()
      const res = rightNow.toISOString().slice(0, 10).replace(/-/g, "")
      let filenameSave = "XSPACE_Content_"
      filenameSave = filenameSave+res+".zip"
      this.zipFiles('downloadArea', urlList, filenames, this.file_confirmation, filenameSave)

      //console.log(this.urlList);
    } else if (event.target.id === 'deleteOption') {
      let urlList = []
      let filenames = []
      let createdDateList = []
      let url = ''
      let j = 0
      let asset

      if (this.state.fileChecked.length <= 0) {
        this.setState({message: 'No File Selected for operation.'})
        return false;
      } else {
        console.log("what the asset list is passing back up to totalBatchHandler for count:", this.state.fileCheckedIndices, this.state.fileCheckedIndices.length)
        this.props.totalBatchHandler('delete', this.state.fileCheckedIndices.length)
        this.setState({message: ''})
        this.setState({deletePermission: !this.state.deletePermission})

        for (i = 0; i < this.state.fileCheckedIndices.length; i++) {
          console.log('inside bulk operation', this.state.fileCheckedIndices[i])
          j = this.state.fileCheckedIndices[i]
          if (j > this.props.assets2d.length-1) {
            //  this is a 360 or 3D model
            //  update index for 360 list (have to subtract an extra one because count starts from 0)
            console.log('inside 360 delete')
            j = j - this.props.assets2d.length
            console.log('new j', j)
            asset = this.props.assets360.html[j]
            console.log('assets360 list', this.props.assets360)
            console.log('asset', asset)
            urlList.push([[asset.baseImage, 2]])
            createdDateList.push(this.props.assets2d[j].lastModified)
          } else {
            console.log('inside image delete')
            url = this.props.assets2d[j].link.split('/')
            console.log(this.props.assets2d)
            urlList.push([this.props.assets2d[j].link, 1])
            createdDateList.push(this.props.assets2d[j].lastModified)
        }

        var formdata = new FormData();
        formdata.append('fileList', urlList);
        var len = urlList.length;
        for (i = 0; i < len; i++) {
          var link = window.location.href;
          var slug = link.split("/")[5];
          // Display the key/value pairs
          this.props.deleteFilesRSAA(slug, urlList[i], createdDateList[i]).then((res) => {
                if (res.payload['status'] !== 200) {
                  console.log('did not delete')
                } else {
                  console.log('successful delete')
                }
              }
          )
        }
        this.setState({"fileCheckedIndices": []})
        }
      }
    } else if (event.target.id === 'create360') {
      this.setState({create360Modal: false})
      if (this.state.fileChecked.length <= 1) {
        this.setState({message: 'Please select at least 2 files to create a 360.'})
        return false;
      } else {
        console.log('create360fromselected clicked')
        console.log('current state in AssetList', this.state)

        let urlList = []
        let createdDateList = []
        let url = ''
        let j = 0
        let asset

        // get checked indices
        for (i = 0; i < this.state.fileCheckedIndices.length; i++) {
          console.log('inside bulk operation', this.state.fileCheckedIndices[i])

          createdDateList.push(this.props.assets2d[j].lastModified)
          j = this.state.fileCheckedIndices[i]
          if (j > this.props.assets2d.length) {
          } else {
            //  this is a 360 or 3D model
            //  update index for 360 list (have to subtract an extra one because count starts from 0)
            url = this.props.assets2d[j].link.split('/')
            urlList.push([this.props.assets2d[j].link, 1])
            createdDateList.push(this.props.assets2d[j].lastModified)
          }
        }
        var formdata = new FormData();
        formdata.append('fileList', urlList);
        let slug = []
        var len = urlList.length;
        var link = window.location.href;
        slug = link.split("/")[5]
        console.log(slug, urlList, createdDateList)
        this.props.create360(slug, urlList, createdDateList).then((res) => {
          if (res) {
            console.log('created 360', res)
            if (res.type === '@@echo/CREATE_360_SUCCESS') {
              console.log('successfully created 360')
            } else {
              console.log('did not create 360')
            }
          }
          }
        )
        // this.setState({"fileCheckedIndices": []})
      }
    }
    else {
      alert('Please select Bulk Operation.');
    }
  }

  checkItem(idx, e) {
    console.log('checked index:', idx)
    let { fileCheckedIndices } = this.state;
    const value = e.target.checked
    if (value === true) {
      console.log('checked is true')
      if (!fileCheckedIndices.includes(idx)) {
        fileCheckedIndices.push(idx)
      }
    } else {
      console.log('checked is false')
      if (fileCheckedIndices.includes(idx)) {
        fileCheckedIndices = fileCheckedIndices.filter(item => item !== idx)
      }
    }
    this.setState({"fileCheckedIndices": fileCheckedIndices})
  }

  evaluateAccess() {
    if(this.state.atSubLimit === true){
        this.toggleBillingDialog();
    }
    else{
        this.openAssetDialog();
    }
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
        message: 'Do you really want to delete these files?'
      })
    }
  }

  handleFileUpload(event) {
    event.preventDefault()
    const pfs = this.pond.getFiles();

    const userData = JSON.parse(localStorage.getItem('persist:root'));
    var data = JSON.parse(userData['auth']);
    var user_id = this.props.userId;
    var fileToRead = '';
    var files = '';
    let len = '';

    len = pfs.length;
    if (len !== 0) {
      this.setState({
        uploading: true,
        modelmessage: '<h5 id="uploadstatus" style="margin-right:180px;">Uploading files ...</h5>',
        modalAsset: true
      })
      this.props.totalBatchHandler('upload', len);

      for (let i = 0; i < len; i++) {
          var link = window.location.href;
          link = link.split("/");
          var slug = link[5];
          // Display the key/value pairs
          var fl1 = pfs[i]

          this.props.createFileUploadRSAA(slug, fl1.file).then(()=> {
            this.setState({"uploading":false});
                fetch(API_ROOT + '/api/onboard/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + this.props.accessToken,
        },
        body: JSON.stringify({
          'user': this.props.userInfo.userid,
          'upload_images':true
        })
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
          }).catch((err)=> {
            this.setState({"uploading":false},()=> {
              alert("An unknown error as occurred while uploading your file.")
            })
          });
      }
      this.setState({ modelmessage: '<h5 id="uploadstatus" style="color:green;margin-right:150px;">File Uploaded Successfully</h5>',
        modalAsset: false});
    } else {
      this.setState({
        modelmessage: '<h5 id="uploadstatus" style="color:red;margin-right:150px;">Please select files to upload.</h5>',
        modalAsset: true
      });
    }
  }

  render() {
    let {userInfo,accessToken}=this.props
    function onboard(){
    fetch(API_ROOT + '/api/onboard/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + accessToken,
        },
        body: JSON.stringify({
          'user': userInfo.userid,
          'download_images':true
        })
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
    }

    let { assets2d, assets360 } = this.props

    // let layout = (<div></div>)
    let assetView = (<div></div>)
    let asset360View = (<div></div>)
    // let inputName = (<div></div>)

    let deleteButton = (<div></div>)
    let bulkDownloadButton = (<div></div>)
    let create360Button = (<div></div>)
    let sortByView = (<div></div>)
    // let file = (<div></div>)

    // let folder = (
    //   <div className="row pd-ct-folder">
    //     <h3>2D Pictures</h3>
    //   </div>
    // )

    // inputName = <TextInput name="Name" placeholder="Search..." onChange={this.updateSearchFilter} value={this.state.searchFilter} />

    let create360ModalView = (
        <MDBModal isOpen={this.state.create360Modal} centered style={{}}>
          {/*<MDBModalHeader style={{borderRadius: '10px 10px 0px 0px',  display: 'flex', flexDirection: 'row', justifyContent:'space-between', width: '100%', backgroundColor: '#00A3FF'}}>*/}
          {/*  <p style={{order: 0, fontSize: 24, fontWeight: 600, color: '#ffffff', marginBottom:0}}>Create 360</p>*/}
          {/*  <button onClick={() => this.handleCreate360('none')} style={{order: 1, right:10, fontSize: 18, fontWeight: 500, color: 'rgb(90,90,90)'}}>Close</button>*/}
          {/*</MDBModalHeader>*/}
          <MDBModalHeader toggle={() => this.handleCreate360('none')} style={{backgroundColor: '#00A3FF'}}><span style={{fontSize: 24, fontWeight: 600, color: '#ffffff', marginBottom:0}}>Create 360</span></MDBModalHeader>
          <MDBModalBody style={{}}>
            <div className="container" style={{width: '100%'}}>
              <div className="row">
                <p style={{fontFamily: 'Roboto', fontSize: 18, fontWeight: 500}}>Would you like to create a 360 from the selected images?</p>
                <p style={{fontFamily: 'Roboto', fontSize: 12, fontWeight: 400}}>Please note that this operation will run in the background. When it is complete the new 360 will appear on this page. If the 360 does not appear after 5-10 minutes try refreshing the page.</p>
              </div>
            </div>
          </MDBModalBody>
          <MDBModalFooter style={{display: 'flex', flexDirection: 'row', justifyContent:'center', width: '100%'}}>
            <Button color="green" id="deleteOption" onClick={this.bulkOperation} id="create360" style={{marginRight:56}}>Yes</Button>
            <Button color="red" id="no" onClick={() => this.handleCreate360(false)}>No</Button>
          </MDBModalFooter>
        </MDBModal>
    )

    let deleteModal = (
      <MDBModal isOpen={this.state.deletePermission} centered>
        <MDBModalHeader toggle={this.deleteDialog}><div className="row" style={{ marginLeft: '120px' }}>Action Permission</div></MDBModalHeader>
        <MDBModalBody>
          <div className="container" style={{width: '100%'}}>
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

    let uploadButton = (<div><p>Please wait, file is uploading...</p></div>)
    if (!this.state.uploading) {
      uploadButton = (
        <div>
          <FilePond ref={ref => this.pond = ref} allowMultiple={true}/>
          <button className="btn coolgreen" onClick={this.handleFileUpload}>Upload</button>{' '}
        </div>
      )
    }

    let assetModal = (
      <StyledModal isOpen={this.state.modalAsset} toggle={this.closeAssetDialog} centered>
          <MDBModalHeader>Upload Product Images</MDBModalHeader>
          <MDBModalBody>
            <div className="row">
              <div className="col-md-12" style={{ margin: 'auto' }}>
                <i className="fa fa-cloud-upload fa-5x" aria-hidden="true"/>
                  <MDBContainer>
                      <h4> Upload 2D Photos, 360 View Models, Video and & 3D Models for your product</h4>
                      <div class="row">
                        <div className='card-item'>
                          <img src={fiveShots} alt='' />
                          <p>Five Pack Shots</p>
                          <h6>(.png/.jpg supported)</h6>
                        </div>
                        <div className='card-item'>
                          <img src={multiAxis} alt='' />
                          <p>360 Spin Models</p>
                          <h6>(.png/.jpg supported)</h6>
                        </div>
                        <div className='card-item'>
                          <img src={viewModels} alt='' />
                          <p>3D Models</p>
                          <h6>(.gltf/.obj supported)</h6>
                        </div>
                      </div>

                  </MDBContainer>
                  <center>
                    {uploadButton}
                  </center>
              </div>
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            {ReactHtmlParser(this.state.modalmessage)}
            <Button color="red" onClick={this.closeAssetDialog}>Close</Button>{' '}
          </MDBModalFooter>
      </StyledModal>
    )

    if (assets2d) {
      if (assets2d.length > 0) {
        // deleteButton = (
        //   <button style={{ "paddingTop": "10" }} className="btn coolgreen" onClick={this.deleteDialog} >Delete</button>
        // )
        // bulkDownloadButton = (
        //   <button style={{ "paddingTop": "10" }} className="btn coolgreen" onClick={this.bulkOperation} id="Download" >Bulk Download</button>
        // )
        // create360Button = (
        //     <button style={{ "paddingTop": "10" }} className="btn coolgreen" onClick={this.bulkOperation} id="create360" >Create 360 from Selected</button>
        // )
        // sortByView = (
        //   <Dropdown isOpen={this.state.sortByOpen} toggle={this.toggleSortBy}>
        //     <DropdownToggle caret color="primary">{this.state.sortBy}</DropdownToggle>
        //     <DropdownMenu dropUp>
        //       <DropdownItem onClick={this.selectSortBy}>Last Updated</DropdownItem>
        //       <DropdownItem onClick={this.selectSortBy}>Name</DropdownItem>
        //     </DropdownMenu>
        //   </Dropdown>
        // )
        assetView = (
          <AssetView>
            <h4>2D Images</h4>
            <div className="header row">
              <div className="col-sm-4">
                <h5>File Name</h5>
              </div>
              <div className="col-sm-2">
                <h5>Download</h5>
              </div>
              <div className="col-sm-2">
                <h5>View Order</h5>
              </div>
              <div className="col-sm-2">
                <h5>Created</h5>
              </div>
              <div className="col-sm-2">
                <h5>Size</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                {assets2d.map((asset, idx) => {
                  let linkSplit = asset.link.split("/")
                  let filename = linkSplit[linkSplit.length - 1]
                  let checkIdx = "checkbox" + idx
                  return (
                     <div className="row" key={idx}>
                       <div className="col-sm-4">
                         <MDBInput label={filename} id={checkIdx} onChange={(e) => this.checkItem(idx, e)} type="checkbox" name={asset.fileName} />
                       </div>
                       <div className="col-sm-2">
                         <a href={asset.link} target="_blank" onClick={onboard}><i className="fa fa-download"/></a>
                       </div>
                       <div className="col-sm-2">
                         <p>{idx + 1}</p>
                       </div>
                       <div className="col-sm-2">
                         <p><Moment fromNow>{asset.lastModified}</Moment></p>
                       </div>
                       <div className="col-sm-2">
                         <p>{asset.size}</p>
                       </div>
                     </div>
                   )
               })}
              </div>
            </div>
          </AssetView>
        )
      }
      else{
        assetView = (
          <AssetView>
            <h4>2D Images</h4>
            <p>No Images Views Could Be Found</p>
          </AssetView>
        )
      }
    }
    else{
        assetView = (
          <AssetView>
            <h4>2D Images</h4>
            <p>No Images Views Could Be Found</p>
          </AssetView>
        )
    }

    if (assets360) {
      // console.log('asset list assets 360 received:', assets360)
      if (assets360.html) {
        if (assets360.html.length > 0 && assets360.html !== "None") {
          asset360View = (
              <AssetView>
                <h4>360 View Models</h4>
                <div className="row">
                  <div className="col-md-12" style={{color: '#000000'}}>
                    {assets360.html.map((asset, idx) => {
                      // let linkSplit = asset.link.split("/")
                      // console.log(asset.filename)
                      // let filename = linkSplit[linkSplit.length - 1]
                      idx = idx + this.state.totalImages
                      // console.log('idx', idx)
                      let checkIdx = "checkbox" + idx
                      return (
                          <ContextMenuTrigger id="360ContextMenu" name={idx} key={idx}>
                            <div className="row pd-ct-directory" key={idx} >
                              <div className="col-sm-4" style={{color: '#333330'}}>
                                <MDBInput label={asset.filename} id={checkIdx} onChange={(e) => this.checkItem(idx, e)} type="checkbox" name={asset.fileName} style={{color: '#333330'}}/>
                              </div>
                              <div className="col-sm-2" style={{color: '#333330'}}>
                                <a href={asset.link} target="_blank" onClick={onboard}><i className="fa fa-download" style={{color: '#333330'}}/></a>
                              </div>
                              <div className="col-sm-2" style={{color: '#333330'}}>
                                <p style={{color: '#333330'}}>{idx + 1}</p>
                              </div>
                              <div className="col-sm-2">
                                <p style={{color: '#333330'}}>
                                  <Moment fromNow style={{color: '#333330'}}>{asset.lastModified}</Moment>
                                </p>
                              </div>
                              <div className="col-sm-2" style={{color: '#333330'}}>
                                <p style={{color: '#333330'}}>{asset.size}</p>
                              </div>
                            </div>
                          </ContextMenuTrigger>
                          )
                        }
                    )}
                  </div>
                </div>
              </AssetView>
          )
        }
        else{
          asset360View = (
              <AssetView>
                <h4>360 View Models</h4>
                <p>No 360 Views Could Be Found</p>
              </AssetView>
          )
        }
      } else{
        asset360View = (
            <AssetView>
              <h4>360 View Models</h4>
              <p>No 360 Views Could Be Found</p>
            </AssetView>
        )
      }
    }
    else{
        asset360View = (
          <AssetView>
            <h4>360 View Models</h4>
            <p>No 360 Views Could Be Found</p>
          </AssetView>
        )
    }


    let folderModal = (
      <MDBModal isOpen={this.state.modalNewFolder} onRequestClose={this.closeNewFolderDialog} size="lg" >
        <MDBModalHeader style={{ margin: 'auto' }}>Manage Product Repository</MDBModalHeader>
        <MDBModalBody>
          <div className="row">
            <div className="col-sm-6">
              <h4>Create New Folder</h4>
              <hr/>
              <label className="form-group">Enter New Folder Name &nbsp;</label>
              <input type="text" className="form-group" onChange={this.clearError} id="s3NewFolder" name="newfolder"/>
              <button className="btn coolgreen form-group" onClick={this.createNewFolderDialog} >Create</button>{' '}
              <div id="message"/>
            </div>
            <div className="col-sm-6" style={{ margin: 'auto', borderLeft: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <h4>Upload Files to Repository</h4>
              <hr />
              <div className="row" style={{ marginLeft: '10px' }}>
                <div>
                  <label className="form-group" >Select Folder &nbsp;</label>
                  <select id="folderList" className="form-group" >
                  </select>
                </div>
                <div>
                  <label className="form-group" >Select Files To Upload  &nbsp;</label>
                  <input type="file" className="form-group" name="files[]" id="myFile" accept="image/png, image/jpeg,.docx,.doc,.txt" multiple length="1024" />
                </div>
                <button className="btn coolgreen from-group" onClick={this.closeNewFolderDialog} >Upload</button>{' '}
              </div>
            </div>
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="red" onClick={this.closeFolderDialog}>Close</Button>{' '}
        </MDBModalFooter>
      </MDBModal>
    )

    return (
      <div className="container" style={{paddingLeft:0, paddingRight:0}}>
        {folderModal}
        {deleteModal}
        {assetModal}
        {create360ModalView}
        <ContextMenu id="360ContextMenu">
          <MenuItem data={{foo: 'bar'}} onClick={this.handleContextMenu1} download>
            Copy Shareable Link
          </MenuItem>
          {/*<MenuItem divider />*/}
          {/*<MenuItem data={{foo: 'bar'}} onClick={this.handleContextMenu2}>*/}
          {/*  Edit Image in Editor*/}
          {/*</MenuItem>*/}
          {/*<MenuItem data={{foo: 'bar'}} onClick={this.handleContextMenu3}>*/}
          {/*  Edit Product in Editor*/}
          {/*</MenuItem>*/}
        </ContextMenu>
        <AssetListView>
          <div className="container">
            {/* <div className="row pd-pcr-actions-row">
              <div className="col-sm-3 pd-pcr-actions">
                <div className="btn btn-yellow" onClick={this.evaluateAccess} style={{ cursor: 'pointer' }}>Add New Asset</div>
              </div>
              <div className="col-md-3">
                {bulkDownloadButton}
              </div>
              <div className="col-md-6">
                {deleteButton}
              </div>
            </div> */}
            <div className="button-row">
              <div>
                <button className="new-asset-btn" onClick={this.evaluateAccess} title='Upload A New Asset'>+ New Asset</button>
                <button onClick={this.bulkOperation} id="Download" title='Download Selected Assets As A Zip File'>Bulk Download</button>
                <button className="new-asset-btn" onClick={() => this.handleCreate360(true)} style={{marginLeft: 12}} title='Create a 360 Spin From Selected Images'>Create 360</button>
                <a id="downloadArea" download/>
              </div>
              <button onClick={this.deleteDialog} >Delete</button>
            </div>
            {assetView}
            {asset360View}

          </div>
        </AssetListView>
        <br/>
      </div>
    )
  }
}
