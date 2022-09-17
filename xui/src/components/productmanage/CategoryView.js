import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'

export default class LeftSideMenu extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="col-md-3">
        <div className="account-left myacc-left">
          <ul className="list-unstyled">
            <li key={1} className="left-menu-bar-active">
              <img src="/media/account-icon.png" alt="prismalogo" />
              <Link to="/manage/" className="menu-font" style={{marginTop:20}}>MY PRODUCT LIBRARY</Link>
              <div className="arrow-left"></div>
            </li>
            <li key={2} className="left-menu-bar-inactive">
              <img src="/media/apps-icon.png" alt="apps icon" className="apps-icon" />
              <Link to="/manage/updates/" className="menu-font">PRODUCT UPDATES</Link>
            </li>
            <li key={3} className="left-menu-bar-inactive">
              <img src="/media/product-icon.png" alt="product icon" className="product-icon"/>
              <Link to="#" className="menu-font">MY ORDERS</Link>
            </li>

          </ul>
        </div>
      </div>
    )
  }
}
