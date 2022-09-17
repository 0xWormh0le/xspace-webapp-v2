import React, { Component } from 'react';
import styled from 'styled-components'
import {Button, Modal, ModalBody, ModalHeader, ModalFooter, MDBFormInline, Input, MDBCol, MDBRow} from 'mdbreact';
import OrderCreateEdit from './ordercreate/OrderCreateEdit';
import OrderCreateEditReview from "./ordercreate/OrderCreateEditReview";
import ProductCreateEdit from './productcreate/ProductCreateEdit';
import ProductDone from './productcreate/ProductDone';
import ProductMethod from './productcreate/ProductMethod';
import ProductReview from './productcreate/ProductReview';
import ProductExcelFileUploader from './productcreate/ProductExcelFileUploader';
import ProductExcelReview from "./productcreate/ProductExcelReview";
import ProductAPIEntry from './productcreate/ProductAPIEntry';
import UpgradeView from './UpgradeView';
import axios from 'axios';
import { Wrapper } from '../lib/wrapper'
import { StyledButton, StyledButton2 } from '../lib/button'
import { API_ROOT } from '../index';

const uuidv4 = require('uuid/v4');

const MODE_CREATE_PRODUCT = 0
const MODE_IMPORT_EXCEL = 1
const MODE_IMPORT_3RD = 2

const STEP_1_CREATE_PRODUCT_LANDING = 0
const STEP_2_CREATE_PRODUCT_INPUT = 1
const STEP_3_CREATE_PRODUCT_CONFIRM = 2
const STEP_4_CREATE_PRODUCT_FINISH = 3

const STEP_2_IMPORT_EXCEL_INPUT = 1
const STEP_3_IMPORT_EXCEL_CONFIRM = 2

const STEP_2_IMPORT_3RD_EDIT = 1
const STEP_3_IMPORT_3RD_REVIEW = 2

export const Container = styled(Wrapper)`
  max-height: none;
  min-height: 600px;
  padding: 0;
  box-shadow: none;
  border-radius: 20px;
  .flex-container-row {
    display: flex;
    justify-content: flex-end;
    // justify-content: space-between;
    align-items: center;
    padding: 2rem 25px 0px;
    background-color: #3eb2ff;
    border-bottom: 2px solid #F4F5FA;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    // min-height: 150px;
    
    // div {
    //   display: flex;
    //   flex-wrap: nowrap;
    // }     
    
    p {
      margin-right: auto;
      font-size: 46px;
      color: white;
    }
  }
  // div.parent {
  //   button {
  //     width: 210px;
  //     height: 58px;
  //     border-radius: 29px;
  //     background-color: #00A3FF;
  //     color: #ffffff;
  //     font-size: 18px;
  //     line-height: 26px;
  //     font-weight: bold;
  //     border: none;
  //   }
  }
  div.bottom-wrapper {
    display: flex;
    justify-content: space-between;
    padding-top: 30px;
    padding-bottom: 30px;
    padding-left: 45px;
    padding-right: 95px;
  }
  .arrow_right2 {
    overflow: visible;
    position: relative;
    width: 51px;
    height: 69px;
    // left: 10px;
    // top: 0px;
    bottom: 29px;
    transform: matrix(1,0,0,1,0,0);
  }
  
  h4 {
    font-size: 24px;
    // color: #333333;
    color: #787878;
    line-height: 20px;
    font-weight: normal;
    margin-bottom: 1rem;
  }
  
  .selectdiv {
    padding-left: 45px;
    padding-right: 45px;
    padding-top:  45px;
    
    h4 {
      margin-bottom: 8px;
    }
  }
  
  #temp1 {
    font-size: 18px;
    color: #787878;
  }
  #temp2 {
    font-size: 18px;
    color: #787878;
  }
  
  // label {
  //   font-size: 18px;
  //   // color: #333330;
  //   color: #787878;
  //   line-height: 20px;
  //   margin: 1px;
  //   margin-bottom: 3px;
  // }
  
  .chevron_right {
    overflow: visible;
    position: relative;
    width: 19.745px;
    height: 33.683px;
    // left: 160.55px;
    left: 40px;
    // top: 14px;
    transform: matrix(1,0,0,1,0,0);
  }
  .chevron_left {
    overflow: visible;
    position: relative;
    width: 19.745px;
    height: 33.683px;
    // left: 160.55px;
    right: 30px;
    // top: 14px;
    transform: matrix(1,0,0,1,0,0) rotate(180deg);
  }
  
  .selectionFiller {
    height: 150px;
  }
`

