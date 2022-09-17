import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'

export default class UpdatesLeftSideMenu extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
        <div className="account-left">
          <ul className="list-unstyled">
            <li key={1} className="left-menu-bar-inactive">
              <img src="/media/product-icon.png" alt="prismalogo" />
              <Link to="/products/manage" className="menu-font" style={{marginTop:20}}>PRODUCT LIBRARY</Link>
            </li>
            <li key={2} className="left-menu-bar-inactive">
              <img src="/media/product-update-icon.png" alt="apps icon"/>
              <Link to="/products/update" className="menu-font">PRODUCT UPDATES</Link>
            </li>
            <li key={3} className="left-menu-bar-api-active">
              <img src="/media/my-order-icon.png" alt="product icon" className="product-icon"/>
              <Link to="/products/orders" className="menu-font">MY ORDERS</Link>
              <div className="arrow-left2" style={{marginLeft:240, marginTop:-50}}></div>
            </li>
          </ul>
        </div>
    )
  }
}
