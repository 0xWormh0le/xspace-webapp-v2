import React, {Component} from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import  Loader from 'react-loader';
import TextInput from '../../lib/TextInput'
import axios from 'axios';

import { API_ROOT } from '../../index';

const FormWrapper = styled.div`
  &&& {
    h3 {
      font-size: 18px;
      font-weight: 400;
      line-height: 26px;
      color: #333330;
      margin-bottom: 4px;
    }
    &> p {
      color: rgba(51, 51, 48, .5);
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
    }
    label {
      font-size: 12px;
      color: #333330;
      line-height: 20px;
    }
    input {
      width: 100%;
      height: auto;
      border: none;
      font-size: 14px;
      line-height: 20px;
      font-weight: bold;
      height: 38px;
      color: #333333;
      border: 2px solid #F4F5FA;
      padding: 0 10px;
      border-radius: 10px;
    }
    .ShopifyForm {
      padding-left: 20px;
    }
  }  
`

const BottomBtns = styled.div`
  display: flex;
  align-items: center;
  padding-top: 25px;
  button {
    width: 213px;
    height: 58px;
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    background-color: #00A3FF;
    border-radius: 29px;
  }
  button:first-child {
    margin-right: 25px;
  }
`

export default class ShopifyForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      store_url: '',
      shopify_apikey: '',
      shopify_password: '',
      store_id: '',
      dropdownOpen: false,
      cart_id: 'Shopify',
      isLoaded: true,
      errors: {},
      request_type: "",
      responseData: "",
      isStoreFound: false,
      isTestConnection: false
    }
    this.toggleForm = this.toggleForm.bind(this);
  }

  handleInputChange = (event) => {
      const target = event.target,
          value = target.type ===
          'checkbox' ? target.checked : target.value,
        name = target.name
        this.state.errors[name] = ''
      this.setState({
          [name]: value,
      });
  }

  /*Toogle form*/
  toggleForm(){
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  /*Form Validation*/
  handleValidation(){
    let { cart_id, store_id, store_url, shopify_apikey, shopify_password } = this.state;
    let errors = {};
    let formIsValid = true;
    if(!shopify_apikey && !store_url && !shopify_password){
      errors['store_url'] = "This field may not be blank.";
      errors['shopify_apikey'] = "This field may not be blank.";
      errors['shopify_password'] = "This field may not be blank.";
      formIsValid = false
    }else if(!store_url){
      errors['store_url'] = "This field may not be blank.";
      formIsValid = false
    }else if(!shopify_apikey){
      errors['shopify_apikey'] = "This field may not be blank.";
    }else if(!shopify_password){
      errors['shopify_password'] = "This field may not be blank.";
    }
    this.setState({errors: errors});
    return formIsValid;
  }

  /*Update Woocommerce Connection*/
  updateConnection = (event) => {
    event.preventDefault()
    if(this.handleValidation()){
      this.setState({isLoaded: false});
      const formData = {cart_id: this.state.cart_id, store_id: this.state.store_id, shopify_apikey: this.state.shopify_apikey, shopify_password:this.state.shopify_password, store_url: this.state.store_url, user_id: this.props.formField.userId, request_type: ''}
      axios.post(API_ROOT + '/api2CartTestConnection/', JSON.stringify(formData), this.state.config)
      .then(response => {
        this.setState({
          responseData: response.data,
          isLoaded: true
        });
      }).catch(error =>{
        this.setState({
          isTestConnection: false,
          errorMessage: error,
          isLoaded: true
        });
      });
    }
  }

  /*Test Woocommerce Connection*/
  testConnection = (event) => {
    event.preventDefault()
    if(this.handleValidation()){
      this.setState({isLoaded: false});
      const formData = {cart_id: this.state.cart_id, store_id: this.state.store_id, shopify_apikey: this.state.shopify_apikey, shopify_password:this.state.shopify_password, store_url: this.state.store_url, user_id: this.props.formField.userId, request_type: 'test_connection'}
      axios.post(API_ROOT + '/api2CartTestConnection/', JSON.stringify(formData), this.state.config)
      .then(response =>{
        this.setState({
          responseData: response.data,
          isLoaded:true
        });
      }).catch(error =>{
        this.setState({
          isTestConnection: true,
          errorMessage: error,
          isLoaded: true
        });
      });
    }
  }

  render() {
    const errors = this.state.errors || {}
    return (
      <FormWrapper>
        <h3>Shopify API</h3>
        <p>Change your Shopify API Credentials here. To learn how you can find your Shopify credentials, click<a href="#"> here.</a></p>      
        <form id="ShopifyForm" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="storeU" className="input-label">Store Url</label>
            <TextInput className="form-control edit-accinboxshopify" placeholder="Store URL" name="store_url" id="storeU" error={errors.store_url} onChange={this.handleInputChange} />
            <TextInput name="cart_id" type="hidden" value={ 'Shopify' } onChange={this.handleInputChange} />
          </div>
          {/*<div className="form-group">
            <label className="input-label">Store Id</label>
            <TextInput className="form-control edit-accinboxshopify" placeholder="Store Key" name="store_id" error={errors.store_id} onChange={this.handleInputChange} />
          </div>*/}
          <div className="form-group">
            <label className="input-label">API Key</label>
            <TextInput className="form-control edit-accinboxshopify" placeholder="API Key" name="shopify_apikey" error={errors.shopify_apikey} onChange={this.handleInputChange} />
          </div>
          <div className="form-group">
            <label className="input-label">Password</label>
            <TextInput className="form-control edit-accinboxshopify" placeholder="Password" name="shopify_password" error={errors.shopify_password} type="password" onChange={this.handleInputChange}/>
          </div>
          {/* <div className="row">
            <input type="hidden" name="submit" value="submit" /> */}
            <BottomBtns>
              <button type="submit" onClick={this.testConnection}>Test Connection</button>
              <button type="submit" name="request_type" onClick={this.updateConnection}>Update Credentials</button>              
            </BottomBtns>            
            {/* <div className="col-md-6">
              <div className="col-md-2">
                {this.state.responseData.status === 'Connection Unsuccessful' && (<img src="/media/unsuccessful-icon.png" alt="share icon" />)}
                {this.state.responseData.status === 'Connection Successful' && (<img src="/media/success-icon.png" alt="share icon" />)}
                {this.state.responseData.status === 'Updation Successful' && (<img src="/media/success-icon.png" alt="share icon" />)}
                {this.state.responseData.status === 'Updation Unsuccessful' && (<img src="/media/unsuccessful-icon.png" alt="share icon" />)}
              </div>
              <div className="col-md-4">
                <span className="success-message">{this.state.responseData.status}</span><br/>
              </div>
            </div> */}
          {/* </div> */}
          <Loader loaded={this.state.isLoaded} lines={13} length={20} width={10} radius={30}
            corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
            trail={60} shadow={false} hwaccel={false} className="spinner"
            zIndex={2e9} top="452px" left="50%" scale={1.00}
            loadedClassName="loadedContent" />

          <div className="row">
            <div className="2"></div>

              {this.state.responseData.status === 'Connection Unsuccessful' && (
                <div className="8" style={{marginTop:60}}>
                  <span className="api-unsuccess">
                    <span className="unsuccess-text">Reasons: {this.state.responseData.messgae} </span>
                  </span>
                </div>
              )}

              {this.state.responseData.status === 'Updation Unsuccessful' && (
                <div className="8" style={{marginTop:60}}>
                  <span className="api-unsuccess">
                    <span className="unsuccess-text">Reasons: {this.state.responseData.messgae} </span>
                  </span>
                </div>
              )}

              {this.state.responseData.status === 'Updation Successful' && (
                <div className="8" style={{marginTop:60}}>
                  <span className="api-success">
                    <span className="rightsign-divbtn-text">You may now connect to this store!</span>
                  </span>
                </div>
              )}

            <div className="2"></div>
          </div>
        </form>
      </FormWrapper>
    )
  }
}
