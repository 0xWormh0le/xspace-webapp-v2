import React, { Component } from 'react';
import { Input, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import axios from 'axios';

export default class PasswordFields extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modal: true,
      password: '',
      companyName: '',
      confirm: '',
      fname: '',
      lname: '',
      error: '',
      res:'',
      enabled: true
    }
    this.registerAccount = this.registerAccount.bind(this);
    this.inputPasswordChange = this.inputPasswordChange.bind(this);
    this.inputConfirmChange = this.inputConfirmChange.bind(this);

  }

  componentDidMount() {
    this.setState({'signupToken':this.props.signupToken});
  }

  registerAccount(evt) {
    let {password, confirm, signupToken } = this.state;
    let {email, fname, lname, } = this.props.fieldValues;
    this.setState({'enabled': false});

    if(password != confirm){
        this.setState({'enabled': true, 'error':'Passwords must match'})
    }else if (password.length < 7) {
        this.setState({'enabled': true, 'error':'Your password must have at least 8 characters.'})
    }else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        this.setState({'enabled': true, 'error':'Your password must have at least one number.'})
    }

    else{
        //this.nextStep();
        this.setState({'enabled': true});
        this.props.onSubSubmit(email, fname, lname, this.state.password, signupToken).then(res => {
            //id is passed through promise
            console.log(res);
            this.props.activatedModal();
            setTimeout(function () {
               window.location.href = "/"; //will redirect to your blog page (an ex: blog.html)
            }, 2500); //will call the function after 2 secs.


        }).catch(err => {
        //if the payload email had an error
        console.error(err)
        if (err) {
            this.props.errorModal(err);
            this.setState({'enabled': true, 'error':err})
        } else {
            this.props.errorModal('This e-mail is already taken. Please enter another e-mail or contact support@xspaceapp.com for more details.');
            this.setState({'enabled': true, 'error':'This e-mail is already taken. Please enter another e-mail or contact support@xspaceapp.com for more details.'});
        }
        });
    }

  }


  toggle(event) {
    try{
      //console.log(event.currentTarget);
      if(event.currentTarget.getAttribute('name')=="close"){
        //this.props.confirmStep(this.state.res);
        var host = window.location.href;
        host = host.split('/');
        window.location.href = host[0];
      }
      if(event.currentTarget.getAttribute('class')=="close"){
        this.setState({
          modal: !this.state.modal
        });
      }
    }catch(err){
      this.setState({
        modal: !this.state.modal
      });
    }

  }

  inputPasswordChange(evt) {
    this.setState({"password": evt.target.value})
  }

  inputConfirmChange(evt) {
    this.setState({"confirm": evt.target.value})
  }



  render() {
    const errors = this.props.errors || {}
    let { error, enabled} = this.state;
    let errorView = (<div></div>)
    let enabledView = (<a className="btn btn-lg btn-primary">Please wait...</a>)
    if (error) {
      errorView = (<div className="animated fadeIn"><br /><p style={{color: 'red'}}>{error}</p><br /></div>);
    }

    //if the submit button is enabled
    if (enabled) {
      enabledView = (<a onClick={ this.registerAccount } className="btn btn-lg btn-primary">Activate</a>)
    }

    return (
      <div className="animated fadeInLeft">
        <h2>Step 2: <b>Enter Your Credentials</b></h2>
        <p>Enter your desired account login credentials to complete your account setup.</p>
        {errorView}
        <div className="row">

          <div className="col-sm-12">
            <div><Input label="Type your password" onChange={this.inputPasswordChange} value={this.state.password} icon="lock" group type="password" validate/>
            <Input label="Confirm your password" onChange={this.inputConfirmChange} value={this.state.confirm} icon="lock" group type="password" validate/></div>
          </div>

          <p>By activating your account, you hereby agree to the </p><a href="https://xspaceapp.com/terms-of-service/">XSPACE Web App Terms of Service.</a>


        </div>
        <div className="text-right">
          {enabledView}
          <br />
          <br />
        </div>
      </div>
    );
  }
}
