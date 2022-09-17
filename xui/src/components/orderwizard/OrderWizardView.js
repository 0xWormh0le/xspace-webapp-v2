import React, { Component } from 'react';
import styled from 'styled-components'
import { Button, MDBCollapse, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBContainer, MDBRow, MDBCol, MDBBtn, ToastContainer, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, Modal} from 'mdbreact';
import ChooseOrderingMethod from '../orderwizard/OrderMethod';
import SelectProduct from '../orderwizard/SelectProduct';
import SpecifyAsset from '../orderwizard/SpecifyAsset';
import ReviewAndConfirm from '../orderwizard/ReviewAndConfirm';
import ShippingDetails from '../orderwizard/ShippingDetails';
import AssetCreate from '../orderwizard/AssetCreate'
import BatchOrder from '../orderwizard/BatchOrder'
import SaveOrder from '../orderwizard/SaveOrder'
import EditingSaveOrder from '../orderwizard/EditingSaveOrder'
import CompleteOrder from '../orderwizard/CompleteOrder'
import SelectProductBatch from './SelectProductBatch';
import SelectProductSingle from './SelectProductSingle';
import './OrderWizard.css';
import ContentStandard from '../orderwizard/ContentStandard'
import axios from 'axios';

import { truncateChar } from '../../util/RegexTest'

import SelectProductModal from './SelectProductModal';
import BatchModal from './BatchModal';

import singleShot from '../../assets/img/single-shot.png'
import fourShots from '../../assets/img/four-shots.png'
import fiveShots from '../../assets/img/five-shots.png'
import viewModels from '../../assets/img/view-models.png'
import multiAxis from '../../assets/img/multi-axis.png'
import videoPlayer from '../../assets/img/video-player.png'
import AV from '../../assets/img/ar-icon.png'
import { Step, Fragment, Container } from '../ProductCreateView'
import notify from '../../lib/notify'

const MODE_UNSELECTED = -1
const MODE_SINGLE = 0
const MODE_BATCH = 1

const STEP_1_STANDARDS = 0
const STEP_2_MODE = 1
const STEP_3_BATCH = 2
const STEP_4_REVIEW = 3
const STEP_5_PROCESSED = 4
const STEP_6_COMPLETED = 5

const StyledContainer = styled(Container)`
  .bottom-row {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    margin-top: 50px;
    padding-bottom: 50px;
    button {
      width: 213px;
      height: 58px;
      border-radius: 29px;
      font-size: 18px;
      line-height: 26px;
    }
  }
`

const StyledModal = styled(MDBModal)`
  min-width: 848px;
  .modal-content {
    border-radius: 10px;
  }
  .modal-header {
    border-bottom: 2px solid #F4F5FA;
    .modal-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 90%;
      b, button {
        color: #333333;
        font-size: 16px;
        line-height: 26px;
      }
      button {
        border: 2px solid #F4F5FA;
        background-color: white;
        border-radius: 20px;
        width: 120px;
        height: 38px;
        :hover {
          background-color: #00A3FF;
          color: white;
          border: none;
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
          color: #333333;
          font-size: 14px;
          font-weight: bold;
          line-height: 20px;
          border-radius: 19px;
          border: 2px solid #F4F5FA;
          :hover {
            background-color: #00A3FF;
            color: white;
            border: none;
          }
        }
        a {
          text-decoration: none;
          color: #333333;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          margin-right: 30px;
          border: 2px solid #F4F5FA;
          :hover {
            background-color: #00A3FF;
            color: white;
            border: none;
          }
        }
      }
    }
  }
`

const StyledContentStandardModal = styled(StyledModal)`
  .modal-content {
    max-width: 1008px;
    margin: auto;
    .flex-container-row {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    .modal-body {
      width: 100%;
      .row {
        justify-content: center;
        button {
          min-width: 133px;
          height: 38px;
          background-color: #00A3FF;
          border-radius: 19px;
          color: white;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
`

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  .collapse.show {
    max-height: 265px;
    overflow: auto;
  }
  p {
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    line-height: 20px;
    margin: 0;
  }
  button {
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    color: #333333;
    background-color: white;
    width: 133px;
    height: 38px;
    border-radius: 19px;
    border: 2px solid #F4F5FA;
    margin-right: 15px;
    :hover {
      background-color: #00A3FF;
      color: #ffffff;
      border: none;
    }
  }
  button:last-child {
    color: #EB5757;
    :hover {
      background-color: #EB5757;
      color: #ffffff;
    }
  }
  :hover {
    cursor: pointer;
  }
