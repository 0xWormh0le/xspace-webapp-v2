import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'
import { connect } from 'react-redux'
import  Loader from 'react-loader';
import { Redirect } from 'react-router'
import TextInput from '../../lib/TextInput'
import axios from 'axios';

import { API_ROOT } from '../../index';

export default class MangentoForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      store_url: '',
      shopify_apikey: '',
      shopify_password: '',
      store_id: '',
      dropdownOpen: false,
      cart_id: 'Magento1212',
      request_type: "",
      responseData: '',
      isLoaded: true,
      errors: {},
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
        [name]: value
    });
  }

  /*Toggle form*/
  toggleForm(){
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  /*Form Validation*/
  handleValidation(){
    let { cart_id, store_id, store_url } = this.state;
    let errors = {};
    let formIsValid = true;
    if(!store_id && !store_url){
      errors['store_id'] = "This field may not be blank.";
      errors['store_url'] = "This field may not be blank.";
      formIsValid = false
    }else if(!store_id){
      errors['store_id'] = "This field may not be blank.";
      formIsValid = false
    }else if(!store_url){
      errors['store_url'] = "This field may not be blank.";
      formIsValid = false
    }
    this.setState({errors: errors});
    return formIsValid;
  }

  /*Update Magento Connection*/
  updateConnection = (event) => {
    event.preventDefault()
    const thisScope = this
    if(this.handleValidation()){
      thisScope.setState({isLoaded: false});
      const formData = {cart_id: this.state.cart_id, store_id: this.state.store_id, shopify_apikey: this.state.shopify_apikey, shopify_password:this.state.shopify_password, store_url: this.state.store_url, user_id: this.props.formField.userId, request_type: ''}
      axios.post(API_ROOT + '/api2CartTestConnection/', JSON.stringify(formData), this.state.config)
      .then(function (response) {
        thisScope.setState({
          responseData: response.data,
          isLoaded: true
        });
      }).catch(function (error) {
        thisScope.setState({
          isUpdateConnection: false,
          errors: error,
          isLoaded: true
        });
      });
    }
  }

  /*Test Magento Connection*/
  testConnection = (event) => {
    event.preventDefault()
    const thisScope = this
    if(this.handleValidation()){
      this.setState({isLoaded: false});
      const formData = {cart_id: this.state.cart_id, store_id: this.state.store_id, shopify_apikey: this.state.shopify_apikey, shopify_password:this.state.shopify_password, store_url: this.state.store_url, user_id: this.props.formField.userId, request_type: 'test_connection'}
      axios.post(API_ROOT + '/api2CartTestConnection/', JSON.stringify(formData), this.state.config)
      .then(function (response) {
        thisScope.setState({
          responseData: response.data,
          isLoaded: true
        });
      }).catch(function (error) {
        thisScope.setState({
          isTestConnection: true,
          errors: error,
          isLoaded: true
        });
      });
    }
  }

  render() {
    const errors = this.state.errors || {}
    return (
      <div>
        <div className="row">
          <div className="col-md-10">
            <h3 className="myacc-h5">Magento API  <i className="fa fa-question-circle editquestion-mark"></i></h3>
            <p>Change your Magneto API Credentials here. To learn how you can find your Magento credentials click<a href="#"> here</a>.</p>
          </div>
          <div className="col-md-2">
            <div className="downarrow-div">
              {!this.state.dropdownOpen &&(<Link to="#" className="toggleClass"><i className="fa fa-angle-down edit-downarrow" onClick={this.toggleForm}></i></Link>)}
              {this.state.dropdownOpen &&(<Link to="#" className="toggleClass"><i className="fa fa-angle-up edit-downarrow" onClick={this.toggleForm}></i></Link>)}
            </div>
          </div>
        </div>
        {this.state.dropdownOpen && (
          <form id="magentoFormId" name="magento_form">
            <div className="form-group">
              <label className="input-label">Store Url</label>
              <TextInput className="form-control edit-accinboxshopify" placeholder="Store URL" name="store_url" error={errors.store_url} onChange={this.handleInputChange} />
              <TextInput name="cart_id" type="hidden" value={ 'Magento1212' } onChange={this.handleInputChange} />
            </div>
            <div className="form-group">
              <label className="input-label">Store Id</label>
              <TextInput className="form-control edit-accinboxshopify" placeholder="Store Id" name="store_id" error={errors.store_id} onChange={this.handleInputChange} />
            </div>
            <div className="row">
              <div className="col-md-3">
                <button type="submit" className="update-btn button-text" name="request_type" onClick={this.updateConnection}>UPDATE CREDENTIALS</button>
              </div>
              <div className="col-md-3">
                <button type="submit" className="test-connection-btn button-text" onClick={this.testConnection}>TEST CONNECTION</button>
              </div>
              <div className="col-md-6">
                <div className="col-md-2">
                  {this.state.responseData.status == 'Connection Unsuccessful' && (<img src="/media/unsuccessful-icon.png" alt="share icon" />)}
                  {this.state.responseData.status == 'Connection Successful' && (<img src="/media/success-icon.png" alt="share icon" />)}
                  {this.state.responseData.status == 'Updation Successful' && (<img src="/media/success-icon.png" alt="share icon" />)}
                  {this.state.responseData.status == 'Updation Unsuccessful' && (<img src="/media/unsuccessful-icon.png" alt="share icon" />)}
                </div>
                <div className="col-md-4">
                  <span className="success-message">{this.state.responseData.status}</span><br/>
                </div>
              </div>
            </div>
            <Loader loaded={this.state.isLoaded} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="350px" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />

            <div className="row">
              <div className="2"></div>

                {this.state.responseData.status == 'Connection Unsuccessful' && (
                  <div className="8" style={{marginTop:60}}>
                    <span className="api-unsuccess">
                      <span className="unsuccess-text">Reasons: {this.state.responseData.messgae} </span>
                    </span>
                  </div>
                )}

                {this.state.responseData.status == 'Updation Unsuccessful' && (
                  <div className="8" style={{marginTop:60}}>
                    <span className="api-unsuccess">
                      <span className="unsuccess-text">Reasons: {this.state.responseData.messgae} </span>
                    </span>
                  </div>
                )}

                {this.state.responseData.status == 'Updation Successful' && (
                  <div className="8" style={{marginTop:60}}>
                    <span className="api-success">
                      <span className="rightsign-divbtn-text">You may now connect to this store!</span>
                    </span>
                  </div>
                )}

              <div className="2"></div>
            </div>
          </form>
        )}
      </div>
    )
  }
}
