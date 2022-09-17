import React, {Component} from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'
import  Loader from 'react-loader';
import TextInput from '../lib/TextInput'

import { API_ROOT } from '../index';
import { DetailBoxWrapper } from './UserEmailEditFormView'
import commentImg from '../assets/img/comment.png'
import StyledTooltip from '../lib/tooltip'

export default class UserPasswordPageView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isEditingPassword: false,
      newPassword: '',
      currentPassword: '',
      confirmPassword: '',
      isSuccess: true,
      responseMessage: '',
      errors: {}
    };
    this.toggleForm = this.toggleForm.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
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

  toggleForm(){
    this.setState({isEditingPassword: !this.state.isEditingPassword})
  }

   /*Form Validation*/
  handleValidation(){
    let { newPassword, currentPassword, confirmPassword} = this.state;
    let errors = {};
    let formIsValid = true;
    if(!newPassword && !currentPassword && !confirmPassword){
      errors['newPassword'] = "This field may not be blank.";
      errors['currentPassword'] = "This field may not be blank.";
      errors['confirmPassword'] = "This field may not be blank.";
      formIsValid = false
    }else if(!newPassword){
      errors['newPassword'] = "This field may not be blank.";
      formIsValid = false
    }else if(!currentPassword){
      errors['currentPassword'] = "This field may not be blank.";
      formIsValid = false
    }else if(!confirmPassword){
      errors['confirmPassword'] = "This field may not be blank.";
      formIsValid = false
    }else if( confirmPassword !== newPassword){
      this.setState({responseMessage: 'New password and confirm password do not match.'});
      formIsValid = false
    }else 
    if (confirmPassword.length < 7) {
      this.setState({responseMessage:'Your password must have at least 8 characters.'});
      formIsValid = false
    }else if (confirmPassword.length < 7) {
      this.setState({responseMessage:'Your password must have at least 8 characters.'});
      formIsValid = false
    }
    else if (!/\d/.test(confirmPassword) || !/[a-zA-Z]/.test(confirmPassword)) {
      this.setState({responseMessage:'Your password must have at least one number.'});
      formIsValid = false
    }
    this.setState({errors: errors});
    return formIsValid;
  }


  updatePassword(){
    //console.log(this.props.userId);
    let userId = this.props.userId;
    let {currentPassword, newPassword, confirmPassword} = this.state || {}
    if(this.handleValidation()){
      this.setState({isSuccess: false});
      fetch(API_ROOT + '/api/user_pass/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'userId':userId,
          'username':newPassword,
          'password':currentPassword          
        })
      })/* .then(res => res.json()) */
      .catch(error => {
        console.log('Error:', error);
      }).then(response => {
        console.log(response);
        if(response.status == 400){ //"Incorrect credentials please try again."
          this.setState({responseMessage: 'Incorrect credentials, please try again.'});
          //alert("Password update failed. Please try again or contact support@xspaceapp.com");
          this.setState({isSuccess: true});
        }else{
          this.setState({responseMessage: 'Password updated successfully.'});
          //alert("Password updated successfully. Click OK to continue.");
          this.setState({isSuccess: true});
        }
        //localStorage.clear();
        //window.location.reload();
      },err=>{
      
      });
    }
  }

  render() {

    const errors = this.state.errors || {}
    return (
      <DetailBoxWrapper>
        <input type="submit" value="Update" onClick={this.updatePassword} name="passwordUpdate"  className='submit-button'/>
        <div className='box-title'>
          <h3>Password</h3>
          <StyledTooltip txt={'Enter Your Current Password.'}>
            <img src={commentImg} alt='' />
          </StyledTooltip>          
        </div>
        <p>Update your password here.</p>
        <div className='box-body'>
          <div>
            <label htmlFor="usr" className="input-label">Enter Your Current Password</label>
            <TextInput type="password" id="currentPassword" name="currentPassword" placeholder="Current Password" error={errors.currentPassword} onChange={this.handleInputChange} />
          </div>
          <div>
            <label htmlFor="usr" className="input-label">Enter Your New Password</label>
            <TextInput type="password" id="newPassword" name="newPassword" placeholder="New Password" error={errors.newPassword} onChange={this.handleInputChange} />
          </div>
          <div>
            <label htmlFor="usr" className="input-label">Confirm Your New Password</label>
            <TextInput type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm New Password" error={errors.confirmPassword} onChange={this.handleInputChange} />
          </div>
        </div>
        <Loader loaded={this.state.isSuccess} lines={13} length={20} width={10} radius={30}
          corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
          trail={60} shadow={false} hwaccel={false} className="spinner"
          zIndex={2e9} top="455px" left="40%" scale={1.00}
          loadedClassName="loadedContent"
        />
        <span className="setting-message">{this.state.responseMessage}</span>
      </DetailBoxWrapper>
    )
  }
}
