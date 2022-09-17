import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'

import TextInput from '../lib/TextInput'


export default class UserNamePageView extends Component {
    
  constructor(props, context) {
    super(props, context);
    this.state = {isEditingUserName: false};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
      this.setState({isEditingUserName: !this.state.isEditingUserName})
    }

  render() {

    const errors = this.props.errors || {}
    if(this.state.isEditingUserName){
      return (
        <div>
          <div className="row">
              <div className="col-md-9">
                <h3>Username <i className="fa fa-question-circle editquestion-mark"></i></h3>
                  <p>Change your username here. Your current username is c.richards144</p>
                  <label htmlFor="usr" className="edit-label">New username</label>
                  <input type="text" className="form-control edit-accinbox" id="usr" placeholder="New username"/>
              </div>
              <div className="downarrow-div myacc-downarrow " onClick={this.handleClick}>
                <i className="fa fa-angle-up edit-downarrow"></i>
              </div>
              <div><input type="submit" value="CHANGE USERNAME" style={{marginTop: -55}} className="myacc-bluebtnfirst"/></div>
          </div>
         </div>
      )
    }else{
      return (
        <div>
          <div className="row">
            <div className="col-md-9">
              <h3>Username <i className="fa fa-question-circle editquestion-mark"></i></h3>
              <p>Change your username here. Your current username is c.richards144 </p>
            </div>
            <div className="downarrow-div myacc-downarrow" onClick={this.handleClick}>
              <i className="fa fa-angle-down edit-downarrow "></i>
            </div>
          </div>
        </div>
      )
    }
  }
}
