import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'
import { charOnly } from '../util/RegexTest'
import  Loader from 'react-loader';
import TextInput from '../lib/TextInput'

import { API_ROOT } from '../index';

export default class UserFullNamePageView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isEditingFullName: false,
      fullName: '',
      isSuccess: true,
      errors: {},
      'userData': []
    };
    this.toggleForm = this.toggleForm.bind(this);
    this.UpdateFullName = this.UpdateFullName.bind(this);
    this.UpdateName = this.UpdateName.bind(this);
  }

  handleInputChange = (event) => {
    const target = event.target,
        value = target.type ===
        'checkbox' ? target.checked : target.value,
      name = target.name
      this.state.errors[name] = ''
    this.setState({
        [name]: value
    });
  }

  componentDidMount() {
    
  }

  toggleForm(){
    this.setState({isEditingFullName: !this.state.isEditingFullName})
  }

   /*Form Validation*/
  handleValidation(){
    let { fullName} = this.state;
    let errors = {};
    let formIsValid = true;
    if(!fullName){
      errors['fullName'] = "This field may not be blank.";
      formIsValid = false
    }else if(!charOnly(fullName)){
      errors['fullName'] = "Full name accepts only alphabetic characters";
      formIsValid = false
    }
    this.setState({errors: errors});
    return formIsValid;
  }

  UpdateName(){
    let{ fullName } = this.state
    const userData = {}
    userData['first_name'] = fullName.split(" ")[0] || ''
    userData['last_name'] = fullName.split(" ")[1] || ''
    this.props.updateFullName(userData)
  }

  /*Update user fullname*/
  UpdateFullName(){
    let{ fullName } = this.state
    if(this.handleValidation()){
      this.setState({isSuccess: false});
      const firstName = fullName.split(" ")[0] || ''
      const lastName = fullName.split(" ")[1] || ''

      fetch(API_ROOT + '/api/user_fullname/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'first_name':firstName,
          'last_name':lastName,
          'userId':this.props.userId
        })
      }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
          if(response[0]=="update error"){
            alert("Somthing went wrong, unable to update full name. Please try again or contact support@xspaceapp.com");
          }else{
            this.getFullName();
          }
      });
    }
  }

  render() {

    const errors = this.state.errors || {}
    let {userInfo} = this.props
    if(this.state.isEditingFullName){
      return (
        <div>
          <div className="row">
            <div className="col-md-9">
              <h3>Full Name <i className="fa fa-question-circle editquestion-mark"></i></h3>
              <p className="user-full-name">Change your full name here.</p>
              <span className="user-full-name"> Your current full name is: </span><span className="change-profile-pic">{userInfo.fullName}</span>
              <p></p>
              <label htmlFor="full" className="input-label">New Full Name</label>
              <TextInput className="form-control edit-accinbox" id="fullName" name="fullName" placeholder="New Full Name" error={errors.fullName} onChange={this.handleInputChange} />
            </div>
            <Loader loaded={this.state.isSuccess} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="600px" left="40%" scale={1.00}
                    loadedClassName="loadedContent" />
            <div className="downarrow-div myacc-downarrow hoverable" onClick={this.toggleForm}>
              <i className="fa fa-angle-up edit-downarrow"></i>
            </div>
            <div><input type="submit" value="MAKE CHANGES" name="changeName" onClick={this.UpdateName} style={{position:'relative'}} className="btn btn-primary"/></div>
          </div>
         </div>
      )
    }else{
      return (
        <div>
          <div className="row">
            <div className="col-md-9">
              <h3>Full Name <i className="fa fa-question-circle editquestion-mark"></i></h3>
              <p className="user-full-name">Change your full name here.</p>
              <span className="user-full-name"> Your current full name is: </span><span className="change-profile-pic">{userInfo.fullName}</span>
            </div>
            <div className="downarrow-div myacc-downarrow hoverable" onClick={this.toggleForm}>
              <i className="fa fa-angle-down edit-downarrow "></i>
            </div>
          </div>
        </div>
      )
    }
  }
}
