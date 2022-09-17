import React, { Component } from 'react';
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'
class ProductUpdateTopbar extends Component{
  render() {
    return (
      <div>
        <div className="row product-manage">
          <div className="col-md-1">
            <img src="/media/management-icon.png" width="60" height="60" alt="prismalogo" />
          </div>
          <div className="col-md-9">
            <h2 className="account-head"> {this.props.tabName} </h2>
            <p>Recieve updates from your e-commerce store / push updates to your store.</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="headerbox">
              <div style={{marginTop: 0, paddingTop: 10, paddingLeft: 20}}></div>
              <Button className="headerbox-button1" color="red" href="/#/products/create">Create New Product(s)</Button>
              <Button className="headerbox-button1" color="blue" href="/#/order/wizard">Order New Visual(s)</Button>
              <div className="headerbox-search">
                
                <button type="submit" className="order-search-button">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default ProductUpdateTopbar;