`

const StyledButton = styled.button`
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
  color: #00A3FF;
  background-color: white;
  width: 133px;
  height: 38px;
  border-radius: 19px;
  border: 2px solid #F4F5FA;
  :hover {
    color: white;
    background-color: #00A3FF;
    border: none;
  }
`

const StyledProductModal = styled(MDBModal)`
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .modal-title {
      font-size: 18px;
      button {
        right: 16px;
        position: absolute;
        top: 16px;
        border: 2px solid #F4F5FA;
        font-weight: bold;
        border-radius: 15px;
        padding: 0 10px;
        :hover {
          background-color: #00A3FF;
          color: white;
          border: none;
        }
      }
    }

  }
`
//
export default class OrderWizardView extends Component {
    constructor(props) {
      super(props);
      this.fieldValues = {
        name     : null,
        email    : null,
        password : null,
        user_id: props.userId,
        isSignleProduct : null,
        notSelected: false,
        singleProduct: false,
        selectedProductLists: [],
        product_list: [],
        responseData: [],
        mainObject: {"numberOfProducts": ""},
        accessToken: this.props.accessToken,
        contentstandardsList: [],
        saveData: [],
        batchData: {},
        addressListData:[],
        existingAddressData:[],
        addressId:-1,
        shippingInfo: {},
        newAddressData:{
          address1: '',
          address2: '',
          poBoxNum: '',
          city: '',
          state: '',
          zipcode: '',
          country: 'United States',
        }
      }
      this.get_content_standard = this.get_content_standard.bind(this);
      this.toggleVideoModal = this.toggleVideoModal.bind(this);
      this.toggleOrderVideoModal = this.toggleOrderVideoModal.bind(this);
      this.toggleEditOrderVideoModal = this.toggleEditOrderVideoModal.bind(this);
      this.toggleAddressErrorModal = this.toggleAddressErrorModal.bind(this);
      this.toggleBatchErrorModal = this.toggleBatchErrorModal.bind(this);
      this.checkNoBatchInfo = this.checkNoBatchInfo.bind(this);
      this.toggleOrderStartModal = this.toggleOrderStartModal.bind(this);
      this.truncate = this.truncate.bind(this);
      this.toggleCollapse = this.toggleCollapse.bind(this)

      this.state = {
        step: 1,
        mode: MODE_SINGLE,
        notSelected: false,
        videoModal:false,
        orderVideoModal:false,
        editOrderVideoModal: false,
        addressErrorModal: false,
        batchErrorModal: false,
        contentStandardModal: false,
        orderStartModal: false,
        batchData: {
            "numberOfOrders":0,
            "orders":[]
        },
        saveNewAddress:false,
        returnProducts:false,
        batchModalOpen: false,
        productModalOpen: false,
        batches: [{
          title:"Your Batch 1",
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
      }

      this.previousStep = this.previousStep.bind(this)
      this.setMode = this.setMode.bind(this)
      this.setBatchData = this.setBatchData.bind(this)
      // this.submitData = this.submitData.bind(this)
      this.createStandard = this.createStandard.bind(this)
      this.contentStandardToggle = this.contentStandardToggle.bind(this)
      this.reloadPage = this.reloadPage.bind(this)
      this.passAddressData = this.passAddressData.bind(this)
      this.toggleBatchModal = this.toggleBatchModal.bind(this);
      this.toggleProductsModal = this.toggleProductsModal.bind(this);
      this.updateBatchProducts = this.updateBatchProducts.bind(this);
      this.addBatch = this.addBatch.bind(this)
      this.updateBatch = this.updateBatch.bind(this)
      this.removeBatch = this.removeBatch.bind(this)
      this.removeFromBatch = this.removeFromBatch.bind(this)
      this.submitEditOrder = this.submitEditOrder.bind(this)
    }

  setBatchData(data) {
    this.setState({"batchData": {"numberOfOrders":data.length,"orders":data}}, () => {
      let localStorage = window.localStorage
      localStorage.setItem("orderTree", JSON.stringify(this.state.batchData))
    });
  }

  componentDidMount() {

    this.props.getAddress();
    this.get_content_standard();
    document.title = 'XSPACE | Order Wizard'
    let url = this.props.match.url
    if (url.includes("confirm")) {
      this.setState({"step":6,"orderStartModal":false})
    }
  }

  componentWillReceiveProps(nextProps){

    if(this.props.contentStandard){
      if(nextProps.contentStandard["contentStandard"]!==this.props.contentStandard["contentStandard"]){
        //Perform some operation
        this.fieldValues.contentstandardsList = nextProps.contentStandard["contentStandard"]
        this.setState({contentstandardsList: nextProps.contentStandard["contentStandard"] });

      }
    }
  }

  updateBatch(idx, item) {
    let batches = this.state.batches
    batches[idx] = item
    this.setState({"batches":batches, "batchModalOpen": false})
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
    this.setBatchData(batches)
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

  createStandard(payload){
      this.props.createContentStandard(payload);
  }

  get_content_standard(){

    //commented for stability check
    //promisified for timing results
    this.props.getContentStandard();
    //this.setState({ contentstandardsList: this.props.contentStandard["contentStandard"] });
    //this.fieldValues.contentstandardsList = this.props.contentStandard["contentStandard"];
    //     console.log(this.fieldValues)

  }

  loadSelectedProduct = (product_count) => {
    for (let i = 0; i < product_count; i++) {
        const product = {
                          "id": this.fieldValues.selectedProductLists[i].productid,
                          "is360viewrequired": this.fieldValues.selectedProductLists[i].is360viewrequired,
                          "is2drequired": this.fieldValues.selectedProductLists[i].is2drequired,
                          "is3dmodelrequired": this.fieldValues.selectedProductLists[i].is3dmodelrequired,
                          "isvideorequired": this.fieldValues.selectedProductLists[i].isvideorequired,
                          "notes2d": this.fieldValues.selectedProductLists[i].notes2d,
                          "notes360view": this.fieldValues.selectedProductLists[i].notes360view,
                          "notes3dmodel": this.fieldValues.selectedProductLists[i].notes3dmodel,
                          "notesvideo": this.fieldValues.selectedProductLists[i].notesvideo,
                        }
        this.fieldValues.product_list.push(product)
    }

    this.fieldValues.mainObject['numberOfProducts'] = product_count
    this.fieldValues.mainObject['product_list'] = this.fieldValues.product_list
  }

  truncate(charString, productName) {

    if(productName){
      return charString.length>=10 ? charString.substring(0, 10)+"...": charString
    }else{
      return charString.length>=6 ? charString.substring(0, 8)+"...": charString
    }
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

  toggleVideoModal = () => {
  this.setState({
    videoModal: !this.state.videoModal
  });

  }

  toggleOrderVideoModal = () => {
  this.setState({
    orderVideoModal: !this.state.orderVideoModal
  });

  }

  toggleEditOrderVideoModal = () => {
  this.setState({
    editOrderVideoModal: !this.state.editOrderVideoModal
  });

  }



  toggleAddressErrorModal = () => {
  // this.setState({
  //   addressErrorModal: !this.state.addressErrorModal
  // });
  console.log('notify')
    notify('error', 'Uh oh, looks like no address information was entered. We will need your address to complete your order.')
  }

  toggleBatchErrorModal = () => {
  // this.setState({
  //   batchErrorModal: !this.state.batchErrorModal
  // });
  console.log('notify')
    notify('error', 'Uh oh, looks like no products were added to your batch. We will need your XSPACE products to complete your order.')
  }

  contentStandardToggle = () => {
  this.setState({
    contentStandardModal: !this.state.contentStandardModal
  });

  }

  toggleOrderStartModal = () => {
  this.setState({
    orderStartModal: !this.state.orderStartModal
  });

  }

  toggleCollapse = (collapseID) => {
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));
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


  checkNoBatchInfo = (order) => {
    if (order.has3DIntegratedModel || order.has4kProductVideo || order.has360View ||
      order.hasAdvanced3DModel || order.hasCinematic3DModel || order.hasFivePackShot ||
      order.hasFourPackShot || order.hasSingleShot || order.hasStandard3DModel ||
      order.hasStandardHD || order.hasVideoWalkthrough) {
        return false
    } else {
      return true
    }
  }

  nextStep = () => {
      if (this.state.step == STEP_2_MODE) {
        if(this.state.mode != MODE_UNSELECTED ){
          if(this.state.mode == 0 ){
              this.setState({
                  step : this.state.step + 1
              })
          }else{
              this.setState({
                      step : this.state.step + 5
                  })
          }
        } else {
          notify('error', 'You must select one of the following options.')
        }
      } else if(this.state.step == STEP_3_BATCH){
          if(this.state.batchData.numberOfOrders != 0 && this.fieldValues.singleProduct !== false){
            let total = this.state.batchData.numberOfOrders
            let flaggedOrderName = ""
            let pass = true
            for (var i = 0; i < total; i++) {
              let order = this.state.batchData.orders[i]
              if (this.checkNoBatchInfo(order)) {
                pass = false
                total = 0
                flaggedOrderName = this.state.batchData.orders[i].title
              }
            }
            if (pass) {
              this.setState({
                step : this.state.step + 1
              })
            } else {
              notify('error', `Your batch ${flaggedOrderName} needs to have at least one service selected.`)
            }
          }
          else if(this.state.batchData.numberOfOrders != 0 ){
            let total = this.state.batchData.numberOfOrders
            let flaggedOrderName = ""
            let pass = true
            for (var i = 0; i < total; i++) {
              let order = this.state.batchData.orders[i]
              if (this.checkNoBatchInfo(order)) {
                pass = false
                total = 0
                flaggedOrderName = this.state.batchData.orders[i].title
              }
            }
            if (pass) {
              this.setState({
                step : this.state.step + 1
              })
            } else {
              notify('error', `Your batch ${flaggedOrderName} needs to have at least one service selected.`)
            }
          }
          else {
            this.toggleBatchErrorModal();
          }

      } else if(this.state.step == STEP_4_REVIEW){

        if(this.fieldValues.addressId != -1 && this.fieldValues.newAddressData.address1 != "" && this.fieldValues.newAddressData.address2 != "" ){
          this.setState({
              step : this.state.step + 2
          })

          //this.submitData();

        }
        else if(this.fieldValues.addressId != -1 ){
            this.setState({
              step : this.state.step + 2
          })

          //this.submitData();
        }
        else {
          this.toggleAddressErrorModal()
        }


      } else if(this.state.step == STEP_5_PROCESSED){
        this.setState({
            step : this.state.step + 1
        })
      }else if(this.state.step == 6){
        this.setState({
            step : this.state.step + 1
        })
      }else if(this.state.step == STEP_1_STANDARDS){
        this.setState({
            step : this.state.step + 1
        })
      }
  }


  // Same as nextStep, but decrementing
  previousStep = () => {

    if(this.state.step == 2){
        this.setState({
            step : this.state.step - 2
        })
    }
    if(this.state.step == 6){
        this.setState({
            step : this.state.step - 5
        })
    }
    else{

        this.setState({
            step : this.state.step - 1
        })

    }


  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmit(this.state.username, this.state.password)
  }

  setMode = (mode) => {
    this.setState({
      mode: mode
    })
  }

  passAddressData(state) {
    this.setState({"shippingInfo":state}, () => {
      let { batchData, shippingInfo } = this.state

      let payload = batchData
      payload["shippingInfo"] = shippingInfo

      if(this.fieldValues.saveNewAddress === true){
          this.props.saveAddress(this.fieldValues.newAddressData)
      }

      this.props.saveOrders(payload)
    })
  }

  submitEditOrder(payload) {
    this.props.saveEditingOrder(payload)
  }

  removeFromBatch(batchIdx, idx) {
    let oldBatch = [...this.state.batches]
    oldBatch[batchIdx]["product_list"].splice(idx, 1)
    this.setState({"batches":oldBatch})
  }

  reloadPage(){
    window.location.reload();
  }

  render() {
    const errors = this.props.errors || {}
    const { step, collapseID, batchData, batches, videoModal, orderStartModal, addressErrorModal, batchErrorModal, contentStandardModal, processing, batchModalOpen,
      selectedBatch, productModalOpen, accessToken, notSelected } = this.state
    let fragment = (<h2>None</h2>);
    let nextButton = null;

    let batchOrder = false;
    this.addView = (<StyledButton onClick={this.addBatch} style={{marginTop: 10}}>Add New Batch</StyledButton>)
    this.batchView = (
      batches.map((map, idx) => {
        let view = <SelectProductBatch
           fieldValues={this.fieldValues}
           accessToken={this.accessToken}
           truncateChar={this.truncateChar}
           data={batches[idx].products}
           batchIndex={idx}
           remove={this.removeProductFromBatch}
           isLoaded={true}
           removeBatch={this.removeBatch}
           removeFromBatch={this.removeFromBatch}
           toggleBatchModal={this.toggleBatchModal}
           toggleProductsModal={this.toggleProductsModal}
           >
        </SelectProductBatch>
        return (
          <MDBRow key={idx} style={{marginTop: 5, marginBottom: 5}}>
            <MDBCol md="12" >
              <StyledRow onClick={() => this.toggleCollapse("basicCollapse" + idx)}>
                <p>{map.title}</p>
                <div>
                  <StyledButton onClick={() => {this.toggleProductsModal(idx)}}>Add Products</StyledButton>
                  <StyledButton onClick={() => {this.toggleBatchModal(idx)}}>Select Services</StyledButton>
                  <StyledButton onClick={() => this.removeBatch(idx)} >Delete</StyledButton>
                </div>
              </StyledRow>
              <MDBCollapse id={"basicCollapse" + idx} isOpen={collapseID}>
                <div className="basic-collapse">
                  {view}
                </div>
              </MDBCollapse>
            </MDBCol>
          </MDBRow>
        )
      })
    )

    switch (step) {
      case 0:
        fragment = <AssetCreate
                    fieldValues={this.fieldValues}
                    toggleVideoModal={this.toggleVideoModal}
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    step={step}
                    accessToken={this.props.accessToken}
                    mode={this.mode}
                    contentStandard={this.props.contentStandard}
                    toggle={this.contentStandardToggle}
                    createStandardPost={this.props.createContentStandard}>

                  </AssetCreate>
        nextButton = <div className="parent"><StyledButton onClick={ this.nextStep } >Get Started</StyledButton></div>
        break;
      case 1:
       fragment = <ChooseOrderingMethod
                    fieldValues={this.fieldValues}
                    product_type={this.product_type}
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    setMode={this.setMode}
                    step={step}>
                  </ChooseOrderingMethod>
        nextButton = <StyledButton onClick={ this.nextStep }>Next</StyledButton>
        break;
      case 2:
        fragment = <BatchOrder
                fieldValues={this.fieldValues}
                nextStep={this.nextStep}
                previousStep={this.previousStep}
                step={step}
                toggleVideoModal={this.toggleOrderVideoModal}
                batchData= {batchData}
                accessToken={this.props.accessToken}
                truncateChar={this.truncateChar}
                singleMode={0}
                setBatchData={this.setBatchData}
                addView={this.addView}
                toggleProductsModal={this.toggleProductsModal}
                toggleBatchModal={this.toggleBatchModal}
                batchView={this.batchView}>
              </BatchOrder>
        nextButton = <StyledButton onClick={ this.nextStep }>Next</StyledButton>
        break;
      case 3:
        fragment = <ShippingDetails
                    fieldValues={this.fieldValues}
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    truncateChar={this.truncate}
                    addresses={this.props.addresses}
                    saveAddress={this.props.saveAddress}
                    saveAddressData={this.passAddressData}
                    toggleVideoModal={this.toggleVideoModal}
                    getAddress={this.props.getAddress}>
                  </ShippingDetails>
        nextButton = <StyledButton onClick={ this.nextStep }>Next</StyledButton>
        break;
      case 4:
        fragment = <ReviewAndConfirm
                    fieldValues={this.fieldValues}
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    truncateChar={this.truncate}
                    loadSelectedProduct={this.loadSelectedProduct}
                    saveOrders={this.props.saveOrders}>
                  </ReviewAndConfirm>
        nextButton = <StyledButton onClick={ this.nextStep }>Next</StyledButton>
        break;
      case 5:
        fragment = <SaveOrder
                    userInfo={this.props.userInfo}
                    accessToken={this.props.accessToken}
                    fieldValues={this.fieldValues}
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    saveOrders={this.props.saveOrders}
                    url={this.props.url}
                    incomingUrl={this.props.match.url}
                    >
                  </SaveOrder>
                  break
        case 6:
        fragment = <SelectProductSingle
                userInfo={this.props.userInfo}
                fieldValues={this.fieldValues}
                submitEditOrder={this.submitEditOrder}
                nextStep={this.nextStep}
                previousStep={this.previousStep}
                step={step}
                toggleVideoModal={this.toggleEditOrderVideoModal}
                batchData= {batchData}
                accessToken={this.props.accessToken}
                truncateChar={this.truncateChar}
                singleMode={0}
                createFileEditUpload={this.props.createFileEditUpload}
                editOrderPost={this.props.editOrderPost}
                setBatchData={this.setBatchData}
                addView={this.addView}
                toggleProductsModal={this.toggleProductsModal}
                toggleBatchModal={this.toggleBatchModal}
                batchView={this.batchView}>
              </SelectProductSingle>
        nextButton = <StyledButton onClick={ this.nextStep }>Next</StyledButton>
        break;
        case 7:
          fragment = <EditingSaveOrder
                    userInfo={this.props.userInfo}
               accessToken={this.props.accessToken}
                    fieldValues={this.fieldValues}
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    saveOrders={this.props.saveEditingOrders}
                    url={this.props.editurl.chargebeeURL}
                    incomingUrl={this.props.match.editurl.chargebeeURL}
                    >
                  </EditingSaveOrder>
        break;
        case 8:
          fragment = <CompleteOrder>
                  </CompleteOrder>
        break;
      default:
        fragment = (<h2>Lets go to the Dashboard!</h2>);
        break;
    }

    if (step === 3) {
      nextButton = <StyledButton type="submit" onClick={ this.nextStep }>Confirm & Add to Cart{step}</StyledButton>
    }

    if (step === 6) {
      nextButton = <StyledButton type="submit" onClick={ this.nextStep }>Confirm & Add to Cart{step}</StyledButton>
    }

    let buttonLES = <StyledButton>Load Existing Session</StyledButton>

    let VideoModal = (
      <MDBModal isOpen={this.state.videoModal} toggle={this.toggleVideoModal} size="fluid" centered>
        <MDBModalHeader toggle={this.toggleVideoModal}>How To Create A Content Standard</MDBModalHeader>
        <MDBModalBody>
        <MDBContainer>
          <div class="row">
            <div class="col-sm-12">
                  <iframe width="1080" height="600" src="https://storagev2.s3-us-west-2.amazonaws.com/Videos/Order+Wizard+Content+Standards.mp4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; allowfullscreen;" allowFullScreen></iframe>
            </div>
          </div>
        </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <StyledButton color="secondary" onClick={this.toggleVideoModal}><i className="fa fa-cancel pr-2" aria-hidden="true"></i>Close</StyledButton>
        </MDBModalFooter>
      </MDBModal>
    )

    let OrderVideoModal = (
      <MDBModal isOpen={this.state.orderVideoModal} toggle={this.toggleOrderVideoModal} size="fluid" centered>
        <MDBModalHeader toggle={this.toggleOrderVideoModal}>How To Order Product Visuals</MDBModalHeader>
        <MDBModalBody>
        <MDBContainer>
          <div class="row">
            <div class="col-sm-12">
                  <iframe width="1080" height="600" src="https://storagev2.s3-us-west-2.amazonaws.com/Videos/Order+Wizard.mp4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; allowfullscreen;" allowFullScreen></iframe>
            </div>
          </div>
        </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <StyledButton color="secondary" onClick={this.toggleOrderVideoModal}><i className="fa fa-cancel pr-2" aria-hidden="true"></i>Close</StyledButton>
        </MDBModalFooter>
      </MDBModal>
    )

    let EditingOrderVideoModal = (
      <MDBModal isOpen={this.state.editOrderVideoModal} toggle={this.toggleEditOrderVideoModal} size="fluid" centered>
        <MDBModalHeader toggle={this.toggleEditOrderVideoModal}>How To Order Editing Services</MDBModalHeader>
        <MDBModalBody>
        <MDBContainer>
          <div class="row">
            <div class="col-sm-12">
                  <iframe width="1080" height="600" src="https://storagev2.s3-us-west-2.amazonaws.com/Videos/Order+Wizard+Editing.mp4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; allowfullscreen;" allowFullScreen></iframe>
            </div>
          </div>
        </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <StyledButton color="secondary" onClick={this.toggleEditOrderVideoModal}><i className="fa fa-cancel pr-2" aria-hidden="true"></i>Close</StyledButton>
        </MDBModalFooter>
      </MDBModal>
    )

    let OrderStartModal = (
      <StyledModal isOpen={orderStartModal} toggle={this.toggleOrderStartModal} centered>
        <MDBModalHeader><b>Welcome To XSPACE Ordering</b><button onClick={this.toggleOrderStartModal}>Close</button></MDBModalHeader>
        <MDBModalBody>
          <MDBContainer>
            <h4> Order stunning 2D Photos, 360 View Models, Video and & 3D Models for your business with XSPACE</h4>
            <div class="row">
              <div className='card-item'>
                <img src={singleShot} alt='' />
                <p>Single Shot</p>
                <h6>$10 / Product</h6>
              </div>
              <div className='card-item'>
                <img src={fourShots} alt='' />
                <p>Four Pack Shots</p>
                <h6>$25 / Product</h6>
              </div>
              <div className='card-item'>
                <img src={fiveShots} alt='' />
                <p>Five Pack Shots</p>
                <h6>$30 / Product</h6>
              </div>
              <div className='card-item'>
                <img src={viewModels} alt='' />
                <p>360 View Models</p>
                <h6>$75 / Product</h6>
              </div>
            </div>
            <div class="row">
              <div className='card-item'>
                <img src={multiAxis} alt='' />
                <p>Multi-Axis 360</p>
                <h6>$375 / Product</h6>
              </div>
              <div className='card-item'>
                <img src={multiAxis} alt='' />
                <p>5 Pack/ 360 Combo</p>
                <h6>$100 / Product</h6>
              </div>
              <div className='card-item'>
                <img src={AV} alt='' />
                <p>3D AR/VR Models</p>
                <h6>Starting @ $300</h6>
              </div>
              <div className='card-item'>
                <img src={videoPlayer} alt='' />
                <p>Product Videos</p>
                <h6>$250 / Video</h6>
              </div>
            </div>
            <center>
              <a href="https://xspaceapp.com/photo-gallery" target="_blank">Examples</a>
              <StyledButton onClick={this.toggleOrderStartModal}>Let's Order</StyledButton>
            </center>
          </MDBContainer>
        </MDBModalBody>
      </StyledModal>
    )

    // let AddressErrorModal = (
    //   // <MDBModal isOpen={addressErrorModal} toggle={this.toggleAddressErrorModal} size="sm" centered>
    //   //   <MDBModalHeader toggle={this.toggleAddressErrorModal}>Whoops!</MDBModalHeader>
    //   //   <MDBModalBody>
    //   //   <MDBContainer>
    //   //     <center><i className="fa fa-close fa-3x" aria-hidden="true"></i>
    //   //     <p>Uh oh, looks like no address information was entered. We will need your address to complete your order.</p>
    //   //     </center>
    //   //   </MDBContainer>
    //   //   </MDBModalBody>
    //   //   <MDBModalFooter>
    //   //     <StyledButton color="secondary" onClick={this.toggleAddressErrorModal}><i className="fa fa-cancel pr-2" aria-hidden="true"></i>OK</StyledButton>
    //   //   </MDBModalFooter>
    //   // </MDBModal>

    // )

    // let BatchErrorModal = (
    //   <MDBModal isOpen={batchErrorModal} toggle={this.toggleBatchErrorModal} size="sm" centered>
    //     <MDBModalHeader toggle={this.toggleBatchErrorModal}>Whoops!</MDBModalHeader>
    //     <MDBModalBody>
    //     <MDBContainer>
    //       <center><i className="fa fa-close fa-3x" aria-hidden="true"></i>
    //       <p>Uh oh, looks like no products were added to your batch. We will need your XSPACE products to complete your order.</p>
    //       </center>
    //     </MDBContainer>
    //     </MDBModalBody>
    //     <MDBModalFooter>
    //       <StyledButton color="secondary" onClick={this.toggleBatchErrorModal}><i className="fa fa-cancel pr-2" aria-hidden="true"></i>OK</StyledButton>
    //     </MDBModalFooter>
    //   </MDBModal>
    // )

    let ContentStandardModal = (
        <StyledContentStandardModal className="content-standard-modal" isOpen={contentStandardModal} toggle={this.contentStandardToggle} centered>
          <MDBModalHeader><b>Create A Content Standard</b><button onClick={this.contentStandardToggle}>Close</button></MDBModalHeader>
          <MDBModalBody>
            <ContentStandard
              fieldValues={this.fieldValues}
              processing={processing}
              reset={this.reset}
              finish={this.finish}
              cancel={this.contentStandardToggle}
              submit={this.submit}
              standardSubmit={this.props.createContentStandard}
              minimal={true}
              userInfo={this.props.userInfo}
              accessToken={this.props.accessToken}/>
          </MDBModalBody>
        </StyledContentStandardModal>
    )

    let batchModal = (
      <MDBModal isOpen={batchModalOpen} toggle={this.batchModalOpen} size="fluid" centered >
        <MDBModalBody>
          <BatchModal
            cancelModal={()=>{this.toggleBatchModal(selectedBatch)}}
            saveBatchInfo={(info)=>{this.updateBatch(selectedBatch, info)}}
            batchInfo={batches[selectedBatch]}>
          </BatchModal>
        </MDBModalBody>
      </MDBModal>
    )


    let selectProductModal = (
      <StyledProductModal isOpen={productModalOpen} toggle={this.productModalOpen} size="fluid" centered>
        <MDBModalHeader>Select Products <button onClick={this.toggleProductsModal}>Close</button></MDBModalHeader>
        <MDBModalBody style={{margin: 0}}>
          <SelectProductModal
            fieldValues={this.fieldValues}
            accessToken={accessToken}
            truncateChar={this.truncateChar}
            toggleModal={this.toggleProductsModal}
            returnProducts={this.updateBatchProducts}
            isLoaded={false}>
          </SelectProductModal>
        </MDBModalBody>
      </StyledProductModal>
    )

    return (
      <div className="top-content">
        <div className="inner-bg">
          <ToastContainer
            hideProgressBar={true}
            autoClose={5000}
            closeOnClick={true}
            position='top-center'
          />
          {/* {AddressErrorModal} */}
          {/* {BatchErrorModal} */}
          {VideoModal}
          {OrderVideoModal}
          {EditingOrderVideoModal}
          {ContentStandardModal}
          {OrderStartModal}
          {batchModal}
          {selectProductModal}
          <div className="container">
            <StyledContainer>
              {/*<div className="flex-container-row">*/}
              {/*  <Step isStep={step === 0} isPassed={step > 0}>*/}
              {/*    <span>1</span>*/}
              {/*    <p>Specify / Create Content Standards</p>*/}
              {/*  </Step>*/}
              {/*  <Step isStep={step === 1 || step === 2} isPassed={step > 2}>*/}
              {/*    <span>2</span>*/}
              {/*    <p>Create Batches and Select Products</p>*/}
              {/*  </Step>*/}
              {/*  <Step isStep={step === 3} isPassed={step > 3}>*/}
              {/*    <span>3</span>*/}
              {/*    <p>Shipping Details To Order</p>*/}
              {/*  </Step>*/}
              {/*  <Step isStep={step === 4} isPassed={step > 4}>*/}
              {/*    <span>4</span>*/}
              {/*    <p>Checkout</p>*/}
              {/*  </Step>*/}
              {/*</div>*/}
              <Fragment>{fragment}</Fragment>
              <div className="bottom-row">
                {step !== 5 && step !== 4 && step !== 0 ? <StyledButton onClick={ this.previousStep }>Back</StyledButton> : ''}
                {step === 5 ? <MDBBtn gradient="aqua" onClick={this.reloadPage}>Order Again</MDBBtn> : ''}
                {nextButton}
              </div>
              {/* <div className="row">
                {notSelected && step === 0 ? <p className="alert-wizard-text" style={{color:"#EB5757"}}>Please Select One Option</p>: ''}
              </div> */}
            </StyledContainer>
          </div>
        </div>
      </div>
    )
  }
}
