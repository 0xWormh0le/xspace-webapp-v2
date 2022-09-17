import React, { Component } from 'react';
import styled from 'styled-components'
import { MDBInput, Button } from 'mdbreact';
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from "mdbreact";
import { MDBSelect, MDBSelectInput, MDBSelectOptions, MDBSelectOption} from "mdbreact";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { CountryList } from '../../constants'
import { Select } from '../../lib/select'

const Container = styled.div`
  h4 {
    font-size: 18px;
    font-weight: 400;
    line-height: 26px;
    color: #333330;
  }
  p {
    font-size: 14px;
    color: #333330;
    opacity: .5;
    line-height: 20px;
  }
  button {
    color: #333333;
    font-size: 14px;
    width: 133px;
    height: 38px;
    border: none;
    line-height: 20px;
    background-color: white;
    border-radius: 19px;
    margin: 25px 0;
    border: 2px solid #F4F5FA;
    :hover {
      color: white;
      background-color: #00A3FF;
      border: none;
    }
  }
  .backdrop-grey {
    background-color: #F4F5FA;
    border-radius: 10px;
    text-align: center;
    padding: 40px 60px;
    border: none;
    h4 {
      font-size: 24px;
      line-height: 34px;
    }
    p {
      opacity: .6;
      margin: 0;
      padding-bottom: 20px;
    }
  }
  span {
    font-size: 12px;
    color: #000000;
    opacity: .5;
    line-height: 20px;
    a {
      color: #000000 !important;
      opacity: .5;
    }
  }
  label {
    font-size: 12px;
    color: #333330;
    line-height: 20px;
    display: block;
  }
  h3 {
    font-size: 14px;
    margin: 10px 0;
    color: #000000;
    opacity: .5;
    line-height: 20px;
  }
  .md-form.md-outline {
    margin: 0;
    width: 100%;
    input {
      border: 2px solid #F4F5FA;
      border-radius: 10px;
      margin-bottom: 20px;
    }
  }
  .flex-div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    div:first-child {
      margin-right: 10px;
    }
  }
    
  .check-boxs {
    display: flex;
    align-items: center;
    justify-content: center;
    .form-check.my-3 {
      padding-left: 0;
      label {
        font-size: 14px;
        margin: 0;
      }
    }    
  }
`
export default class ShippingDetails extends Component {

  constructor(props) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.handleOnChangeAddress1 = this.handleOnChangeAddress1.bind(this)
    this.handleOnChangeAddress2 = this.handleOnChangeAddress2.bind(this)
    this.handleOnChangePOBox = this.handleOnChangePOBox.bind(this)
    this.handleOnChangeCity = this.handleOnChangeCity.bind(this)
    this.handleOnChangeState = this.handleOnChangeState.bind(this)
    this.handleOnChangeZipCode = this.handleOnChangeZipCode.bind(this)
    this.handleOnChangeCountry = this.handleOnChangeCountry.bind(this)
    this.handleOnChangeSaveAddress = this.handleOnChangeSaveAddress.bind(this)
    this.handleOnChangeReturnProducts = this.handleOnChangeReturnProducts.bind(this)
    this.handleOnChangeExistingAddress = this.handleOnChangeExistingAddress.bind(this)
    this.assembleCountries = this.assembleCountries.bind(this)
    this.setCountryList = this.setCountryList.bind(this)
    this.setAddressesList = this.setAddressesList.bind(this)



