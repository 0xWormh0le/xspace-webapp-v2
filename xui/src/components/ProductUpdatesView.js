import React, {Component} from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'

//import TimeZoneEditFormView from './TimeZoneEditFormView';
//import LanguageEditFormView from './LanguageEditFormView';
import ProductPull from './productmanage/ProductPull'
import ProductPush from './productmanage/ProductPush'
import ManageLeftSideMenu from './menu/ManageLeftSideMenu'
import ProductUpdateTopbar from './menu/ProductUpdateTopbar'
import TextInput from './TextInput'
import './managepage.css';

import { ProductView, LeftPanel } from './ProductManageView'

const RightPanel = styled(LeftPanel)`
  max-width: 100%;
  width: 100%;
`

export default class ProductUpdates extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      products : ''
    }

    this.handleClick = this.handleClick.bind(this);

    this.userData = JSON.parse(localStorage.getItem('persist:root'));
    var data = JSON.parse(this.userData['auth']);
    this.user_id = data['access']['user_id'];
    //console.log(data);

    //this.get_products();
  }

  get_products(){
    fetch('http://localhost:8000/api/products_list/'+this.user_id+'/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        //console.log(response);
        this.setState({
          products: response
      });

    });
  }


  handleClick(e) {
    e.preventDefault();
    /*
    if(e.currentTarget.getAttribute('name')=="logout"){
      localStorage.clear();
      window.location.reload();
    }
    */

  }

  render() {

    return (
    <div className="container">
        <ProductView>
          <LeftPanel>
            <ManageLeftSideMenu active={2}></ManageLeftSideMenu>
          </LeftPanel>
          <RightPanel>
            <div className="row">
              <div className="col-md-12"  style={{marginLeft: 30}}>
                  <div style={{marginTop: 0, paddingTop: 20}}></div>
                  <h2 className="account-head"> Product Updates </h2>
                  <p><i>Recieve updates from your e-commerce store / push updates to your store.</i></p>
                  <div className="row">
                      <div className="col-sm-6">
                        <p>Supported platforms:</p>
                        <img src="https://cdn.shopify.com/assets/images/logos/shopify-bag.png" width="96" height="96" style={{marginRight: 30}}/>
                        <img src="https://www.shareicon.net/data/256x256/2015/10/06/112653_development_512x512.png" width="96" height="96" style={{marginRight: 30}} />
                        <img src="https://www.shareicon.net/data/256x256/2015/10/06/112651_development_435x512.png" width="96" height="96" style={{marginRight: 30}} />
                      </div>
                      <div className="col-sm-6">
                          <div style={{marginTop: 0, paddingTop: 60}}></div>
                          <Button className="btn btn-green Ripple-parent appSettingsUpdate" href="/addtocart/addapikey" >API Settings</Button>
                      </div>



                  </div>
                  <div style={{marginTop: 0, paddingTop: 20}}></div>
                  <p><b>Active Store API for Updates:</b></p>
                  <select value={this.state.value} onChange={this.onChange}>
                      <option value="Shopify">Shopify</option>
                      <option value="Magento">Magento</option>
                      <option value="Woocommerce">Woocommerce</option>
                  </select>

              </div>
          </div>
          <div className="row">

              <div className="col-md-12"  style={{marginLeft: 30}}>
              <div className="underline-div"></div>
                  <div style={{marginTop: 0, paddingTop: 20}}></div>
                  <h4> Pull From Store Queue </h4>
                  <p> Receive updates from your e-commerce store.</p>
                  <ProductPull></ProductPull>
              </div>
          </div>
          <div style={{marginTop: 0, paddingTop: 20}}></div>
          <div className="row">
              <div className="col-md-12"  style={{marginLeft: 30}}>
                  <div style={{marginTop: 0, paddingTop: 20}}></div>
                  <h4> Push to Store Queue </h4>
                  <p> Receive updates from your e-commerce store.</p>
                  <ProductPush></ProductPush>
              </div>
          </div>
        </RightPanel> 
      </ProductView>
    </div>
  )}
}
