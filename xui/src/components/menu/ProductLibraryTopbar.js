import React, { Component } from 'react';
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'
class ProductUpdateTopbar extends Component{
  render() {
    return (
      <div>
        <div className="row product-manage">
          <div className="col-md-1">
            <i className="fa fa-cubes fa-4x"></i>
          </div>
          <div className="col-md-9">
            <h2 className="account-head"> Product Library </h2>
            <p>Manage all of your products in your catalogs, share with vendors, and more.</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="headerbox">
              <div style={{marginTop: 0, paddingTop: 10, paddingLeft: 20}}></div>
              <Button className="headerbox-button1" color="red" href="/#/products/create">Create New Product(s)</Button>
              <Button className="headerbox-button1" color="blue" href="/#/order/wizard">Order New Visual(s)</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default ProductUpdateTopbar;
