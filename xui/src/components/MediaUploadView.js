import React, { Component } from 'react';
import styled from 'styled-components'
import {Button, Modal, ModalBody, ModalHeader, ModalFooter, MDBFormInline, Input, MDBCol, MDBRow} from 'mdbreact';
import MediaUploadStart from "./mediaupload/MediaUploadStart";
import MediaUploadReview from "./mediaupload/MediaUploadReview";
import ProductDone from './productcreate/ProductDone';
import ProductMethod from './productcreate/ProductMethod';
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

export default class MediaUploadView extends Component {
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
            approvedProductList: null,
            productsSelected: [],
            selectedEdit: 0,
            selectedContentStandard: { name: 'No Content Standard', uniqueID: 'No Content Standard'},
            productsForCart: [],
            waitingForURL: false,
            noAddContentStandard: true,
            mediaUploadDict: null,
            dictLoaded: false
        }

        this.changeMode = this.changeMode.bind(this);
        this.finish = this.finish.bind(this);
        this.reset = this.reset.bind(this);
        this.resetStage = this.resetStage.bind(this);
        this.toggleDialog = this.toggleDialog.bind(this);
        this.evaluateProducts = this.evaluateProducts.bind(this);
        this.evaluateAccess = this.evaluateAccess.bind(this);
        this.handleFileSubmit = this.handleFileSubmit.bind(this);
        this.parseSelected = this.parseSelected.bind(this);
        this.setSelectedEdit = this.setSelectedEdit.bind(this);
        this.handleApprovedList = this.handleApprovedList.bind(this);
        this.user_id = this.props.userId;
    }

    componentDidMount() {
        this.setState({"productUpload":this.props.productUpload});
        this.setState({"productUploadMulti":this.props.productUploadMulti});
        this.evaluateAccess();
        this.parseSelected(this.props.productList);
        // this.props.getContentStandard();
    }

    componentWillMount() {
        document.title = 'XSPACE | Product Create'
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.productUpload)
            this.setState({"productUpload":nextProps.productUpload})
        else if (nextProps.importedProducts)
            this.setState({'shopifyProducts':nextProps.importedProducts})
        else if (nextProps.excelProducts)
            this.setState({'excelProducts':nextProps.excelProducts})
        else if (nextProps.createdProduct)
            this.setState({'createdProduct':nextProps.createdProduct})

        // if (typeof nextProps.editurl !== "undefined") {
            //this code will add a new tab
            // this.setState( {editurl: nextProps.editurl});
        // }
    }

    handleFileSubmit(dataTransfer) {
        let target = dataTransfer
        this.setState({uploadedFile: target, selectedEdit: 1})
        console.log('target', target)
    }

    handleApprovedList (approvedList) {
        let target = approvedList
        this.setState({approvedProductList: target})
    }

    toggleDialog() {
        this.setState({
            modal: !this.state.modal
        });
        this.evaluateProducts = this.evaluateProducts.bind(this)
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
        let proceed = false
        let {step, modeOption} = this.state;
        console.log('Nextstep', step, modeOption);

        if (modeOption === MODE_CREATE_PRODUCT) {
            console.log('MODE_CREATE_PRODUCT current step:', step);
            if (step === 1) {
                // this.setState({
                //     step : step + 1
                // });
                if (this.state.uploadedFile !== null) {
                    // this.setState({
                    //     submitting: true
                    // });
                    console.log('MEDIAUPLOADINSIDE');
                    // Upload the zipfile when the user clicks review and save the result //
                    this.props.mediaUpload(this.state.uploadedFile, null).then((res) => this.setState({mediaUploadDict: res.payload,
                        dictLoaded: true}))
                    proceed = true
                } else {
                    alert("Please select a '.zip' file to upload.")
                }

            } else if (step === 0) {
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
                        'create_product_man': true
                    })
                }).then(res => res.json())
                    .catch(error => console.error('Error:', error));
                proceed = true

            } else if (step === 2) {
                if (this.state.approvedProductList !== null) {
                    console.log('MEDIAUPLOADINSIDE');
                    // Upload the zipfile when the user clicks review and save the result //
                    this.props.mediaUpload(null, this.state.approvedProductList)
                    proceed = true
                } else {
                    alert("Please select a '.zip' file to upload.")
                }

            }
        }

        if (proceed) {
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

    render() {
        const errors = this.props.errors || {}
        let fragment = (<h2>None</h2>);
        let nextButton = null;
        let backButton = null;
        const {step, modeOption, processing} = this.state

        let chevron = <svg className="chevron_right" viewBox="11.52 6.718 19.745 33.683">
            <path fill="rgba(255,255,255,1)" id="chevron_right"
                  d="M 17.22008514404297 7.640035152435303 C 18.43419647216797 8.825107574462891 30.29219245910645 21.27291870117188 30.29219245910645 21.27291870117188 C 30.9400806427002 21.90810394287109 31.26493263244629 22.73565673828125 31.26493263244629 23.56321334838867 C 31.26493263244629 24.39076995849609 30.94007682800293 25.21832466125488 30.29219245910645 25.84806632995605 C 30.29219245910645 25.84806632995605 18.43419647216797 38.30131912231445 17.22008514404297 39.48094940185547 C 16.0059757232666 40.66601943969727 13.82275390625 40.74768829345703 12.53060531616211 39.48094940185547 C 11.23482894897461 38.22146606445313 11.13319778442383 36.45746612548828 12.53060531616211 34.91124725341797 L 23.41041374206543 23.56321334838867 L 12.53060340881348 12.21517944335938 C 11.13319778442383 10.66714477539063 11.23482704162598 8.901329040527344 12.53060340881348 7.638219356536865 C 13.82275199890137 6.37147855758667 16.00597190856934 6.451330661773682 17.22008514404297 7.638219356536865 Z">
            </path>
        </svg>

        let chevron_left = <svg className="chevron_left" viewBox="11.52 6.718 19.745 33.683">
            <path fill="rgba(255,255,255,1)" id="chevron_left"
                  d="M 17.22008514404297 7.640035152435303 C 18.43419647216797 8.825107574462891 30.29219245910645 21.27291870117188 30.29219245910645 21.27291870117188 C 30.9400806427002 21.90810394287109 31.26493263244629 22.73565673828125 31.26493263244629 23.56321334838867 C 31.26493263244629 24.39076995849609 30.94007682800293 25.21832466125488 30.29219245910645 25.84806632995605 C 30.29219245910645 25.84806632995605 18.43419647216797 38.30131912231445 17.22008514404297 39.48094940185547 C 16.0059757232666 40.66601943969727 13.82275390625 40.74768829345703 12.53060531616211 39.48094940185547 C 11.23482894897461 38.22146606445313 11.13319778442383 36.45746612548828 12.53060531616211 34.91124725341797 L 23.41041374206543 23.56321334838867 L 12.53060340881348 12.21517944335938 C 11.13319778442383 10.66714477539063 11.23482704162598 8.901329040527344 12.53060340881348 7.638219356536865 C 13.82275199890137 6.37147855758667 16.00597190856934 6.451330661773682 17.22008514404297 7.638219356536865 Z">
            </path>
        </svg>

        switch (step) {
            case STEP_1_CREATE_PRODUCT_LANDING:
                fragment = <ProductMethod
                    nextStep={this.nextStep}
                    changeMode={this.changeMode}
                    evaluateAccess={this.evaluateAccess}
                    modeOption={modeOption}/>
                break;
            case 1:
                if (modeOption === MODE_CREATE_PRODUCT) {
                    fragment =
                        <MediaUploadStart
                            processing={processing}
                            handleFileSubmit={this.handleFileSubmit}
                        />
                }
                break;
            case 2:
                fragment = <MediaUploadReview
                    mediaUploadDict={this.state.mediaUploadDict}
                    handleApprovedList = {this.handleApprovedList}
                />
                break;
            case 3:
                fragment = <ProductDone
                    reset={this.reset}
                    finish={this.props.cancel}>
                </ProductDone>
                break;
            default:
                fragment = (<h2>Lets go to the Dashboard!</h2>);
                break;
        }
        if (step > 1) {
            backButton =
                <StyledButton2 successColor={false} onClick={this.previousStep}
                               style={{position: 'absolute', bottom: 20, left: '5%', marginTop: '3.5%'}}>
                    {chevron_left}Previous
                </StyledButton2>
        }

        if (modeOption === MODE_CREATE_PRODUCT) {
            if (step === STEP_2_CREATE_PRODUCT_INPUT) {
                nextButton = <StyledButton2 successColor={false} onClick={this.nextStep}
                                            disabled={this.state.selectedEdit === 0 && this.state.noAddContentStandard}
                                            style={{width: "323px"}}>Upload & Review{chevron}</StyledButton2>
            } else if (step === STEP_3_CREATE_PRODUCT_CONFIRM) {
                // nextButton = <StyledButton2 successColor={true} style={{width:'320px'}} onClick={this.nextStep}>Add to Checkout{chevron}</StyledButton2>
                nextButton =
                    <StyledButton2 successColor={true}
                                   style={{position: 'absolute', width: '320px', bottom: 20,
                                       right: '5%', marginTop: '3.5%'}}
                                   onClick={this.nextStep}>
                        Accept & Upload{chevron}
                    </StyledButton2>
            }
        }

        console.log('stepandmode', step, modeOption, backButton, nextButton)
        // let buttonLES = <Button color="info">Load Existing Session</Button>
        return (
            // <div className="inner-bg">
            // <MDBCol md="12">
            //   <div className="container">
            <div className="animated">
                <Container>
                    <div className="flex-container-row">
                        {/*{upgrade}*/}
                        <p>Media Upload</p>
                        <Step isStep={step === 1} isPassed={step > 1}>
                            <span>1</span>
                            {/*<p>Select Method</p>*/}
                            <p>Upload</p>
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