export const Fragment = styled.div`
  padding: 30px 30px 0;
`

export const Step = styled.div`
  &&& {
    max-width: 200px;
    text-align: center;
    margin: 0;
    span {
      width: 60px;
      height: 60px;
      // background-color: ${props => props.isStep ? '#00f642' : props.isPassed ? '#7DE5A7' : '#F4F5FA'};
      background-color: ${props => props.isStep ? '#00f642' : '#F4F5FA'};
      // color: ${props => props.isStep || props.isPassed ? '#ffffff' : '#333333'};
      color: ${props => props.isStep ? '#ffffff' : '#9b9b9b'};
      font-size: 27px;
      line-height: 61px;
      text-align: center;
      font-weight: normal;
      border-radius: 50%;
      margin: 8px 42px;
      display: block;
    }
    p {
      font-weight: normal;
      font-size: 16px;
      // color: #333330;
      color: #ffffff;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      opacity: ${props => props.isStep || props.isPassed ? 1 : .5};
    }
  }
`

export default class OrderEditSelectedView extends Component {
    state = {
        step: 0,
        // Bypass originalcreate landing page by simulating clicking of single product create and "get started" button.
        modeOption: 0,
        processing: false,
        submitting: false,
        evaluated: true,
        modal: false,
        atSubLimit: false,
        productUpload:null,
        checkbox: 1,
    }

    fieldValues = {
        name     : null,
        email    : null,
        password : null,
        age      : null,
        colors   : [],
    }

    constructor(props) {
        super(props)
        this.state = {
            step: 0,
            // Bypass originalcreate landing page by simulating clicking of single product create and "get started" button.
            modeOption: 0,
            processing: false,
            submitting: false,
            evaluated: true,
            modal: false,
            atSubLimit: false,
            productUpload:this.props.productUpload,
            productUploadMulti:this.props.productUpload,
            checkbox: 1,
            uploadedFile: null,
            excelProductList: null,
            excelProductListResult: null,
            excelProductListErrors: null,
            excelProductListFaults: null,
            excelApprovedProductList: null,
            productsSelected: [],
            selectedEdit: 0,
            selectedContentStandard: { name: 'No Content Standard', uniqueID: 'No Content Standard'},
            productsForCart: [],
            waitingForURL: false,
            noAddContentStandard: true,
        }
        this.changeMode = this.changeMode.bind(this);
        this.finish = this.finish.bind(this);
        this.reset = this.reset.bind(this);
        this.resetStage = this.resetStage.bind(this);
        this.toggleDialog = this.toggleDialog.bind(this);
        this.evaluateProducts = this.evaluateProducts.bind(this);
        this.evaluateAccess = this.evaluateAccess.bind(this);
        this.handleFileSubmit = this.handleFileSubmit.bind(this);
        this.handleExcelApprovedList = this.handleExcelApprovedList.bind(this);
        this.parseSelected = this.parseSelected.bind(this);
        this.setSelectedEdit = this.setSelectedEdit.bind(this);
        this.gotoCart = this.gotoCart.bind(this);
        this.updateSelectedStandard = this.updateSelectedStandard.bind(this);
        this.updateProductsCart = this.updateProductsCart.bind(this);
        this.gotoChargebee = this.gotoChargebee.bind(this);
        this.evaluateProducts = this.evaluateProducts.bind(this)


        this.user_id = this.props.userId;
    }

