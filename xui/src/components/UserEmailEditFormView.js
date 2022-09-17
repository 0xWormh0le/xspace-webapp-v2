import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink } from 'mdbreact'
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import { testEmail } from '../util/RegexTest'
import Loader from 'react-loader';
import TextInput from '../lib/TextInput'
import auth from '../reducers/auth';
import $ from 'jquery';
import { API_ROOT } from '../index';
import { DetailBox } from './MyAccountView'
import commentImg from '../assets/img/comment.png'
import StyledTooltip from '../lib/tooltip'

export const DetailBoxWrapper = styled(DetailBox)`
  position: relative;
  .submit-button {
    position: absolute;
    top: 15px;
    right: 0;
    font-size: 14px;
    border: none;
    color: #333333;
    font-weight: bold;
    line-height: 20px;
    width: 133px;
    height: 38px;
    border-radius: 19px;
    z-index: 1;
    border: 2px solid #F4F5FA;
    :hover {
      background-color: #00A3FF;
      color: white;
      cursor: pointer;
      border: none;
    }
  }
  p {
    margin-bottom: 15px;
    font-size: 14px;
    color: #000000;
    line-height: 20px;
    opacity: .5;
  }
  .box-body {
    div {
      flex: 1;
      label {
        font-size: 12px;
        color: #333330;
        line-height: 20px;
      }
    }
  }
`

export default class UserEmailPageView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      modalDialog: false,
      userInput: false,
      isEditingEmail: false,
      emailId: '',
      password: '',
      isSuccess: true,
      responseMessage: '',
      errors: {},
      'userData': []
    };
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

  toggleForm = () => {
    this.setState({ isEditingEmail: !this.state.isEditingEmail })
  }

  /*Form Validation*/
  handleValidation = () => {
    let { emailId, password } = this.state;
    let errors = {};
    let formIsValid = true;
    if (!emailId && !password) {
      errors['emailId'] = "This field may not be blank.";
      errors['password'] = "This field may not be blank.";
      formIsValid = false
    } else if (!emailId) {
      errors['emailId'] = "This field may not be blank.";
      formIsValid = false
    } else if (!password) {
      errors['password'] = "This field may not be blank.";
      formIsValid = false
    } else if (!testEmail(emailId)) {
      errors['emailId'] = "Please enter in a valid e-mail address";
      formIsValid = false
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  updateEmail = () => {
    if (this.handleValidation()) {
      let { emailId, password } = this.state
      const userData = {}
      userData['email'] = emailId || ''
      userData['password'] = password || ''
      userData['emailUpdate'] = 'true'
      
      this.props.updateEmail(userData);

      
    } else {
      //this.setState({ isEditingEmail: !this.state.isEditingEmail })
    }
  }

  //this.updateEmail
  opencloseFolderDialog = () => {
    if(!this.state.modalDialog) {
      if (!this.handleValidation())
        return
    }
    this.setState({
      modalDialog: !this.state.modalDialog
    })
  }

  handleYes = () => {
    this.updateEmail()
  }
  /*Update user emailId*/
  /* updateUserEmail(e){
    e.preventDefault();
    let id = 367

    if(this.handleValidation()){
      this.setState({isSuccess: false});
      fetch(API_ROOT + '/api/user_email/'+id+'/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //'username':username,
          'email': this.state.emailId,
          'password': this.state.password
        })
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
          this.setState({isSuccess: true});
          try{
              if(response[0]=="Incorrect credentials please try again."){
                this.setState({responseMessage: 'Incorrect credentials please try again.'});
              }else{
                this.setState({
                  userData:response,
                  responseMessage: 'Email address Updated Successfully.'
                });
		            document.getElementById('pass').value='';
                document.getElementById('usr').value='';
                //alert("Email ID Updated Successfully\nClick ok to Sign out");
                //localStorage.clear();
                //window.location.reload();
              }
          }catch(err){
            console.error(err)
          }
      });
    }
    else{
      this.setState({isEditingEmail: !this.state.isEditingEmail})
    }

  } */

  render() {
    let { userInfo } = this.props
    const errors = this.state.errors || {}

    let confirmDilog = (
      <Modal isOpen={this.state.modalDialog} onRequestClose={this.opencloseFolderDialog} size="lg" >
        <ModalHeader style={{ margin: 'auto' }}>Confirm Action</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-sm-12">
              <h4>Do you really want to Change you Email ID to {$('#usr').val()}</h4>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <label style={{ marginRight: '20%' }} id="msg"></label>
          <Button color="green" style={{ width: '80px' }} onClick={this.handleYes} value="Yes">Yes</Button>
          <Button color="red" style={{ width: '80px' }} onClick={this.opencloseFolderDialog} value="No">No</Button>
        </ModalFooter>
      </Modal>
    )
    return (
      <DetailBoxWrapper>
        {confirmDilog}
        <input type="submit" onClick={this.opencloseFolderDialog} name="changeEmail" value="Update" className='submit-button'/>
        <div className='box-title'>
          <h3>Email Address</h3>
          <StyledTooltip txt={'Change your email here.'}>
            <img src={commentImg} alt=''/>
          </StyledTooltip>
        </div>
        <p>Change your email here. Your current email is {userInfo.email}</p>
        <div className='box-body'>
          <TextInput type="password" label='Enter Your Current Password' id="pass" name="password" placeholder="Current Password" error={errors.password} onChange={this.handleInputChange} />
          <TextInput type="email" id="usr" name="emailId" label='New Email Address' placeholder="New Email Address" error={errors.emailId} onChange={this.handleInputChange} />
        </div>
        <Loader loaded={this.state.isSuccess} lines={13} length={20} width={10} radius={30}
          corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
          trail={60} shadow={false} hwaccel={false} className="spinner"
          zIndex={2e9} top="348px" left="40%" scale={1.00}
          loadedClassName="loadedContent"
        />
        <span className="setting-message">{this.state.responseMessage}</span>
      </DetailBoxWrapper>
    )
  }
}
