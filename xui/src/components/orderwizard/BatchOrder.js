import React, { Component } from 'react';
import styled from 'styled-components'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import axios from 'axios';
import * as qs from 'query-string';
import { truncateChar } from '../../util/RegexTest'
import { API_ROOT } from '../../index';

import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBCollapse  } from "mdbreact";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';

import BatchModal from './BatchModal';
import SelectProductBatch from './SelectProductBatch';
import SelectProductSingle from './SelectProductSingle';
import SelectProductModal from './SelectProductModal';

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

const BatchBox = styled.div`
  &&& {
    max-height: 380px;
    background-color: #F4F5FA;
    border-radius: 10px;
    padding: 10px 20px;
    .dataTables_wrapper {
      .row:first-child {
        display: none;
      }
      .table-responsive {
        overflow-y: scroll;
        max-height: 150px;
        thead tr th {
          font-size: 12px;
          font-weight: bold;
          color: #333330;
          line-height: 20px;
          border-bottom: none;
          padding-left: 0;
          text-align: left;
          i {
            display: none;
          }
        }
        thead:last-child {
          display: none;
        }
        tbody tr td {
          text-align: left;
          font-size: 12px;
          color: #333330;
          line-height: 20px;
        }
      }
      .dataTables_info {
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
`

export default class BatchOrder extends Component {

  constructor(props) {
    super(props);

    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        dropdownOpenCat: false,
        editing: true,
        modal: false,
        videoModal: true,
        sort: '',
        searchQuery: "",
        isChecked: true,
        noRecord: false,
        isLoaded: false,
        productData: [],
        pageCount: 1,
        collapseID: "",
        selectedProductId: [],
        batches: [{
          "title":"Your Batch 1",
          hasSingleShot: false,
          hasFourPackShot: false,
          hasFivePackShot: false,
          hasStandardHD: false,
          has4kProductVideo: false,
          hasVideoWalkthrough: false,
          has360View: false,
          has3DIntegratedModel: false,
          hasStandard3DModel: false,
          hasAdvanced3DModel: false,
          hasCinematic3DModel: false,
          text2DNotes: '',
          text3DNotes: '',
          text360Notes: '',
          text3DVRARNotes: '',
          products: []
        }],
        selectedBatch: 0,
        accessToken: this.props.accessToken,
        batchModalOpen: false,
        productModalOpen: false
    };
    this.toggle = this.toggle.bind(this);
    this.toggleVideoModal = this.toggleVideoModal.bind(this);
    this.toggleCat = this.toggleCat.bind(this);
    this.sortProduct = this.sortProduct.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.addBatch = this.addBatch.bind(this);
    this.removeBatch = this.removeBatch.bind(this);
    this.updateBatch = this.updateBatch.bind(this);
    this.toggleBatchModal = this.toggleBatchModal.bind(this);
    this.toggleProductsModal = this.toggleProductsModal.bind(this);
    this.updateBatchProducts = this.updateBatchProducts.bind(this);
    this.removeProductFromBatch = this.removeProductFromBatch.bind(this);
    this.state.JsonData =[]
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

  componentDidMount() {
    this.getAllProduct()
    let localStorage = window.localStorage
    let batchTree = localStorage.getItem("orderTree")
    if (batchTree !== "undefined") {
      this.setState({"batches":JSON.parse(batchTree)})
    }
  }

  componentWillUnmount() {
    let localStorage = window.localStorage
    localStorage.setItem("orderTree", JSON.stringify(this.state.batches))
  }


  toggleBatchModal = (idx) => {
    this.setState({
      batchModalOpen: !this.state.batchModalOpen,
      selectedBatch: idx
    });
  }

  toggleProductsModal = (idx) => {
    this.setState({
      productModalOpen: !this.state.productModalOpen,
      selectedBatch: idx
    });
  }

  previousPage = () => {
    this.state.pageCount = this.state.pageCount-1
    if(this.state.pageCount != 0){
      this.getAllProduct()
    }else{
      this.state.pageCount = this.state.pageCount+1
    }
  }

  nextPage = () => {
    this.state.isLoaded = false
    this.state.pageCount = this.state.pageCount+1
    this.getAllProduct()
  }

  sortProduct(evt) {
    this.state.isLoaded = false
    this.setState({
      'sort': evt.target.value
    });
    this.getAllProduct(evt.target.value, true)
  }

