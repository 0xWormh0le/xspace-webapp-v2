import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'

import TextInput from '../lib/TextInput'


export default class TwoFactorPageView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {isEditingAuth: false};
    this.toggleForm = this.toggleForm.bind(this);
  }

  toggleForm(){
    this.setState({isEditingAuth: !this.state.isEditingAuth})
  }

  render() {

    const errors = this.props.errors || {}
    if(this.state.isEditingAuth){
      return (
        <div>
          <div className="row">
            <div className="col-md-9">
              <h3>Two-Factor Authentication <i className="fa fa-question-circle editquestion-mark"></i></h3>
              <p>Enable or disable two-factor authentication for your account. You currently have two-factor auth disabled.</p>
              <div><p>You must enter your current password to switch two-factor auth on and off</p></div>
              <div><p className="turnon-offtext">TURN ON/<br/>TURN OFF</p>
                <label className="switch">
                <input type="checkbox" checked/>
                <span className="slider"></span>
                </label><span className="authfact-span">TWO FACTOR AUTH IS CURRENTLY<br/><b>DISABLED</b></span>
              </div>
            </div>
            <div className="downarrow-div myacc-downarrow hoverable">
              <Link to="#" className="toggleClass" onClick={this.toggleForm}><i className="fa fa-angle-up edit-downarrow"></i></Link>
            </div>
          </div>
        </div>
      )
    }else{
      return (
        <div>
          <div className="row">
              <div className="col-md-9">
                  <h3>Two-Factor Authentication <i className="fa fa-question-circle editquestion-mark "></i></h3>
                  <p>Enable or disable two-factor authentication for your account. You currently have two-factor auth disabled.</p>
              </div>
              <div className=" downarrow-div myacc-downarrow hoverable">
                <Link to="#" className="toggleClass" onClick={this.toggleForm}><i className="fa fa-angle-down edit-downarrow "></i></Link>
              </div>
          </div>
        </div>
      )
    }
  }
}
