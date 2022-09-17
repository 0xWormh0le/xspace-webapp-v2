import React, { Component } from 'react';
import { Input, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import axios from 'axios';

export default class AccountFields extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modal: true,
      res:'',
      email: '',
      password: '',
      companyName: '',
      industry: '',
      companyRole: '',
      signupToken: '',
      confirm: '',
      fname: '',
      lname: '',
      error: '',
      enabled: true
    }
    this.registerAccount = this.registerAccount.bind(this);
    this.inputEmailChange = this.inputEmailChange.bind(this);

    this.inputIndustryChange = this.inputIndustryChange.bind(this);
    this.inputCompanyNameChange = this.inputCompanyNameChange.bind(this);
    this.inputCompanyRoleChange = this.inputCompanyRoleChange.bind(this);

    this.inputPasswordChange = this.inputPasswordChange.bind(this);
    this.inputConfirmChange = this.inputConfirmChange.bind(this);
    this.inputFirstChange = this.inputFirstChange.bind(this);
    this.inputLastChange = this.inputLastChange.bind(this);
  }

  componentDidMount() {
    var reg = window.location.href;
    reg = reg.split('/');
    //console.log(reg[5]);
    if (reg.length == 6) {
      try {
        this.setState({
            'signupToken': reg[5],
          });
        reg = decodeURIComponent(atob(reg[5])).split('|');
        if (reg.length == 4) {
          console.log(reg);
          this.setState({
            'email':reg[0],
            'fname':reg[1],
            'lname':reg[2],
            'companyName':reg[3],
          });
        } else {
          console.log('invalid Token');
        }
      }
      catch (err) {
        console.log('invalid Token');
      }


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

  registerAccount(evt) {
    let {email, fname, lname, enabled, signupToken} = this.state;
    this.setState({'enabled': false});

    if(fname == ''){
        this.setState({'enabled': true, 'error':'First Name cannot be blank.'})
    }else if(lname == ''){
        this.setState({'enabled': true, 'error':'Last Name cannot be blank.'})
    }else if (email == "") {
        this.setState({'enabled': true, 'error':'Email address cannot be blank.'})
    }
    else{
        this.props.onSubmit(email, fname, lname, signupToken).then(res => {
        //id is passed through promise
        this.setState({'res':res});
        this.props.toggle();
    }).catch(err => {
    //if the payload email had an error
    console.error(err)
    if (err) {
        this.setState({'enabled': true, 'error':err})
    } else {
        this.setState({'enabled': true, 'error':'This e-mail is already taken. Please enter another e-mail or contact support@xspaceapp.com for more details.'});
    }
    });
    }

  }

  inputIndustryChange(evt) {
    this.setState({"industry": evt.target.value});
  }

  inputCompanyNameChange(evt) {
    this.setState({"companyName": evt.target.value});
  }

  inputCompanyRoleChange(evt) {
    this.setState({"companyRole": evt.target.value});
  }

  inputEmailChange(evt) {
    this.setState({"email": evt.target.value})
  }

  inputPasswordChange(evt) {
    this.setState({"password": evt.target.value})
  }

  inputConfirmChange(evt) {
    this.setState({"confirm": evt.target.value})
  }

  inputFirstChange(evt) {
    this.setState({"fname": evt.target.value})
  }

  inputLastChange(evt) {
    this.setState({"lname": evt.target.value})
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
        <h2>Step 1: <b>Reserve Your Account</b></h2>
        {errorView}
        <div className="row">
          <div className="col-sm-6">
            <Input value={this.state.fname} onChange={this.inputFirstChange} label="First Name" group type="text" validate error="wrong" success="right"/>
          </div>
          <div className="col-sm-6">
            <Input value={this.state.lname} onChange={this.inputLastChange} label="Last Name" group type="text" validate error="wrong" success="right"/>
          </div>
        </div>
        <Input label="Type Your Email Address" onChange={this.inputEmailChange} value={this.state.email} icon="envelope" group type="email" validate error="wrong" success="right"/>

        <div className="text-right">
          {enabledView}
          <br />
          <br />
        </div>
      </div>
    );
  }
}