  /*get product data */
  getAllProduct = (sort,flag) => {
    // //console.log(this.state)
    let apiUrl
    if(flag){
      apiUrl = API_ROOT + '/api/xspace-products/?page='+this.state.pageCount+'&sort='+sort
    }else{
      apiUrl = API_ROOT + '/api/xspace-products/?page='+this.state.pageCount
    }

  }

  handleCheckboxChange(event) {
    this.setState({isChecked: event.target.checked});
  }

  removeProductFromBatch(batchIdx, index) {
    let { batches } = this.state
    let batch = batches[batchIdx]
    let batchProducts =  batch["products"]
    batchProducts.splice(index, 1)
    batch["products"] = batchProducts
    batches[batchIdx] = batch
    this.setState({"batches":batches, "productModalOpen":false})
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
  }

  toggle() {
      this.setState({
          dropdownOpen: !this.state.dropdownOpen
      });
  }

  toggleContentType = () => {
  this.setState({
    modal: !this.state.modal
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

  addBatch() {
    let batches = this.state.batches
    let newBatch = {
      "title":"Your Batch " + (batches.length + 1),
      hasSingleShot: false,
      hasFourPackShot: false,
      hasFivePackShot: false,
      hasStandardHD: false,
      has4kProductVideo: false,
      hasVideoWalkthrough: false,
      has360View: false,
      has3DIntegratedModel: false,
      hasStandard3DModel: false,
      hasAdvanced3DModel: false,
      hasCinematic3DModel: false,
      text2DNotes: '',
      text3DNotes: '',
      text360Notes: '',
      text3DVRARNotes: ''
    }
    batches.push(newBatch)
    this.setState({"batches":batches})
  }

  updateBatch(idx, item) {
    let batches = this.state.batches
    batches[idx] = item
    this.setState({"batches":batches, "batchModalOpen": false})
  }

  removeBatch(idx) {
    if (idx >= 0) {
      let batches = this.state.batches
      batches.splice(idx, 1)
      this.setState({"batches":batches})
    }
  }

  toggleVideoModal = () => {
  this.setState({
    videoModal: !this.props.videoModal
  });
  //console.log("Test")

  }

  /*Search product*/
  onSubmit = (event) => {
      const conmont = this
      event.preventDefault()
      const search_query = this.state.searchQuery
      const user_id = this.props.fieldValues.user_id
      axios.get(API_ROOT + '/api/product_search?query_string='+search_query+'&user_id='+user_id)
      .then(function (response) {
        if(response.data.length != 0){
          const newProduct = response.data.map((product) => {
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

          conmont.setState({
            productData: newProduct,
            noRecord: false,
            isLoaded: true
          });
        }else{
          conmont.setState({
            noRecord: true,
            isLoaded: true
          });
        }

      })
      .catch(function (error) {
        console.error(error);
      });
  }

  toggleCollapse = (collapseID) => {
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));
  }

  saveModal = (idx, info) => {

  }

  updateBatchProducts = (products) => {
    let { batches } = this.state
    let batch = batches[this.state.selectedBatch]
    let batchProducts = []
    products.map((p, idx) => {
      batchProducts.push(p)
    })
    batch["numberOfProducts"] = batchProducts.length
    batch["product_list"] = batchProducts
    batch["products"] = batchProducts
    batches[this.state.selectedBatch] = batch
    this.setState({"batches":batches, "productModalOpen":false})
    this.props.setBatchData(batches)
  }

  render() {

    let { singleMode } = this.props
    let { batchModalOpen, productModalOpen } = this.state

                // <a className="white-text new-batch" rounded="true" color="white" onClick={this.toggleCollapse("basicCollapse")}>+ New Batch</a>
    let orderingDropDown = (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav caret><p>Descending</p></DropdownToggle>
        <DropdownMenu>
            <DropdownItem href="#">Ascending</DropdownItem>
            <DropdownItem href="#">Descending</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )

    let batchView = (<div></div>)
    let addView = (<div></div>)
    let batchHeading = (<div></div>)
    let batchDescription = (<div></div>)

//    let batchModal = (
//      <MDBModal isOpen={batchModalOpen} toggle={this.batchModalOpen} size="lg" centered >
//        <MDBModalBody>
//          <BatchModal
//            cancelModal={()=>{this.toggleBatchModal(this.state.selectedBatch)}}
//            saveBatchInfo={(info)=>{this.updateBatch(this.state.selectedBatch, info)}}
//            batchInfo={this.state.batches[this.state.selectedBatch]}>
//          </BatchModal>
//        </MDBModalBody>
//      </MDBModal>
//    )

    let selectProductModal = (
      <MDBModal isOpen={productModalOpen} toggle={this.productModalOpen} size="fluid" centered>
        <MDBModalHeader>Select Products</MDBModalHeader>
        <MDBModalBody>
          <SelectProductModal
            fieldValues={this.fieldValues}
            accessToken={this.props.accessToken}
            truncateChar={this.props.truncateChar}
            toggleModal={this.toggleProductsModal}
            returnProducts={this.updateBatchProducts}
            isLoaded={false}>
          </SelectProductModal>
        </MDBModalBody>
      </MDBModal>
    )

    if (singleMode) {
      batchHeading = (
        <h4>Order For Single Product</h4>
      )
      batchDescription = (
        <p>Use the area below to select a single product for your order.</p>
      )
      batchView = (
        <MDBRow key={0} style={{marginTop: 5, marginBottom: 5}}>
          <MDBCol md="12" >
            <div className="clearfix" onClick={this.toggleCollapse("basicCollapse" + 0)}>
              <div className="d-inline-block " style={{ paddingLeft: "20", marginTop:"3" }}><p className="white-text" >{this.state.batches[0].title}</p></div>
              <MDBBtn className="float-right" rounded color="blue" onClick={() => {this.toggleBatchModal(0)}}><i className="fa fa-pencil-square-o" aria-hidden="true"></i>Select Services</MDBBtn>
            </div>
            <MDBCollapse id={"basicCollapse" + 0} isOpen={this.state.collapseID}>
              <div className="basic-collapse">
                <SelectProductSingle
                   fieldValues={this.props.fieldValues}
                   accessToken={this.props.accessToken}
                   truncateChar={this.props.truncateChar}
                   batchData={this.props.batchData}
                   updateBatchProducts={this.updateBatchProducts}
                   isLoaded={true}>
               </SelectProductSingle>
              </div>
            </MDBCollapse>
          </MDBCol>
        </MDBRow>
      )
    } else {
      batchHeading = (
        <h4>Create A Batch</h4>
      )
      batchDescription = (
        <p>Create a batch within your order to make customizing services for many products a seamless experience.</p>
      )
      addView = (<a className="white-text new-batch" rounded="true" color="white" onClick={this.addBatch}>+ Add New Batch</a>)
      if (this.state.batches) {
        batchView = (
          this.state.batches.map((map, idx) => {
            let view = <SelectProductBatch
               fieldValues={this.fieldValues}
               accessToken={this.props.accessToken}
               truncateChar={this.props.truncateChar}
               data={this.state.batches[idx].products}
               batchIndex={idx}
               remove={this.removeProductFromBatch}
               isLoaded={true}>
            </SelectProductBatch>
            return (
              <MDBRow key={idx} style={{marginTop: 5, marginBottom: 5}}>
                <MDBCol md="12" >
                  <div className="clearfix" onClick={() => this.toggleCollapse("basicCollapse" + idx)}>
                    <div className="d-inline-block " style={{ paddingLeft: "20", marginTop:"3" }}><p className="white-text" >{map.title}</p></div>
                    <MDBBtn className="float-right" rounded color="red" onClick={() => this.removeBatch(idx)} ><i className="fa fa-trash" aria-hidden="true"></i>     Delete</MDBBtn>
                    <MDBBtn className="float-right" rounded color="blue" onClick={() => {this.toggleBatchModal(idx)}}><i className="fa fa-pencil-square-o" aria-hidden="true"></i>     Select Services</MDBBtn>
                    <MDBBtn className="float-right" rounded color="green" onClick={() => {this.toggleProductsModal(idx)}}><i className="fa fa-plus-circle" aria-hidden="true"></i>     Add Products</MDBBtn>
                  </div>
                  <MDBCollapse id={"basicCollapse" + idx} isOpen={this.state.collapseID}>
                    <div className="basic-collapse">
                      {view}
                    </div>
                  </MDBCollapse>
                </MDBCol>
              </MDBRow>
            )
          })
        )
      }
    }

    return (
      <div className="animated fadeIn">
        <FlexBox>
          <div>
            {batchHeading}
            {batchDescription}
          </div>
          <button onClick={this.props.toggleVideoModal} >Show Me How</button>
        </FlexBox>
        <BatchBox class="batch-box">
          {this.props.batchView}
        </BatchBox>
        <MDBRow>
          <MDBCol md="12">
            {this.props.addView}
          </MDBCol>
        </MDBRow>
      </div>
    );
  }
}
