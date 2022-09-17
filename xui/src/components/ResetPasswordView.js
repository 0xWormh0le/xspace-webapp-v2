import React, { Component } from 'react'
import axios from 'axios';
import { Redirect } from 'react-router'

import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import { API_ROOT } from '../index';
import Loader from 'react-loader';


export default class ResetPasswordView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      status: 'Please wait...',
      isSuccess: false,
      redirect: false,
      uid: '',
      token: '',
      id: '',
      modal: false,
      message: '',
      title: '',
      messageno: 0,
      response: ''
    }

    this.toggle = this.toggle.bind(this);
    this.checkToken = this.checkToken.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.validate = this.validate.bind(this);

    var url = this.props.location;
    url = url['pathname'].split("/");

    //alert(url[3]);

    var uid = '';
    for (let i = 0; i < url[2].length; i++) {
      if (i < 4) {
        uid += (url[2][i]);
      }

    }

    var token = url[3];
    //this.setState({uid:uid, token:token});
    this.checkToken(uid, token);
  }

  checkToken(uid, token) {

    try {
      fetch(API_ROOT + '/api/activatepassword/' + uid + '/' + token + '/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      }).then(res => res.json())
        .catch(error => { console.error('Error:', error); })
        .then(response => {
          try {
            //Reset Password
            //console.log(response);
            if (response['id']) {
              if (response['status'] == true) {
                this.setState({ 'status': 'Reset Password', 'isSuccess': true });
                //var maindiv = document.getElementById("maindiv").innerHtml;
                var resetpasshtml = '<form className="form-signin" id="changepassword" method="post" >' +
                  '<div className="row" style="margin:4px 0px;">' +
                  '<div className="col-md-12">' +
                  '<input type="password" id="password" name="Password" className="form-control" placeholder="Enter new password" required />' +
                  '</div>' +
                  '</div>' +
                  '<div className="row" style="margin:4px 0px;">' +
                  '<div className="col-md-12">' +
                  '<input type="password" id="repassword" name="Password" className="form-control" placeholder="Confirm new password" required />' +
                  '</div>' +
                  '</div>' +
                  '<div className="row" style="margin:5px 0px;">' +
                  '<div className="col-md-12">' +
                  '<button className="btn btn-lg btn-primary btn-block" type="submit">Change Password</button>' +
                  '</div>' +
                  '</div></form>';

                document.getElementById("maindiv").innerHTML += resetpasshtml;
                this.setState({ 'response': response });
                document.getElementById("changepassword").addEventListener("submit", this.changePassword);
              } else {
                this.setState({ 'status': 'This token has been expired.', 'isSuccess': true });
              }
            } else {
              this.setState({ 'status': 'Invalid or expired reset token, please try again.', 'isSuccess': true });
            }

          } catch (err) { }
        });
    }
    catch (err) { }
  }

  validate(Password, confirmPassword) {
    if (confirmPassword !== Password) {
      this.setState({
        'message': "Password don't match.",
        'title': "Error Message",
        'messageno': 2
      });
      this.toggle();
      return false;
    }else if (Password === '' || confirmPassword === '') {
        this.setState({
          'message': "Your password fields cannot be blank.",
          'title': "Error Message",
          'messageno': 2
        });
        this.toggle();
        return false;
        //this.setState({responseMessage:'Your password must have at least 8 characters.'});
    }
    else if (confirmPassword.length < 7) {
        this.setState({
          'message': "Your password must have at least 8 characters.",
          'title': "Error Message",
          'messageno': 2
        });
        this.toggle();
        return false;
        //this.setState({responseMessage:'Your password must have at least 8 characters.'});
    }
    else if (!/\d/.test(confirmPassword) || !/[a-zA-Z]/.test(confirmPassword)) {
        //this.setState({responseMessage:'Your password must have at least one number.'});
        this.setState({
          'message': "Your password must have at least one number and one letter.",
          'title': "Error Message",
          'messageno': 2
        });
        this.toggle();
        return false;
    }
    else{
        return true;
    }

  }

  changePassword(event) {
    event.preventDefault();

    var password = document.getElementById('password').value;
    var repassword = document.getElementById('repassword').value;
    //alert(password+'\n'+repassword);

    var isValidated = this.validate(password, repassword);

    if ( isValidated == true ){
          fetch(API_ROOT + '/api/resetchangepassword/', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'id': this.state.response["id"], 'password': repassword })
          }).then(res => res.json())
            .catch(error => { console.error('Error:', error); })
            .then(response => {
              if (response['result'] == 1) {
                //alert('You have successfully reset your password.');
                this.toggle();

                this.setState({
                  'message': "You have successfully reset your password.",
                  'title': "Success Message",
                  'messageno': 1,
                  'isSuccess': true
                });

              }
              else {
                this.toggle();
                //alert('something went wrong please try again after some time.');
                this.setState({
                  'message': "Something went wrong please try again after some time.",
                  'title': "Error Message",
                  'messageno': 2
                });

              }
              //window.location = '/#/'
            });

    }

  }

  toggle(event) {
    this.setState({
          modal: !this.state.modal
    });
  }

  render() {
    const errors = this.props.errors || {}

    return (
      <div className="container" >
        <div className="row">
          <div className="col-md-12" style={{ paddingTop: 90 }}>

            <center><img src="/media/img/logo.png" width="50%" alt="prismalogo" /></center>
          </div>
        </div>
        <br />
        <br />
        <div className="row">
          <div className="col-md-3">
          </div>
          <div className="col-md-6" id="maindiv">
            <center><h5>{this.state.status}</h5></center>
            <Loader loaded={this.state.isSuccess} lines={13} length={20} width={10} radius={30}
              corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
              trail={60} shadow={false} hwaccel={false} className="spinner"
              top="40%" left="50%" scale={0.70}
              loadedClassName="loadedContent" />

          </div>
          <Modal isOpen={this.state.modal} toggle={this.toggle} style={{ top: '25%' }} size="lg">
            <ModalHeader toggle={this.toggle}>{this.state.title}</ModalHeader>
            <ModalBody>
              <div>{this.state.message}</div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" name="close" onClick={this.toggle}>Close</Button>{' '}
            </ModalFooter>
          </Modal>

        </div>
      </div>
    )
  }
}
