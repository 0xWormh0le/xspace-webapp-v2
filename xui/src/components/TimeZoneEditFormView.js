import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TimezonePicker from 'react-timezone';
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'

import TextInput from '../lib/TextInput'


export default class TimeZonePageView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {isEditingTimeZone: false};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.setState({isEditingTimeZone: !this.state.isEditingTimeZone})
  }

  render() {

    const errors = this.props.errors || {}
    if(this.state.isEditingTimeZone){
      return (
        <div>
          <div className="row">
            <div className="col-md-9">
              <h3>Time Zone <i className="fa fa-question-circle editquestion-mark"></i></h3>
              <p>Set your preferred time zone. For notifications, activities emails your current time zone is Set to:(UTC-06:00)central time(US and Canada) </p>
              <label htmlFor="sel1" className="edit-label">Select list (select one):</label>

               <TimezonePicker className="form-control edit-accinbox" id="sel1"
                defaultValue="Asia/Yerevan"
                onChange={timezone => console.log('New Timezone Selected:', timezone)}
                inputProps={{
                  placeholder: 'Select Timezone...',
                  name: 'timezone',
                }}
              />
            </div>
            <div className="downarrow-div myacc-downarrow" onClick={this.handleClick}>
              <i className="fa fa-angle-up edit-downarrow"></i>
            </div>
            <div><input type="submit" value="CHANGE TIME" className="myacc-bluebtnforth"/></div>
          </div>
        </div>
      )
    }else{
      return (
        <div>
          <div className="row">
            <div className="col-md-9">
                <h3>Time Zone <i className="fa fa-question-circle editquestion-mark"></i></h3>
                <p>Set your preferred time zone For notifications, activities emails your current time zone is Set to:(UTC-06:00)central time(US and Canada) </p>
            </div>
            <div className="downarrow-div myacc-downarrow" onClick={this.handleClick}>
              <i className="fa fa-angle-down edit-downarrow"></i>
            </div>
          </div>
        </div>
      )
    }
  }
}
