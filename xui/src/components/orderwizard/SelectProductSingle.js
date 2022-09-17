import React, { Component } from 'react';
import { MDBContainer, Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import ReactQuill from 'react-quill'
import axios from 'axios';
import * as qs from 'query-string';
import  Loader from 'react-loader';
import { truncateChar } from '../../util/RegexTest'
import { API_ROOT } from '../../index';
import { MDBTable, MDBTableBody, MDBTableHead, MDBDataTable   } from 'mdbreact';
import Moment from 'react-moment';
import 'moment-timezone';
import styled from 'styled-components'
import singleShot from '../../assets/img/single-shot.png'
import fourShots from '../../assets/img/four-shots.png'
import fiveShots from '../../assets/img/five-shots.png'
import viewModels from '../../assets/img/view-models.png'
import multiAxis from '../../assets/img/multi-axis.png'
import videoPlayer from '../../assets/img/video-player.png'
import AV from '../../assets/img/ar-icon.png'
import EditBatchModal from './EditBatchModal';

import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from "mdbreact";
import { MDBSelect, MDBSelectInput, MDBSelectOptions, MDBSelectOption} from "mdbreact";
import { MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';

import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

const uuidv4 = require('uuid/v4');

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  color: #333330;
  h4 {
    font-size: 18px;
    line-height: 26px;
    font-weight: 400;
  }
  p {
    font-size: 14px;
    line-height: 20px;
    opacity: .5;
  }
  button {
    font-weight: bold;
    color: #333333;
    font-size: 14px;
    line-height: 20px;
    height: 38px;
    border-radius: 19px;
    width: 133px;
    border: 2px solid #F4F5FA;
    :hover {
      background-color: #00A3FF;
      color: white;
      border: none;
    }
  }
`

export default class SelectProductSingle extends Component {

  constructor(props) {
    super(props);

    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        dropdownOpenCat: false,
        editing: true,
        sort: '',
        searchQuery: "",
        isChecked: true,
        noRecord: false,
        isLoaded: false,
        productData: [],
        pageCount: 1,
        selectedProductIndex: 0,
        tableRows: [],
        uploading: false,
        modelmessage: '',
        orderID: '',
        editBatchModalOpen: true,
    };
    this.editingFieldValues = {
        orderID: '',
        fileCount: 0,
        hasBackgroundRemoval: false,
        hasAutoCropAndCenter: false,
        hasRename: false,
        hasBlemishReduction: false,
        hasBarcodeDetection: false,
        renameNotes: '',
        imageList: [],
    }
    this.toggle = this.toggle.bind(this);
    this.toggleCat = this.toggleCat.bind(this);
    this.sortProduct = this.sortProduct.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.state.JsonData =[];
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.toggleEditServicesModal = this.toggleEditServicesModal.bind(this)
    this.assembleFiles = this.assembleFiles.bind(this)
    this.userData = JSON.parse(localStorage.getItem('persist:root'));
    var data = JSON.parse(this.userData['auth']);
    this.user_id = data['access']['user_id'];


    // this.get_products();
  }

  // get_products() {
  //   console.log("GP")
  //   console.log(this.user_id)
  //   fetch(API_ROOT + '/api/products_list/'+this.user_id+'/'+20+'/'+1+'/', {
  //       method: 'GET',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //       }
  //     }).then(res => res.json())
  //     .catch(error => console.error('Error:', error))
  //     .then(response => {
  //       console.log("-----------3-----------")
  //       console.log(response)
  //       try{
  //         //console.log(response[response.length-1]['pagecount']);
  //         this.setState({pagecount: response[response.length-1]['pagecount']});
  //         response.pop();
  //         this.setState({
  //           products: response,
  //           isSuccess: true
  //         });
  //       }catch(err){}
  //
  //   });
  // }



  handleInputChange = (event) => {
      const target = event.target,
          value = target.type ===
          'checkbox' ? target.checked : target.value,
        name = target.name
      this.setState({
          [name]: value
      });
  }

  componentWillUnmount() {

     this.editingFieldValues.fileCount = this.editingFieldValues.imageList.length;

     var payload = {'orderID':this.editingFieldValues.orderID,'fileCount':this.editingFieldValues.fileCount, 'hasBackgroundRemoval':this.editingFieldValues.hasBackgroundRemoval,
      'hasAutoCropAndCenter':this.editingFieldValues.hasAutoCropAndCenter, 'hasRename':this.editingFieldValues.hasRename, 'hasBlemishReduction':this.editingFieldValues.hasBlemishReduction, 'hasBarcodeDetection': this.editingFieldValues.hasBarcodeDetection, 'fileList': this.editingFieldValues.imageList};

     this.props.submitEditOrder(payload)
  }

  componentDidMount() {
    /*Get All Product Data*/
    this.getAllProducts()
    var neworderID = uuidv4();
    this.setState({orderID: neworderID});
    this.editingFieldValues.orderID = neworderID;
  }

  previousPage = () => {
    this.state.pageCount = this.state.pageCount-1
    if(this.state.pageCount != 0){
      this.getAllProducts()
    }else{
      this.state.pageCount = this.state.pageCount+1
    }
  }

  nextPage = () => {
    this.state.isLoaded = false
    this.state.pageCount = this.state.pageCount+1
    this.getAllProducts()
  }

  sortProduct(evt) {
    this.state.isLoaded = false
    this.setState({
      'sort': evt.target.value
    });
    this.getAllProducts(evt.target.value, true)
  }

  returnProducts = () => {
    let products = []
    let keys = Object.keys(this.state.selectedProductList)
    keys.map((key) => {
      products.push(this.state.selectedProductList[key])
    })
    return this.props.returnProducts(products)
  }

  assembleFiles = (fileDataArray) => {
    let fileRow =fileDataArray.map((file, index) => {
      return (
        {
          id: index + 1,
          filename: file,
        }
      )
    });
    return fileRow;
  }

  /*get product data */
  getAllProducts = (sort,flag) => {
    let apiUrl

    if(flag){
      apiUrl = API_ROOT + '/api/xspace-products2/?format=datatables'
    }else{
      apiUrl = API_ROOT + '/api/xspace-products2/?format=datatables'
    }

    let thisScope = this;
    const config = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'authorization': 'Bearer ' + this.props.accessToken
      },
    }

    var body = JSON.stringify({
        "userid": this.user_id,
    })

    axios.post(apiUrl,body,config).then(function (response) {
      const newProduct = response.data.data.map((product) => {
        product['isChecked'] = false,
        product['is360viewrequired'] = false,
        product['is2drequired'] = false,
        product['is3dmodelrequired']= false,
        product['isvideorequired'] = false,
        product['notes2d'] = "",
        product['notes360view'] = "",
        product['notes3dmodel']= "",
        product['notesvideo'] = ""
        return product;
      });
      //console.log(response)
      thisScope.setState({
        productData: newProduct,
        isLoaded: true,
        tableRows:thisScope.assembleProducts(newProduct)
      },()=> {
        //completion block
      });
    })
    .catch(function (error) {
      console.error(error);
    });
  }

  handleCheckboxChange(event) {
    this.setState({isChecked: event.target.checked});
  }

  changeCheckbox = (product, event) => {

    let arr = this.props.fieldValues.selectedProductLists.slice();

    if(arr.indexOf(product) >= 0) {
      product['isChecked'] = false
      arr.splice(arr.indexOf(product), 1);
    } else {
      product['isChecked'] = true
      arr.push(product);
    }
    this.props.fieldValues.selectedProductLists = arr
    return this.props.fieldValues.selectedProductLists
  }


  changeRadioButton = (product,event) =>{
    this.props.fieldValues.selectedProductLists[0] = product;

    //console.log(this.props.fieldValues);
    //this.props.singleProduct = true;
    let products = []
    let keys = Object.keys(this.props.fieldValues.selectedProductLists)
    keys.map((key) => {
      products.push(this.props.fieldValues.selectedProductLists[key])
    })

    this.props.updateBatchProducts(products)

  }

  toggle() {
      this.setState({
          dropdownOpen: !this.state.dropdownOpen
      });
  }

  toggleCat() {
      this.setState({
          dropdownOpenCat: !this.state.dropdownOpenCat
      });
  }

  clearMessage(){
    this.setState({
        noRecord: false
    });
  }

  toggleEditServicesModal(){
    this.setState({
      editBatchModalOpen: !this.state.editBatchModalOpen,
    });
  }

  handleFileUpload(event) {
    event.preventDefault()
    var pfs = this.pond.getFiles();


    var userData = JSON.parse(localStorage.getItem('persist:root'));
    var data = JSON.parse(userData['auth']);
    var user_id = this.props.userId;
    var fileToRead = '';
    var files = '';
    var len = '';


    len = pfs.length;
    if (len != 0) {
      this.setState({
        uploading: true,
      });

      for (var i = 0; i < len; i++) {
          var link = window.location.href;
          link = link.split("/");
          var slug = link[5];
          var lenMax = len-1;
          // Display the key/value pairs

          var fl1 = pfs[i]

          //var fileurl = 'https://storage.xspaceapp.com/'+this.props.userInfo.companySlug+'/orders/editing/'+this.state.orderID;
          this.editingFieldValues.imageList.push(fl1.file.name)

          //console.log(this.state.imageList)
          this.props.createFileEditUpload(this.state.orderID, fl1.file).then((res)=> {
                this.setState({"uploading":false});
                this.setState({ modelmessage: 'Your files have been successfully added to your order. Review your files, & click next to finish checkout.'});

          }).catch((err)=> {
            this.setState({"uploading":false},()=> {
              alert("An unknown error as occured uploading file.")
            })
          });
      }
      var filesForTable = this.assembleFiles(this.editingFieldValues.imageList);
      this.setState({tableRows:filesForTable});

      //alert("Your files have been successfully added to your order. Click next to finish checkout.")

      //this.setState({ modelmessage: 'Your files have been successfully added to your order. Click next to finish checkout.'});


    } else {
      this.setState({
        modelmessage: 'Your files were not successfully added to your order. Please upload again.</h5>'
      });
    }

  }

  render() {

    const data = {
    columns: [
      {
        label: '#',
        field: 'id',
        sort: 'asc'
      },
      {
        label: 'Filename',
        field: 'filename',
        sort: 'asc'
      },
    ],
    rows: this.state.tableRows
  };

    let orderingDropDown = (
      <Dropdown isopen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav caret><p>Descending</p></DropdownToggle>
        <DropdownMenu>
            <DropdownItem href="#">Ascending</DropdownItem>
            <DropdownItem href="#">Descending</DropdownItem>
        </DropdownMenu>
      </Dropdown>
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

    let batchModal = (
      <MDBModal isOpen={this.state.editBatchModalOpen} toggle={this.toggleEditServicesModal} size="lg" centered >
        <MDBModalBody>
          <EditBatchModal
           fieldValues={this.editingFieldValues}
           cancelModal={this.toggleEditServicesModal}
           >
          </EditBatchModal>
        </MDBModalBody>
      </MDBModal>
    )

    return (
        <MDBContainer>
          <div className="animated fadeIn">
            {batchModal}
            <FlexBox>
                <div>
                    <h2>Create An Editing Order</h2>
                    <p>Select your editing service for your desired photos, upload, and review.</p>
                </div>
                <center><button onClick={this.props.toggleVideoModal} >Show Me How</button></center>
            </FlexBox>
            <div className="row" style={{ marginTop:15 }}>
                <h2>1. Select Editing Services    </h2>
                <i className="fa fa-list fa-2x" style={{ marginLeft:10 }} aria-hidden="true"></i>
            </div>
             <div className="row">
                <center><button className="btn btn-primary" onClick={this.toggleEditServicesModal}>Choose Services</button>{' '}</center>
                <br />
            </div>
            <div className="row" style={{ marginTop:35 }}>
                <h2>2. Upload Images   </h2>
                <i className="fa fa-cloud-upload fa-2x" style={{ marginLeft:10 }} aria-hidden="true"></i>
            </div>
                <p>Please upload the images that you desire to have edited.</p>
            <div className="row">
              <div className="col-md-12" style={{ margin: 'auto' }}>
                  <MDBContainer>
                      <div class="row">



                      </div>
                    <center>
                    {uploadButton}
                    <br/>
                    <b>{this.state.modelmessage}</b>
                    <br/>
                    </center>



                  </MDBContainer>

              </div>
              <div className="flex-row" style={{ marginTop:25 }}>
                <div><h2>3. Review Files  </h2></div>
                <div className="col-lg-12">
                    <br/>
                    <MDBDataTable
                      btn
                      searchLabel="Search Files"
                      pagination="true"
                      data={data}></MDBDataTable>
                      { this.state.noRecord ? <div class="row" style={{width:1030, height:105 }}>
                        <div className="alert-wizard" style={{position: 'absolute', marginLeft: -82, marginTop: 37, background: '#EB5757', width: 1085 }}>
                          <p className="alert-wizard-text" style={{width: 366, textAlign: 'center'}}>No result found <i class="fa fa-times" aria-hidden="true" style={{marginLeft: 691,position: 'absolute', marginTop: 12}} onClick={this.clearMessage}></i></p>
                          </div>
                        </div>: ""
                      }
                </div>

            </div>
            </div>

          </div>
        </MDBContainer>
    );
  }
}
