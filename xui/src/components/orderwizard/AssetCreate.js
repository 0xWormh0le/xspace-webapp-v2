import React, { Component } from 'react';
import styled from 'styled-components'
import { MDBSelect, MDBSelectInput, MDBSelectOptions, MDBSelectOption} from "mdbreact";
import { Select } from '../../lib/select'
import './OrderWizard.css';

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
  color: #333330;
  margin-top: 25px;
  .flex-bottom-div {
    flex: 1;
    margin: 0 15px;
  }

  h4 {
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
  }
  p {
    font-size: 14px;
    line-height: 20px;
    opacity: .5;
    max-width: 70%;
  }
  button {
    border: 2px solid #F4F5FA;
    color: #333333;
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
    height: 38px;
    border-radius: 19px;
    width: 133px;
    height: 38px;
    flex: none;
    :hover {
      background-color: #00A3FF;
      color: white;
      border: none;
    }
  }
  h6 {
    color: #333330;
    font-size: 12px;
    line-height: 20px;
  }
  .select-wrapper {
    margin: 0;
    position: relative;
    i {
      font-size: 10px;
      position: absolute;
      right: 0;
      top: 12px;
    }
    > span {
      display: none;
    }
    input {
      min-width: 505px;
      border: none;
      color: #333333;
      font-size: 14px;
      line-height: 20px;
      font-weight: bold;
      opacity: .5;
    }
  }
  .bottom-right {
    button {
      color: #00A3FF;
      width: 100%;
      height: 38px;
      border: 2px solid #F4F5FA;
      border-radius: 19px;
      :hover {
        background-color: #00A3FF;
        color: white;
        border: none;
      }
    }
  }
`

export default class AssetCreate extends Component {

  state = {
    modal: false,
    batchModal: false,
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
    textBatchName: "",
    text2DNotes: "",
    textVideoNotes: "",
    text360Notes: "",
    text3DARVRNotes: ""
  }

  constructor(props, context) {
    super(props, context);



    this.standardSubmit = this.standardSubmit.bind(this)
    this.testOrder = this.testOrder.bind(this)
  }

  componentDidMount() {
     this.setList();
  }

  standardSubmit(payload){
    this.props.createStandardPost(payload);
  }

  assembleStandards = () => {
    let standardsOptionItem;
    ////console.log(this.props)
    if(this.props.contentStandard){
      //console.log("MAP")
      if (this.props.contentStandard["contentStandard"] && this.props.contentStandard["contentStandard"].length > 0) {
        standardsOptionItem = this.props.contentStandard["contentStandard"].map((standard, index) => {
          //console.log(standard.name)
          return (<option value={standard.name}>{standard.name}</option>)
        });
      }
    }
    else{
       standardsOptionItem = (<option value="No Standards"><p>No Standards</p></option>)
    }
    return standardsOptionItem;
  }


   /*get product data */
  setList = () => {
     this.setState({ standardsOptionList:this.assembleStandards()});
     //console.log(this.state.standardsOptionList);
  }



  testOrder() {
    // let dict = {
    //   "numberOfOrders":3,
    //   "orders":[
    //     {
    //       "numberOfProducts": 2,
    //       "product_list": [
    //         {
    //           "id": 1,
    //           "is360viewrequired": false,
    //           "is2drequired": false,
    //           "is3dmodelrequired": false,
    //           "isvideorequired": false,
    //           "notes2d": "",
    //           "notes360view": "",
    //           "notes3dmodel": "",
    //           "notesvideo": ""
    //         },
    //         {
    //           "id": 1,
    //           "is360viewrequired": false,
    //           "is2drequired": false,
    //           "is3dmodelrequired": false,
    //           "isvideorequired": false,
    //           "notes2d": "",
    //           "notes360view": "",
    //           "notes3dmodel": "",
    //           "notesvideo": ""
    //         }
    //       ]
    //     }
    //   ]
    // }
    // this.props.saveOrder(dict)
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    const errors = this.props.errors || {};

    const toggle = this.props.toggle


    return (
      <div className="animated fadeIn">
        <FlexDiv>
          <div>
            <h4>Content Standards <b>(OPTIONAL)</b></h4>
            <p>Create or use existing content standards to ensure your content is consistent with your brand’s needs or that of a marketplace such as Amazon or Walmart. Here you can customize certain specifications such as image sizes, margins, background colors, file formatting and more. Don’t have a specific content standard you need to follow?  Don’t worry!  Just select “No Content Standard” and we will use our XSPACE standard to create quality content.</p>
          </div>
          <button onClick={this.props.toggleVideoModal} >Show Me How</button>
        </FlexDiv>
        <FlexDiv>
          <div className='flex-bottom-div'>
            <h6>Select an existing content standard for your order.</h6>
            <Select>
              <option disabled value='Choose A Content Standard'>Choose A Content Standard</option>
              <option value='No Content Standard' selected>No Content Standard</option>
              {this.state.standardsOptionList}
              <option disabled value='Popular Standards'>Popular Standards</option>
              <option value="Amazon">Amazon</option>
              <option value="Walmart">Walmart</option>
            </Select>
          </div>
          <div className={'bottom-right flex-bottom-div'}>
            <h6>Create a new content standard for your order and future orders.</h6>
            <button onClick={this.props.toggle}>Create A Content Standard</button>
          </div>
        </FlexDiv>
      </div>
    );
  }
}
