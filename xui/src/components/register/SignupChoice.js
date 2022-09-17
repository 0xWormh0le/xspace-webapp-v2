import React, { Component } from 'react';
import { Input, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import axios from 'axios';

export default class NewOrExisting extends Component {

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
    let {email, password, confirm, fname, lname, enabled, companyName, industry, companyRole, signupToken} = this.state;
    this.setState({'enabled': false});
    if (password != confirm ) {
      this.setState({'enabled': true, 'error':'Passwords do not match. Please re-type your password.'})
    } else {

      if(fname == ''){
        this.setState({'enabled': true, 'error':'First Name cannot be blank.'})
      }else if(lname == ''){
        this.setState({'enabled': true, 'error':'Last Name cannot be blank.'})
      }else if(companyName == ''){
        this.setState({'enabled': true, 'error':'Company Name cannot be blank.'})
      }else if(industry == ''){
        this.setState({'enabled': true, 'error':'Industry cannot be blank.'})
      }else if(companyRole == ''){
        this.setState({'enabled': true, 'error':'Company Role cannot be blank.'})
      }else if (email == "") {
        this.setState({'enabled': true, 'error':'Email address cannot be blank.'})
      }else if (password.length < 7) {
        this.setState({'enabled': true, 'error':'Your password must have at least 8 characters.'})
      }else if (password.length < 7) {
        this.setState({'enabled': true, 'error':'Your password must have at least 8 characters.'})
      }
      else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        this.setState({'enabled': true, 'error':'Your password must have at least one number.'})
      }
      else{
        this.props.onSubmit(email, password, fname, lname, companyName, industry, companyRole, signupToken).then(res => {
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
      <div>
        <center>
            <a onClick={ this.props.nextStep } className="btn btn-lg btn-primary">Create A New Account</a>
            <br />
            <a onClick={ this.props.nextStepTwo } className="btn btn-lg btn-green">Join an Existing Account</a>
        </center>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>

    );
  }
}
