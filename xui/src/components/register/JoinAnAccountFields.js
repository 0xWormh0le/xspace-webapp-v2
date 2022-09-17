import React, { Component } from 'react';
import { Input, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import axios from 'axios';
import { API_ROOT } from '../../index';

export default class JoinAnAccountFields extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modal: true,
      res:'',
      email: '',
      error: '',
      enabled: true
    }
    this.registerAccount = this.registerAccount.bind(this);
    this.joinExistingAccount = this.joinExistingAccount.bind(this);
    this.inputEmailChange = this.inputEmailChange.bind(this);
  }

  componentDidMount() {

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

  joinExistingAccount(){
    try{
    	fetch(API_ROOT + '/api/join_account/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'email':this.state.email})
      }).then(res => res.json())
      .catch(error => {console.error('Error:', error);})
      .then(response => {
        //console.log(response);
      	if(response['resent']==true){
      	    this.props.successModal();
      	    this.setState({'enabled': true});

      		//alert("Your account has been activated.\n Please login.");
      		//this.setState({status:'Your account has been activated.'});
            //this.setState({id:response['id']});
            //this.redirectUrl();

      	}else{
      	    console.log(response['message'])
      	    this.props.errorModal(response['message']);
      	    this.setState({'enabled': true});
      	    //this.setState({"statusHeader": "An Error has Occurred"});
      	    //this.toggle();
      		//alert("Invalid token unable to activate your account");
      		//this.setState({status:"Invalid activation token, we are unable to activate your account, please contact customer support."});

          //document.location.href = '/register/';
      	}


      });
    }
    catch(err){}
  }

  registerAccount(evt) {
    let {email, enabled} = this.state;
    this.setState({'enabled': false});

    if (email == "") {
        this.setState({'enabled': true, 'error':'Email address cannot be blank.'})
    }
    else{
       this.joinExistingAccount();
    }

  }

  inputEmailChange(evt) {
    this.setState({"email": evt.target.value})
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
        <h2>Step 1: <b>Join an Existing Account</b></h2>
        <div className="row">
          <div className="col-sm-12">
            <p>Please enter in your email associated with an account. If a company has invited you, we will send an activation link to finish your login.</p>
          </div>
        </div>
        {errorView}
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
