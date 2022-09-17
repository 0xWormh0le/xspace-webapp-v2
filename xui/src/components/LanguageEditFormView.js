import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TimezonePicker from 'react-timezone';
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'

import TextInput from '../lib/TextInput'


export default class LanguagePageView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {isEditingLanguage: false};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
      this.setState({isEditingLanguage: !this.state.isEditingLanguage})
    }

  render() {

    const errors = this.props.errors || {}
    if(this.state.isEditingLanguage){
      return (
        <div>
          <div className="row">
            <div className="col-md-9">
              <h3>Language <i className="fa fa-question-circle editquestion-mark"/></h3>
              <p>Choose your perferred language For XSPACE. Your language is currently set to:English(US)</p>
              <label htmlFor="sel1" className="edit-label">Select list (select one):</label>
              <select className="form-control edit-accinbox" id="sel1" value={this.state.value} onChange={this.handleChange}>
                <option value="English_us">English(U.S)</option>
                <option value="English_uk">English(U.K)</option>
              </select>
            </div>
            <div className="downarrow-div myacc-downarrow" onClick={this.handleClick}>
              <i className="fa fa-angle-up edit-downarrow"/>
            </div>
            <div><input type="submit" value="CHANGE LANGUAGE" className="myacc-bluebtn"/></div>
          </div>
        </div>
      )
    }else{
      return (
        <div>
          <div className="row">
              <div className="col-md-9">
                  <h3>Language <i className="fa fa-question-circle editquestion-mark"/></h3>
                  <p>Choose your perferred language For XSPACE. Your language is currently set to:English(US)</p>
              </div>
              <div className=" downarrow-div myacc-downarrow" onClick={this.handleClick}>
                <i className="fa fa-angle-down edit-downarrow"/>
              </div>
          </div>
        </div>
      )
    }
  }
}
