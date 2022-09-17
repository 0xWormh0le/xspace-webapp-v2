import React, { Component } from 'react';
import axios from 'axios';
import { API_ROOT } from '../index';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';

export default class PWResetView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      message:'',
      title:'',
      messageno:0
    };

    this.toggle = this.toggle.bind(this);
    this.submitData = this.submitData.bind(this);
    //this.toggle();
  }

  toggle(event) {
    try{
      //console.log(event.currentTarget);
      if(event.currentTarget.getAttribute('name')=="close" && this.state.messageno == 1){
        var host = window.location.href;
        host = host.split('/');
        window.location.href = host[0];
      }
      else{
        this.setState({
          modal: !this.state.modal
        });
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

  componentDidMount() {
    /*this.setState({'message':"no such user"});
    console.log('check');*/
  }

  submitData(event)
  {
    event.preventDefault();
    var email = document.getElementById('email').value;

    var data = new FormData()
          data.append('email', email)
    fetch(API_ROOT + '/api/resetpassword/', {
        method: 'POST',
        body: data
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        console.log(response);
        if(response['result']==1){
          this.setState({
                          'message':"A reset link to reset your password has been sent to your e-mail.",
                          'title':"Success",
                          'messageno':1
                        });
        }
        else if(response['result']==0){
          this.setState({
                          'message':"You are not a verified user. Please verify your account to reset your password",
                          'title':"Error",
                          'messageno':2
                        });
        }
        else{
          this.setState({
                          'message':"The email you entered does not exist on XSPACE.",
                          'title':"An Error Has Occured",
                          'messageno':3
                        });
        }
        this.toggle();
    });
  }


  render() {
    const errors = this.props.errors || {}
    return (
      <div className="container jumbotron mt-5 mb-5">
        <div className="row">
            <div className="col-md-12 text-center">
                  <center><img src="/media/img/logo.png" width="50%" alt="prismalogo" /></center>
            </div>
        </div>
        <div className="row">
            <div className="col-md-3">
            </div>
            <div className="col-md-6">

                <h1 className="text-center">Password Reset</h1>
                <br />
                <h3 className="text-center">Forgotten your password? Enter your email address below, and we&apos;ll send you an reset link to create a new password.</h3>
                <br />
                <form className="form-signin" id="login_form" method="post" onSubmit={this.submitData}>
                <input type="email" id="email" name="email" className="form-control" placeholder="E-Mail" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" required autoFocus />
                <br />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Reset Password</button>
                <input type="hidden" name="submit" value="submit" />
                </form>

                <Modal backdrop="false" isOpen={this.state.modal} toggle={this.toggle} style={{top:'25%'}} centered>
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
     </div>
    );
  }
}