    this.state = {
      address1: '',
      address2: '',
      poBoxNum: '',
      city: '',
      state: '',
      zipcode: '',
      country: 'United States',
      region:'',
      saveAddress: false,
      returnProducts:false,
      countryListOptions:[],
      addressListOptions:[],
      existingAddressData:[],
      error: {
        address1: '',
        address2: '',
        poBoxNum: '',
        city: '',
        state: '',
        zipcode: '',
        country: 'United States',
        saveAddress: '',
        returnProducts:'',
      }
    }
  }

  componentDidMount() {
    //this.props.getAddress();
    this.setCountryList();
    this.setAddressesList();
  }

  componentWillUnmount() {
    let { address1, address2, city, country, poBoxNum, region, zipcode, state } = this.state
    let info = {
      "address1": address1,
      "address2": address2,
      "city": city,
      "state": state,
      "zipcode": zipcode,
      "country": 'United States',
      "poBoxNum": poBoxNum,
      "region": region
    }
    this.props.saveAddressData(info)
  }

  assembleCountries = () => {
    let countryOptionItem;
    if(CountryList){
        countryOptionItem = CountryList.map((country) => {

          var countrystring = String(country.country);
          //console.log(country.country)
          return (<MDBSelectOption value={country.country}>{country.country}</MDBSelectOption>)
        });
    }
    else{
       countryOptionItem = (<MDBSelectOption value="United States of America"><p>United States of America</p></MDBSelectOption>)
    }

    return countryOptionItem;
  }

  assembleAddresses = () => {
    let addressOptionItem;
    //console.log(this.props);
    var address_list = this.props.addresses;

    if(address_list){
        addressOptionItem = address_list.map((address, index) => {

          var addressString = String(address.address1);
          //console.log(country.country)
          if(address.address2 === "" || !address.address2 ){
            return (<option value={address.id}>{address.address1}, {address.city}, {address.state} {address.zipcode}  {address.country}</option>)
          }
          else{
            return (<option value={address.id}>{address.address1}, {address.address2}, {address.city}, {address.state} {address.zipcode}  {address.country}</option>)
          }

        });
    }
    else{
       addressOptionItem = (<option value="None">None</option>)
    }

    return addressOptionItem;
  }


   /*Get Country data */
  setCountryList = () => {
     this.setState({ countryListOptions:this.assembleCountries()});
     //console.log(this.state.countryListOptions);
  }

  /*Get Country data */
  setAddressesList = () => {
     this.setState({ addressListOptions:this.assembleAddresses()});
     //console.log(this.state.addressListOptions);
  }

  handleInputChange(mode) {
    this.props.mode(mode);
  }

  returnAddBoolString(){
    if(this.state.saveNewAddress === true){
        return "true"
    }
    else{
        return "false"
    }
  }

  handleCheckboxChange = (event) => {
    const target = event.target,
      value = target.type ===
        'checkbox' ? target.checked : target.value,
      name = target.name
    this.setState({
      [name]: target.checked
    });
  }

  handleOnChangeAddress1(evt){
    this.setState({
      'address1':evt.target.value
    });
    this.props.fieldValues.newAddressData.address1 = evt.target.value
    //console.log(this.props.fieldValues.newAddressData.address1)
  }

  handleOnChangeAddress2(evt){
    this.setState({
      'address2':evt.target.value
    });
    this.props.fieldValues.newAddressData.address2 = evt.target.value
    //console.log(this.props.fieldValues.newAddressData.address2)
  }
  handleOnChangePOBox(evt){
    this.setState({
      'poBoxNum':evt.target.value
    });
    this.props.fieldValues.newAddressData.poBoxNum = evt.target.value
    //console.log(this.props.fieldValues.newAddressData.poBoxNum)
  }
  handleOnChangeCity(evt){
    this.setState({
      'city':evt.target.value
    });
    this.props.fieldValues.newAddressData.city = evt.target.value
    //console.log(this.props.fieldValues.newAddressData.city)
  }
  handleOnChangeState(evt){
    this.setState({
      'state':evt.target.value
    });
    this.props.fieldValues.newAddressData.state = evt.target.value
    //console.log(this.props.fieldValues.newAddressData.state)
  }
  handleOnChangeZipCode(evt){
    this.setState({
      'zipcode':evt.target.value
    });
    this.props.fieldValues.newAddressData.zipcode = evt.target.value
    //console.log(this.props.fieldValues.newAddressData.zipcode)
  }
  handleOnChangeCountry(evt){
    this.setState({
      'country':evt.target.value
    });
    this.props.fieldValues.newAddressData.country = evt.target.value
    //console.log(this.props.fieldValues.newAddressData.country)
  }
  handleOnChangeSaveAddress(evt){
    this.setState({
      'saveAddress':evt.target.checked
    });
    this.props.fieldValues.saveNewAddress = evt.target.checked
    this.props.fieldValues.addressId = 0
    //console.log(this.props.fieldValues.saveNewAddress)
  }
  handleOnChangeReturnProducts(evt){
    this.setState({
      'returnProducts':evt.target.checked
    });
    this.props.fieldValues.returnProducts = evt.target.checked
    //console.log(this.props.fieldValues.returnProducts)
  }

  handleOnChangeExistingAddress(evt){
    //console.log(evt)
    //Set Address Object to State Based off Select Option
    let map = {}
    this.props.addresses.map((address)=> {
      map[address.id] = address
    })

    let data = map[evt.target.value]

    this.setState({
      'existingAddressData':evt.target.value,
      'address1':data["address1"],
      'address2':data["address1"],
      'poBoxNum':data["poBoxNum"],
      'city':data["city"],
      'state':data["state"],
      'zipcode':data["zipcode"],
      'country':data["country"]
    });

    //Return New Address Data
    this.props.fieldValues.addressId = evt.target.value
    //console.log(this.props.fieldValues.addressId)
  }

  selectCountry (val) {
    this.setState({ country: val });
  }

  selectRegion (val) {
    this.setState({ region: val });
  }

  render() {
    const errors = this.props.errors || {}

    const region = this.props.country != '' ? (<RegionDropdown
              country={this.state.country}
              value={this.state.region}
              onChange={(val) => this.selectRegion(val)} />) : <br />


    let btnCNS = <button className="new-stndard-button">Create New Standard</button>
    return (
      <Container>
        <div className="animated fadeIn">
          <div className="row">
            <div className="col-sm-6">
              <div className="row">
                <div className="col-md-12">
                  <h4> Where Do I Ship To?</h4>
                  <p>Products are shipped to our state of the art scanning
                      facility where we will recieve your products and generate
                      product content for you.</p>
                  <button onClick={this.props.toggleVideoModal} >Show Me How</button>
                  <div class="backdrop-grey">
                    <p>Please send all products in your order to this address:</p>
                    <h4>
                      1802 Industrial Park Drive,
                      Unit C,
                      Normal, IL 61761
                      United States
                      </h4>
                  </div>
                  <br />
                  <span>* XSPACE is not responsible for shipment costs associated with orders.
                    <br />
                    Please review our <a target="_blank" href="https://xspaceapp.com/terms-of-service/" rel="noopener noreferrer" className="blue-text">
                      <u>XSPACE Web App Terms of Service </u></a> regarding shipping.</span>

                </div>
                </div>
            </div>
            <div className="col-sm-6 right-panel">
                <h4>Return Address</h4>
                <p>Should you elect for your products to be returned, we will a return address to send products.</p>
                <label className="mt-3">Select from existing addresses:</label>
                <Select onChange={this.handleOnChangeExistingAddress}>
                  <option value={-1}>None</option>
                  {this.state.addressListOptions}
                </Select>
                <center><h3>OR</h3></center>
                <MDBInput containerClass="addressInput" label="Address 1" outline onChange={this.handleOnChangeAddress1} error={this.state.error.address1} value={this.state.address1}/>
                <MDBInput containerClass="addressInput" label="Address 2" outline onChange={this.handleOnChangeAddress2} error={this.state.error.address2} value={this.state.address2}/>
                <MDBInput containerClass="addressInput" label="City" outline onChange={this.handleOnChangeCity} error={this.state.error.city} value={this.state.city}/>
                <div className={'flex-div'}>                  
                  <MDBInput containerClass="addressInput" label="State" outline onChange={this.handleOnChangeState} error={this.state.error.state} value={this.state.state}/>
                  <MDBInput containerClass="addressInput" label="Zip Code" outline onChange={this.handleOnChangeZipCode} error={this.state.error.zipcode} value={this.state.zipcode}/>
                </div>                
                <Select>
                  <option selected value={this.state.country}>{this.state.country}</option>
                  {CountryList.map((item, index) => <option value={item.country}>{item.country}</option>)}
                </Select>
                <div className='check-boxs'>
                  <MDBInput label="Save for Future Use" type="checkbox" id="1" name="saveNewAddress" onChange={this.handleOnChangeSaveAddress} error="An Error has Occured, refresh and try again." value={this.state.saveNewAddress} />
                  <MDBInput label="Return Products After Completion" type="checkbox" id="2" name="returnProducts" onChange={this.handleOnChangeReturnProducts} error="An Error has Occured, refresh and try again." value={this.state.returnProducts} />
                </div>
            </div>
          </div>
          <br />
          <br />
          <br />
        </div>
      </Container>
    );
  }
}
