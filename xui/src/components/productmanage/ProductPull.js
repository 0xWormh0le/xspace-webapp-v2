import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Container, Collapse, NavItem, NavLink} from 'mdbreact'

export default class ProductPull extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
     <React.Fragment>
        <div className="pullProductBox">
        </div>
        <div className="pullProductBoxFooter">
            <Button className="btn btn-blue Ripple-parent ">Add Products To Recieve Updates</Button>
            <Button className="btn btn-green Ripple-parent pullProductBoxFooterBtn-right" >Pull from Store</Button>
        </div>
      </React.Fragment>
    )
  }
}
