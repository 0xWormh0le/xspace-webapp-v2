import React, { Component } from 'react';
import AccountFields from './register/AccountFields';
import PasswordFields from './register/PasswordFields';
import JoinAnAccountFields from './register/JoinAnAccountFields';
import SignupChoice from './register/SignupChoice';
import CompanyInfo from './register/CompanyInfo';
import PersonalInfo from './register/PersonalInfo';
import { Input, Button, Modal, ModalBody, ModalHeader, ModalFooter, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBContainer } from 'mdbreact';
import { authErrors, isAuthenticated } from '../reducers'
import axios from 'axios';

export default class RegisterMultiView extends Component {

  fieldValues = {
    name: null,
    email: null,
    password: null,
    fname: null,
    lname: null,
    signupToken: null,
    age: null,
    colors: [],
    errors: {}
  }
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      errorToggle: false,
      successToggle: false,
      activatedToggle: false,
      errorMsg: '',
      email:'',
      fname:'',
      lname: '',
      companyName: '',
      signupToken: '',
      step: 0,
      error: '',
      id: 0,

    }
    this.confirmStep = this.confirmStep.bind(this)
    this.toggle = this.toggle.bind(this);
    this.toggleErrorModal = this.toggleErrorModal.bind(this);
    this.toggleSuccessModal = this.toggleSuccessModal.bind(this);
    this.toggleSuccessActivatedModal  = this.toggleSuccessActivatedModal.bind(this);
  }
  componentWillMount() {
    document.title = 'XSPACE | Register'
  }

  componentDidMount() {
    var reg = window.location.href;
    reg = reg.split('/');

    this.setState({ signupToken: reg[5] });


    if (reg.length == 6) {
      try {
        reg = decodeURIComponent(atob(reg[5])).split('|');
        if (reg.length == 4) {
          console.log(reg[5]);
          this.fieldValues.email = reg[0],
          this.fieldValues.fname = reg[1],
          this.fieldValues.lname = reg[2],
          this.fieldValues.signupToken = reg[4],
//          this.setState({
//            'email':reg[0],
//            'fname':reg[1],
//            'lname':reg[2],
//            'companyName':reg[3],
//          });
          this.setState({ step: 3});
          //this.setState({ signupToken: reg[5] });

        } else {
          console.log('invalid Token');
        }
      }
      catch (err) {
        console.log('invalid Token');
      }


    }


  }

  handleInputChange = (event) => {
    const target = event.target,
      value = target.type ===
        'checkbox' ? target.checked : target.value,
      name = target.name
    this.setState({
      [name]: value
    });
  }

  nextStep = () => {
    this.setState({
      step: this.state.step + 1
    })
  }

  nextStepTwo = () => {
    this.setState({
      step: this.state.step + 2
    })
  }

  confirmStep = (id) => {
    //update state with id
    this.setState({ step: 1, id: id });
  }

  // Same as nextStep, but decrementing
  previousStep = () => {
    if (this.state.step < 1) {
      return
    } else {
      this.setState({
        step: this.state.step - 1
      })
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

  onSubSubmit = (email, fname, lname, password, signupToken) => {
    //this.setState({ 'email': email, 'fname': fname, 'lname': lname, 'signupToken':signupToken });
    return this.props.onSubSubmit(email, fname, lname, password, signupToken).then(res => {
      return new Promise(function (resolve, reject) {
        if (res.payload.response) {

          resolve(res.payload.response)
          //console.log(res.payload.response)
          //try {
          //  if (Array.isArray(res.payload.response.email)) {
          //    reject("Email ID: " + res.payload.response.email)
          //  }
          //} catch (err) { }
          // else if (Array.isArray(res.payload.response.password)) {
          //   reject("Password: " + res.payload.response.password)
          // }
        }
        else {
          resolve(res.payload.id)
        }
      });
    }).catch(err => {
      //catch error
      return new Promise(function (resolve, reject) {
        reject(err)
      });
    });


  }

  onnewSubmit = (email, fname, lname, signupToken) => {
    this.setState({ 'email': email, 'fname': fname, 'lname': lname });
    return this.props.onnewSubmit(email, fname, lname, signupToken).then(res => {
      return new Promise(function (resolve, reject) {
        if (res.payload.response) {
          console.log(res.payload.response)
          try {
            if (Array.isArray(res.payload.response.email)) {
              reject("Email ID: " + res.payload.response.email)
            }
          } catch (err) { }
          // else if (Array.isArray(res.payload.response.password)) {
          //   reject("Password: " + res.payload.response.password)
          // }
        }
        else {
          resolve(res.payload.id)
        }
      });
    }).catch(err => {
      //catch error
      return new Promise(function (resolve, reject) {
        reject(err)
      });
    });
  }


  onSubmitCompanyInfo = (companyName, industry, companyRole) => {
    let { id } = this.state
    return this.props.onSubmitCompanyInfo(id, companyName, industry, companyRole).then(res => {
      return new Promise(function (resolve, reject) {
        if (res.error) {
          if (res.payload.response.companyRole) {
            reject("Company role needs to be entered")
          }
          if (res.payload.response.companyName) {
            reject("Company name needs to be entered")
          }
        }
        else if (res.payload) {
          resolve(res.payload.id)
        }
      })
    }).catch(err => {
      //catch error
      return new Promise(function (resolve, reject) {
        reject(err)
      });
    })
  }

  onSubmitPersonalInfo = (phoneNum, address1, address2, poBoxNum, cityName, state, zipCode, country) => {
    //grab the id from the response in onSubmit, otherwise this may be lost

    let { id } = this.state
    return this.props.onSubmitPersonalInfo(id, phoneNum, address1, address2, poBoxNum, cityName, state, zipCode, country).then(res => {
      return new Promise(function (resolve, reject) {
        if (res.error) {
          if (res.payload.response.address1) {
            reject("Address 1 needs to be entered")
          }
          if (res.payload.response.address2) {
            reject("Address 2 needs to be entered")
          }
          if (res.payload.response.cityName) {
            reject("City name needs to be entered")
          }
          if (res.payload.response.zipCode) {
            reject("ZIP code needs to be entered")
          }
          if (res.payload.response.country) {
            reject("Country needs to be entered")
          }
          if (res.payload.response.state) {
            reject("State needs to be entered")
          }
        }
        else if (res.payload) {
          if (res.payload) {
            alert("Thank you for joining us." + "\n" + "You will be redirected to login page.");
            document.location.href = '/#/login/';
          }
        }
      })
    }).catch(err => {
      //catch error
      return new Promise(function (resolve, reject) {
        reject(err)
      });
    })
  }

  toggleErrorModal = (message) => {

  this.setState({ 'errorMsg': message });

  this.setState({
    errorToggle: !this.state.errorToggle
  });

  }

  closeErrorModal = () => {

  this.setState({
    errorToggle: false
  });

  }

  toggleSuccessModal = () => {
      this.setState({
        successModal: !this.state.successModal
      });

  }

   toggleSuccessActivatedModal = () => {
      this.setState({
        activatedToggle: !this.state.activatedToggle
      });

  }

  render() {
    const errors = this.props.errors || {}
    let fragment = (<h2>None</h2>);
    let isLoggedIn = (<p>User is not logged in</p>);

    let errorModal = (
      <MDBModal isOpen={this.state.errorToggle} toggle={this.toggleErrorModal} size="sm" centered>
        <MDBModalHeader toggle={this.toggleErrorModal}>Whoops!</MDBModalHeader>
        <MDBModalBody>
        <MDBContainer>
          <center><i className="fa fa-close fa-3x" aria-hidden="true"></i>
          <p>An error has occurred. {this.state.errorMsg} </p>
          </center>
        </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="secondary" onClick={this.closeErrorModal}><i className="fa fa-cancel pr-2" aria-hidden="true"></i>OK</Button>
        </MDBModalFooter>
      </MDBModal>
    )
    let successModal = (
      <MDBModal isOpen={this.state.successModal} toggle={this.toggleSuccessModal} size="sm" centered>
        <MDBModalHeader toggle={this.toggleSuccessModal}>Success!</MDBModalHeader>
        <MDBModalBody>
        <MDBContainer>
          <center><i className="fa fa-check fa-3x" aria-hidden="true"></i>
          <p>An invitation email has been successfully sent to the email you have entered.</p>
          </center>
        </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="secondary" onClick={this.toggleSuccessModal}><i className="fa fa-cancel pr-2" aria-hidden="true"></i>OK</Button>
        </MDBModalFooter>
      </MDBModal>
    )
    let successActivateModal = (
      <MDBModal isOpen={this.state.activatedToggle} toggle={this.toggleSuccessActivatedModal} size="sm" centered>
        <MDBModalHeader toggle={this.toggleSuccessActivatedModal}>Success!</MDBModalHeader>
        <MDBModalBody>
        <MDBContainer>
          <center><i className="fa fa-check fa-3x green-text" aria-hidden="true"></i>
           <div>You have successfully registered with XSPACE. <br/> You may now log in.</div>
          </center>
        </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="secondary" onClick={this.toggleSuccessActivatedModal}><i className="fa fa-cancel pr-2" aria-hidden="true"></i>OK</Button>
        </MDBModalFooter>
      </MDBModal>
    )


    switch (this.state.step) {
      case 0:
        fragment = <SignupChoice
          fieldValues={this.fieldValues}
          nextStep={this.nextStep}
          nextStepTwo={this.nextStepTwo}
          onSubmit={this.onnewSubmit}
          confirmStep={this.confirmStep}
          toggle={this.toggle}>
        </SignupChoice>
        break;
      case 1:
        fragment = <AccountFields
          fieldValues={this.fieldValues}
          nextStep={this.nextStep}
          onSubmit={this.onnewSubmit}
          confirmStep={this.confirmStep}
          toggle={this.toggle}>
        </AccountFields>
        break;
      case 2:
        fragment = <JoinAnAccountFields
          fieldValues={this.fieldValues}
          nextStep={this.nextStep}
          successModal={this.toggleSuccessModal}
          errorModal={this.toggleErrorModal}
          previousStep={this.previousStep}
          onSubmit={this.onSubmitCompanyInfo}>
        </JoinAnAccountFields>
        break;
      case 3:
        fragment = <PasswordFields
          fieldValues={this.fieldValues}
          nextStep={this.nextStep}
          onSubSubmit={this.onSubSubmit}
          email = {this.state.email}
          fname = {this.state.fname}
          lname = {this.state.lname}
          signupToken = {this.state.signupToken}
          successModal={this.toggleSuccessModal}
          activatedModal={this.toggleSuccessActivatedModal}
          errorModal={this.toggleErrorModal}
          previousStep={this.previousStep}
          onSubmit={this.onSubmitCompanyInfo}>
        </PasswordFields>
        break;
      default:
        fragment = (<h2>Lets go to the Dashboard!</h2>);
        break;
    }

    return (
      <div className="top-content">
        <div className="inner-bg panel-graphic2">
            {errorModal}
            {successModal}
            {successActivateModal}
            <div className="row">
                <div className="animated fadeInLeft col-md-5 nopadding slow" >
                    <div className="panel-light2 p-8">
                        <div className="row animated fadeIn delay-1s">
                          <div className="col-sm-8 offset-2">
                            <br />
                            <br />
                            <br />
                            <br />
                            <center><img src="https://s3.amazonaws.com/storage.xspaceapp.com/css/img/logo.png" width="200px"></img>
                            <h1>Welcome to <strong>XSPACE™</strong></h1></center>
                            <hr />
                            <div className="desc">
                              <p>
                                Gain access to a large network of vendors <span>&amp;</span> retailers to get 3D models <span>/</span> 2D photos
                                of products to  save time, help you focus on sales, and scale your e-commerce site.
                                        </p>
                            </div>

                          </div>
                        </div>
                        <div className="row animated fadeIn delay-1s">
                          <div className="col-sm-8 offset-sm-2 form-box">
                            <br />
                            {fragment}
                            <div className="text-center">
                              <Modal backdrop="true" isOpen={this.state.modal} toggle={this.toggle} style={{top:'50%'}} centered>
                                  <ModalHeader toggle={this.toggle}>Success!</ModalHeader>
                                  <ModalBody>
                                    <div><img src="https://storagev2.s3-us-west-2.amazonaws.com/xspace/company_assets/simple_xspace_logo.png" style={{width:"40%", paddingBottom:20 }}></img></div>
                                    <div>You have successfully registered with XSPACE.</div>
                                    <div>An verification link has been sent to your e-mail address.</div>
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button color="secondary" name="close" onClick={this.toggle}>Close</Button>{' '}
                                  </ModalFooter>
                              </Modal>
                            </div>
                            <div id="note"></div>
                          </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-7 nopadding">
                    <div className="">
                        <center>
                        <div className="threeDView">
                            <iframe className="threekit-player threeDView" style={{top:'50%'}} frameBorder="0" src="https://clara.io/player/v2/2feca606-a262-4b4e-8e39-76d95dc2fdaa?tools=hide&amp;tools.zoom=false&amp;hideThumbnail=true" ></iframe>
                        </div></center>
                    </div>
                </div>
            </div>

      </div>

      </div>
    )
  }
}