    componentDidMount() {
        this.setState({"productUpload":this.props.productUpload});
        this.setState({"productUploadMulti":this.props.productUploadMulti});
        this.evaluateAccess();
        this.parseSelected(this.props.productList);
        this.props.getContentStandard();
    }

    componentWillMount() {
        document.title = 'XSPACE | Order Edit'
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.productUpload)
            this.setState({"productUpload":nextProps.productUpload})
        else if (nextProps.importedProducts)
            this.setState({'shopifyProducts':nextProps.importedProducts})
        else if (nextProps.excelProducts)
            this.setState({'excelProducts':nextProps.excelProducts})
        else if (nextProps.createdProduct)
            this.setState({'createdProduct':nextProps.createdProduct})
    }

    updateProductsCart( newproducts){
        this.setState( {productsForCart: newproducts}, ()=> console.log("UPDATECARt", this.state.productsForCart));
    }

    updateSelectedStandard( evt, id) {

        const name = evt.target.selectedOptions[0].id;
        const uniqueID = evt.target.value;
        this.setState( {selectedContentStandard: {name:name, uniqueID:uniqueID}}, ()=>console.log(this.state.selectedContentStandard));
        this.setState( { noAddContentStandard: (uniqueID === 'null') ? true: false}, ()=> console.log(this.state.noAddContentStandard));
    }

    handleFileSubmit(dataTransfer) {
        let target = dataTransfer
        this.setState({uploadedFile: target})
        console.log('target', target)
    }

    handleExcelApprovedList (approvedList) {
        let target = approvedList
        this.setState({excelApprovedProductList: target})
    }

    toggleDialog() {
        this.setState({
            modal: !this.state.modal
        });
    }

    parseSelected( plist) {
        const pselect = plist.filter( product => product.ischecked.props.checked);
        console.log('parseSelected', pselect);
        this.setState( {"productsSelected": pselect})
    }

    setSelectedEdit(num) {
        console.log('buttoneditParent', num, this.state.selectedEdit);
        this.setState( {selectedEdit: num})
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

    handleExcelProductList (res) {
        // handles the dictionary that is returned from uploading an excel file, is triggered upon response from
        // the server
        if (res !== null) {
            this.state.excelProductList = res
            this.setState({'excelProductListResult': this.state.excelProductList.payload['productInformationList']})
            this.setState({'excelProductListErrors': this.state.excelProductList.payload['errorList']})
            this.setState({'excelProductListFaults': this.state.excelProductList.payload['faultyProductList']})

            /* add this action to the onboard checklist */
            fetch(API_ROOT + '/api/onboard/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + this.props.accessToken
                },
                body: JSON.stringify({
                    'user': this.props.userInfo.userid,
                    'create_product_excel': true
                })
            }).then(res => res.json())
                .catch(error => console.error('Error:', error))
            console.log('uploaded')
            this.setState({step: STEP_3_IMPORT_EXCEL_CONFIRM});
            /* double check the step update was applied */
            if (this.state.step !== 2) {
                this.setState({step: 2})
            }
            console.log('STEP_3_IMPORT_EXCEL_CONFIRM')
        }
    }

    evaluateProducts = (check) => {
        this.setState({"evaluated": check})
    }

    evaluateAccess(){
        if(this.state.atSubLimit === true){
            this.toggleDialog();
        }
        else{
            this.nextStep();
        }
    }

    nextStep = () => {

        let {step, modeOption} = this.state;
        console.log('Nextstep', step, modeOption);

        if (modeOption === MODE_CREATE_PRODUCT) {
            console.log('MODE_CREATE_PRODUCT')
            if (step !== 2) {
                this.setState({
                    step : step + 1
                });
            } else {
                //if this is the review screen, perform create and don't go to next screen right away
                console.log('inside step not !==2');
                this.setState({
                    processing: true
                });
                fetch(API_ROOT + '/api/onboard/', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + this.props.accessToken,
                    },
                    body: JSON.stringify({
                        'user': this.props.userInfo.userid,
                        'create_product_man':true
                    })
                }).then(res => res.json())
                    .catch(error => console.error('Error:', error));
            }

        } else if (modeOption === MODE_IMPORT_EXCEL || modeOption === MODE_IMPORT_3RD) {
            if (step === 1) {
                //Excel upload logic, the following is only triggered when an excel sheet is passed into the drag and drop
                // for context: file is not uploaded until user clicks 'Review' at which point it is uploaded and parsed with a
                // dictionary sent back for the user to review
                if (this.state.uploadedFile !== null) {
                    this.setState({
                        submitting: true
                    })
                    // Upload the file when the user clicks review and save the result //
                    this.props.productUpload(this.state.uploadedFile).then(res => this.handleExcelProductList(res))}
            }
            else if (step === 2) {
                // submit approved list back to the backend to deal with, upon response, finish up
                if (this.state.excelApprovedProductList !== null) {
                    this.props.productUploadMulti(this.state.excelApprovedProductList).then(this.finish)
                }
            }
        }
        else {
            this.setState({
                step: step + 1
            })
        }
    }

    finish = () => {
        this.setState({
            processing: false,
            step: STEP_4_CREATE_PRODUCT_FINISH
        })
    }

    reset = () => {
        this.setState({
            step: 1
        })
    }

    resetStage = () => {
        this.setState({
            step: 2,
            submitting: false
        })
    }

    // Same as nextStep, but decrementing
    previousStep = () => {
        let {step, modeOption} = this.state;
        if (step < 1)
            return
        if (modeOption === MODE_CREATE_PRODUCT && step >= 0) {
            this.setState({
                step : step - 1
            })
        } else if (step === 2 && (modeOption === MODE_IMPORT_EXCEL || modeOption === MODE_IMPORT_3RD)) {
            this.setState({
                step : 0
            })
        } else {
            this.setState({
                step: step - 1
            })
        }
    }

    changeMode = (modeOption) => {
        console.log('CHANGEMODE', modeOption);
        this.setState({ modeOption });
    }

    onSubmit = (event) => {
        event.preventDefault()
        this.props.onSubmit(this.state.username, this.state.password)
    }

    onClick = nc => () => {
        console.log('checkercheckchek', nc)
        this.setState({
            checkbox: nc
        });
        if (nc === 1) {
            this.setState( {
                modeOption: MODE_CREATE_PRODUCT
            });
        } else {
            this.setState( {
                modeOption: MODE_IMPORT_EXCEL
            });
        }
    };


    gotoCart = () => {
        console.log('gotoCart', this.state.editurl);
        if (!this.state.productsForCart.length) { return };
        // const payload =
        // this.editingFieldValues.fileCount = this.editingFieldValues.imageList.length;
        // const filecount = this.state.productsForCart.length;
        const listofslugs = this.state.productsForCart.map( entry => entry.xspaceid);

        var selectedEdit

        switch (this.state.selectedEdit) {
            case 1:  selectedEdit = 'backgroundRemoval';
                break;
            case 2:  selectedEdit =  'autoCropAndCenter';
                break;
            case 3:  selectedEdit =  'colorCorrection';
                break;
        }
        console.log("CASESSSSSSSSSSSSSS", selectedEdit);

        const self = this
        const contStand = this.state.noAddContentStandard ? '' : this.state.selectedContentStandard.uniqueID
        // fetch(API_ROOT + '/api/get_product_2D/', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ 'listofslugs': ['3242f23ff']},)
        //     }).then(res => res.json())
        //     .catch(error => console.error('Error:', error))
        //     .then(function () {
        //         // always executed
        //     });

        // TODO:  Will this axios call work on Production?
        // TODO:  Our userid's  are sequential numbers,  are we secure against domain attacks?

        axios.post( API_ROOT +'/api/get_product_2D/', {

        userid: JSON.stringify(this.user_id),
        listofslugs: listofslugs,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'authorization': 'Bearer '+self.props.accessToken,
        }

        }).then(function (response) {
            // handle success
            //response.data.product_order.product_order.length > 0
            console.log("VIEWDETAILS", response.data.urls);
            console.log("VIEWDETAILS2", Object.values(response.data.urls));
            const temp = Object.values(response.data.urls).map( arrs => arrs.map( files => [files.filename, files.assetID, files.name])).flat();
            console.log("VIEWDETAILS3", temp);
            // const fileList = temp.map( entry => entry[0]);
            const fileList = temp.map( entry => [entry[0], entry[2]]);
            // product_slug, capture type name, do apply for backend, order type name, contentStandard
            const assetIDList = temp.map( entry => [entry[1], selectedEdit, true, 'edit', contStand]);
            console.log("VIEWDETAILS3", fileList);
            console.log("VIEWDETAILS3", assetIDList);

            // var neworderID =
            const neworderID = uuidv4();

            const payload = {
                'orderid': neworderID,
                'orderparts': assetIDList,
                'fileList': fileList
            };

            console.log("GOTOCART", payload, self.state.productsForCart);


            self.props.submitEditOrder(payload);

            // this.setState({ waitingForURL: true});

            // console.log('gotoCart', this.props.editurl);
            // localStorage.setItem( "orders", payload);
            self.props.cancel();
            // console.log("LOCALSOTRAGE", localStorage.getItem("orders"));
            self.props.history.push('/shoppingcart');



            // thisScope.setState({'productList': response.data.product_order.product_order, 'isProductLoaded': true})
        }).catch(function (error) {
            // handle error
            console.log('error submitting editing order', error);
        });
    }

    gotoChargebee() {
        console.log('GOTOCHARBEE', this.props.editurl);
        this.props.cancel();
        // console.log("LOCALSOTRAGE", localStorage.getItem("orders"));
        this.props.history.push('/shoppingcart');
    }

    render() {
        const errors = this.props.errors || {}
        console.log('CONTENTSTANDARD', this.props.contentStandard);
        let fragment = (<h2>None</h2>);
        let nextButton = null;
        let backButton = null;
        let selectionDiv = (<div className="selectionFiller"/>);
        let message = ("Uh oh, your subscription plan limit for products has been reached.");
        const { step, modeOption, processing, modal, submitting, evaluated, waitingForURL } = this.state

        console.log('hello', this.state.waitingForUrl);
        if (waitingForURL) {
            console.log('hello');
            this.gotoChargebee();
        }
        let upgrade = (
            <Modal className="form-dark" contentClassName="card card-image" isopen={modal} toggle={this.toggleDialog} size="lg" centered>
                <ModalHeader className="white-text" toggle={this.toggleDialog}>Upgrade Your Subscription Plan </ModalHeader>
                <ModalBody >
                    <UpgradeView
                        fieldValues={this.fieldValues}
                        processing={processing}
                        submit={this.submit}>
                        message={message}
                    </UpgradeView>
                </ModalBody>
            </Modal>
        );

        let chevron = <svg className="chevron_right" viewBox="11.52 6.718 19.745 33.683">
            <path fill="rgba(255,255,255,1)" id="chevron_right"
                  d="M 17.22008514404297 7.640035152435303 C 18.43419647216797 8.825107574462891 30.29219245910645 21.27291870117188 30.29219245910645 21.27291870117188 C 30.9400806427002 21.90810394287109 31.26493263244629 22.73565673828125 31.26493263244629 23.56321334838867 C 31.26493263244629 24.39076995849609 30.94007682800293 25.21832466125488 30.29219245910645 25.84806632995605 C 30.29219245910645 25.84806632995605 18.43419647216797 38.30131912231445 17.22008514404297 39.48094940185547 C 16.0059757232666 40.66601943969727 13.82275390625 40.74768829345703 12.53060531616211 39.48094940185547 C 11.23482894897461 38.22146606445313 11.13319778442383 36.45746612548828 12.53060531616211 34.91124725341797 L 23.41041374206543 23.56321334838867 L 12.53060340881348 12.21517944335938 C 11.13319778442383 10.66714477539063 11.23482704162598 8.901329040527344 12.53060340881348 7.638219356536865 C 13.82275199890137 6.37147855758667 16.00597190856934 6.451330661773682 17.22008514404297 7.638219356536865 Z">
            </path>
        </svg>

        let chevron_left =  <svg className="chevron_left" viewBox="11.52 6.718 19.745 33.683">
            <path fill="rgba(255,255,255,1)" id="chevron_left"
                  d="M 17.22008514404297 7.640035152435303 C 18.43419647216797 8.825107574462891 30.29219245910645 21.27291870117188 30.29219245910645 21.27291870117188 C 30.9400806427002 21.90810394287109 31.26493263244629 22.73565673828125 31.26493263244629 23.56321334838867 C 31.26493263244629 24.39076995849609 30.94007682800293 25.21832466125488 30.29219245910645 25.84806632995605 C 30.29219245910645 25.84806632995605 18.43419647216797 38.30131912231445 17.22008514404297 39.48094940185547 C 16.0059757232666 40.66601943969727 13.82275390625 40.74768829345703 12.53060531616211 39.48094940185547 C 11.23482894897461 38.22146606445313 11.13319778442383 36.45746612548828 12.53060531616211 34.91124725341797 L 23.41041374206543 23.56321334838867 L 12.53060340881348 12.21517944335938 C 11.13319778442383 10.66714477539063 11.23482704162598 8.901329040527344 12.53060340881348 7.638219356536865 C 13.82275199890137 6.37147855758667 16.00597190856934 6.451330661773682 17.22008514404297 7.638219356536865 Z">
            </path>
        </svg>

        switch (step) {
            case STEP_1_CREATE_PRODUCT_LANDING:
                fragment = <ProductMethod
                    fieldValues={this.fieldValues}
                    nextStep={this.nextStep}
                    changeMode={this.changeMode}
                    evaluateAccess={this.evaluateAccess}
                    modeOption={modeOption} />

                break;
            case 2:
                fragment = <OrderCreateEditReview
                                productsSelected={this.state.productsSelected}
                                selectedEditapply={this.state.selectedEdit}
                                selectedContentStandard={this.state.selectedContentStandard}
                                updateProductsForCart={this.updateProductsCart}
                                noAddContentStandard={this.state.noAddContentStandard}/>
                break;
            case 1:
                if (modeOption === MODE_CREATE_PRODUCT) {
                    // if (step === )
                    fragment = <OrderCreateEdit
                        fieldValues={this.fieldValues}
                        nextStep={this.nextStep}
                        previousStep={this.previousStep}
                        step={step}
                        onSubmit={this.props.productCreate}
                        processing={processing}
                        reset={this.reset}
                        finish={this.finish}
                        contentStandard={this.props.contentStandard}
                        updateSelectedStandard={this.updateSelectedStandard}
                        categories={this.props.retrieveProducts}
                        product={this.props.createdProduct}
                        setSelectedEdit={this.setSelectedEdit}
                    >
                    </OrderCreateEdit>
                }
                if (modeOption === MODE_IMPORT_EXCEL && step === 1) {
                    fragment = <ProductExcelFileUploader
                        fieldValues={this.fieldValues}
                        handleFileSubmit={this.handleFileSubmit} />
                } else if (modeOption === MODE_IMPORT_EXCEL && step === 2) {
                    fragment = <ProductExcelReview
                        gooddata={this.state.excelProductListResult}
                        baddata={this.state.excelProductListFaults}
                        handleExcelApprovedList={this.handleExcelApprovedList} />
                }
                if (modeOption === MODE_IMPORT_3RD) {
                    fragment = <ProductAPIEntry
                        fieldValues={this.fieldValues}
                        nextStep={this.nextStep}
                        previousStep={this.previousStep}
                        step={step}
                        submitting={submitting}
                        accessToken={this.props.accessToken}
                        importShopify={this.props.importShopify}
                        importMagento={this.props.importMagento}
                        importWoocommerce={this.props.importWoocommerce}
                        finish={this.finish}
                        submit={this.props.productUploadMulti}
                        categories={this.props.retrieveProducts}
                        products={this.props.importedProducts}
                        evaluateProducts={this.evaluateProducts}
                        evaluated={evaluated} >
                    </ProductAPIEntry>
                }
                break;
            case 3:
                fragment = <ProductDone
                    fieldValues={this.fieldValues}
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    reset={this.reset}>
                </ProductDone>
                break;
            default:
                fragment = (<h2>Lets go to the Dashboard!</h2>);
                break;
        }
        // if (step !== 0) {
        if (step > 1) {
            backButton = <StyledButton2 successColor={false} onClick={this.previousStep}>{chevron_left}Previous</StyledButton2>
        }
        if (step < 2 && step !== 2) {
            selectionDiv = (<div className="selectdiv">
                <h4>Select Editing Service:</h4>
                {/*<MDBFormInline>*/}
                {/*    <div className="col">*/}
                {/*        <Input type="checkbox"*/}
                {/*               label="Create Single Product"*/}
                {/*               id="temp1"*/}
                {/*               onClick={this.onClick(1)}*/}
                {/*               checked={this.state.checkbox === 1 ? true : false}*/}
                {/*               className="chooseCheck"*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    <div className="col">*/}
                {/*        <Input type="checkbox"*/}
                {/*               label="Import Products Via Excel (.xlsx, .csv)"*/}
                {/*               id="temp2"*/}
                {/*               onClick={this.onClick(2)}*/}
                {/*               checked={this.state.checkbox === 2 ? true : false}*/}
                {/*               className="chooseCheck"*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</MDBFormInline>*/}
                {/*<h4>Product Info:</h4>*/}
            </div>)
        } else {
            selectionDiv = null
        }

        if (modeOption === MODE_CREATE_PRODUCT) {
            if (step === STEP_2_CREATE_PRODUCT_INPUT) {
                nextButton = <StyledButton2 successColor={false} onClick={this.nextStep} disabled={this.state.selectedEdit === 0 && this.state.noAddContentStandard}>Review{chevron}</StyledButton2>
            } else if (step === STEP_3_CREATE_PRODUCT_CONFIRM) {
                // nextButton = <StyledButton2 successColor={true} style={{width:'320px'}} onClick={this.nextStep}>Add to Checkout{chevron}</StyledButton2>
                nextButton = <StyledButton2 successColor={true} style={{width:'320px'}} onClick={this.gotoCart}>Add to Checkout{chevron}</StyledButton2>
            }
        }

        if (modeOption === MODE_IMPORT_3RD &&
            step === STEP_2_IMPORT_3RD_EDIT) {
            nextButton = <StyledButton onClick={ this.nextStep }>Next</StyledButton>
        }

        if (modeOption === MODE_IMPORT_EXCEL &&
            step === STEP_2_IMPORT_EXCEL_INPUT) {
            nextButton = <StyledButton2 onClick={ this.nextStep }>Review{chevron}</StyledButton2>
            // nextButton = <div></div>
        }

        if (modeOption === MODE_IMPORT_EXCEL &&
            step === STEP_3_IMPORT_EXCEL_CONFIRM) {
            // nextButton = <StyledButton onClick={ this.nextStep }>Confirm</StyledButton>
            nextButton = <StyledButton2 successColor={true} onClick={this.nextStep}>Import Product</StyledButton2>
        }

        console.log('stepandmode', step, modeOption, backButton, nextButton)
        // let buttonLES = <Button color="info">Load Existing Session</Button>
        return (
            // <div className="inner-bg">
            // <MDBCol md="12">
            //   <div className="container">
            <div className="animated">
                <Container>
                    {upgrade}
                    <div className="flex-container-row">
                        {/*{upgrade}*/}
                        <p>Order Editing</p>
                        <Step isStep={step === 1} isPassed={step > 1}>
                            <span>1</span>
                            {/*<p>Select Method</p>*/}
                            <p>Select Service</p>
                        </Step>
                        <Step isStep={step === 1} isPassed={step > 1} style={{display: "none"}}>
                            <span>2</span>
                            <p>Create/ Edit</p>
                        </Step>
                        <svg className="arrow_right2" viewBox="2 4 51 43.714">
                            <path fill="rgba(255,255,255,1)" id="arrow_right2"
                                  d="M 33.7186393737793 46.64710235595703 L 51.93308639526367 28.43265342712402 C 53.35563659667969 27.01010513305664 53.35563659667969 24.70415687561035 51.93308639526367 23.28160858154297 L 33.7186393737793 5.067160606384277 C 32.29609298706055 3.644611835479736 29.99014472961426 3.644611835479736 28.56759262084961 5.067160606384277 C 27.14504051208496 6.48970890045166 27.14504432678223 8.795658111572266 28.56759262084961 10.21820640563965 L 40.56362915039063 22.21424293518066 L 5.642887592315674 22.21424293518066 C 3.630190849304199 22.21424293518066 1.999997973442078 23.84443664550781 1.999997973442078 25.85713195800781 C 1.999997973442078 27.86982727050781 3.630190849304199 29.50002288818359 5.642887592315674 29.50002288818359 L 40.56362915039063 29.50002288818359 L 28.56759262084961 41.49605560302734 C 27.85723114013672 42.2064208984375 27.50022506713867 43.13899993896484 27.50022506713867 44.07157897949219 C 27.50022506713867 45.00415802001953 27.85540580749512 45.93674087524414 28.56759262084961 46.64710235595703 C 29.99014091491699 48.06964874267578 32.29609298706055 48.06964874267578 33.71863555908203 46.64710235595703 Z">
                            </path>
                        </svg>
                        <Step isStep={step >= 2} isPassed={step > 4}>
                            <span>2</span>
                            <p>Review</p>
                        </Step>
                        <Step isStep={step === 3} isPassed={step > 3} style={{display: "none"}}>
                            <span>4</span>
                            <p>Finish</p>
                        </Step>
                    </div>
                    {/*{selectionDiv}*/}
                    {/*<div className="selectdiv">*/}
                    {/*  <h4>Select Import Method:</h4>*/}
                    {/*  <MDBFormInline>*/}
                    {/*    <div className="col">*/}
                    {/*      <Input type="checkbox"*/}
                    {/*             label="Create Single Product"*/}
                    {/*             id="temp1"*/}
                    {/*             onClick={this.onClick(1)}*/}
                    {/*             checked={this.state.checkbox === 1 ? true: false}*/}
                    {/*             className="chooseCheck"*/}
                    {/*      />*/}
                    {/*    </div>*/}
                    {/*    <div className="col">*/}
                    {/*      <Input type="checkbox"*/}
                    {/*             label="Import Products Via Excel (.xlsx, .csv)"*/}
                    {/*             id="temp2"*/}
                    {/*             onClick={this.onClick(2)}*/}
                    {/*             checked={this.state.checkbox === 2 ? true: false}*/}
                    {/*             className="chooseCheck"*/}
                    {/*      />*/}
                    {/*    </div>*/}
                    {/*  </MDBFormInline>*/}
                    {/*  <h4>Product Info:</h4>*/}
                    {/*</div>*/}
                    <Fragment>{fragment}</Fragment>
                    {step !== 3 && <div className='bottom-wrapper'>
                        <div className="left">
                            {backButton}
                        </div>
                        <div className="right">
                            {nextButton}
                        </div>
                    </div>}
                </Container>
            </div>
            // </MDBCol>
        )
    }
}
