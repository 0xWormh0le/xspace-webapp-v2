import React, {Component} from 'react'
import axios from 'axios';
import { Redirect } from 'react-router'
import { Input, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import { API_ROOT } from '../index';
import logo from './viewAssets/XSpace_logo.png'


export default class ActivateUserView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      statusHeader:'Success!',
      status:'Please wait your account activation is under process..',
      redirect: false,
      uid:'',
      token:'',
      id:'',
      modal:false,
      companyName: '',
      companySubDomain: '',
      step:0,
      enabled: true,
      error:'',
      password:'',
      confirm: '',


    }


    this.redirectUrl = this.redirectUrl.bind(this);
    this.toggle = this.toggle.bind(this);
    this.inputCompanyNameChange = this.inputCompanyNameChange.bind(this);
    this.inputCompanySubDomain = this.inputCompanySubDomain.bind(this);
    this.inputPasswordChange = this.inputPasswordChange.bind(this);
    this.inputConfirmChange = this.inputConfirmChange.bind(this);
    this.confirmStep = this.confirmStep.bind(this)
    this.activateNewPWAndCompany = this.activateNewPWAndCompany.bind(this)
    this.checkCompanyAndNext = this.checkCompanyAndNext.bind(this)

    var url=this.props.location;
    url = url['pathname'].split("/");

    //alert(url[3]);

    var uid='';
    var keylength = url[2].length;
    var getuuid = 1;
    for(let i=0; i<keylength; i++){
     if(keylength==3)
     {
        getuuid=1;
     }
     else if(keylength==5){
        getuuid=2;
      }
      else if(keylength===7){
        getuuid=3;
      }
      else{}
       if(i<(keylength-getuuid))
       {
         uid += (url[2][i]);
       }
   }

    var token=url[3];
    this.setState({uid:uid, token:token});
    /**
    try{
    	fetch(API_ROOT + '/api/useractivate/'+uid+'/'+token+'/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      }).then(res => res.json())
      .catch(error => {console.error('Error:', error);})
      .then(response => {
        console.log(response);
      	if(response[0]=='No such user exists.'){
          alert("Failed! Invalid Link");
        }
      	if(response['is_active']==true){
      		//alert("Your account has been activated.\n Please login.");
      		this.setState({status:'Your account has been activated.'});
          this.setState({id:response['id']});
          //.this.redirectUrl();

      	}else{
      		//alert("Invalid token unable to activate your account");
      		this.setState({status:"Invalid Activation Token, we are unable to activate your account, please contact customer support."});

          //document.location.href = '/register/';
      	}


      });
    }
    catch(err){}
    **/

  }

  redirectUrl(){
    document.location.href = '/';
  }

  activateNewPWAndCompany(){

    var url=this.props.location;
    url = url['pathname'].split("/");

    //alert(url[3]);

    var uid='';
    var keylength = url[2].length;
    var getuuid = 1;
        for(let i=0; i<keylength; i++){
         if(keylength===3)
         {
            getuuid=1;
         }
         else if(keylength===5){
            getuuid=2;
          }
          else if(keylength===7){
            getuuid=3;
          }
          else{}
           if(i<(keylength-getuuid))
           {
             uid += (url[2][i]);
           }
       }

    var token=url[3];
    this.setState({uid:uid, token:token});


    try{
    	fetch(API_ROOT + '/api/company_pw_activate/'+uid+'/'+token+'/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'password':this.state.password, 'companyName':this.state.companyName, 'companySubDomain':this.state.companySubDomain})
      }).then(res => res.json())
      .catch(error => {console.error('Error:', error);})
      .then(response => {
        console.log(response);
      	if(response[0]==='No such user exists.'){
          alert("Failed! Invalid Link");
        }
      	if(response['is_active']===true){
      	    this.toggle();
      		//alert("Your account has been activated.\n Please login.");
      		this.setState({status:'Your account has been activated.'});
            this.setState({id:response['id']});
            //this.redirectUrl();

            setTimeout(function () {
               window.location.href = "/"; //will redirect to your blog page (an ex: blog.html)
            }, 1500); //will call the function after 2 secs.


      	}else{
      	    this.setState({"statusHeader": "An Error has Occurred"});
      	    this.toggle();
      		//alert("Invalid token unable to activate your account");
      		this.setState({status:"Invalid activation token, we are unable to activate your account, please contact customer support."});

          //document.location.href = '/register/';
      	}


      });
    }
    catch(err){}
  }

  toggle(){
    this.setState({
        modal: !this.state.modal
      });
  }

  inputCompanyNameChange(evt) {
    this.setState({"companyName": evt.target.value});
  }

  inputCompanySubDomain(evt) {
    this.setState({"companySubDomain": evt.target.value});
  }

  inputPasswordChange(evt) {
    this.setState({"password": evt.target.value})
  }

  inputConfirmChange(evt) {
    this.setState({"confirm": evt.target.value})
  }

  nextStep = () => {
    if (this.state.step === 1) {
      return
    } else {
        this.setState({
          step: this.state.step + 1
        })
    }
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

  checkCompanyAndNext(evt) {
    let {companyName, companySubDomain} = this.state;
    this.setState({'enabled': false});

    if(companyName == ''){
        this.setState({'enabled': true, 'error':'Company Name cannot be blank.'})
    }else if(companySubDomain == ''){
        this.setState({'enabled': true, 'error':'Your Company Sub Domain cannot be blank.'})
    }
    else{
        this.nextStep();
        //        this.props.onSubmit(email, fname, lname, signupToken).then(res => {
        //        //id is passed through promise
        //        this.setState({'res':res});
        //        this.props.toggle();
        //    }).catch(err => {
        //    //if the payload email had an error
        //    console.error(err)
        //    if (err) {
        //        this.setState({'enabled': true, 'error':err})
        //    } else {
        //        this.setState({'enabled': true, 'error':'This e-mail is already taken. Please enter another e-mail or contact support@xspaceapp.com for more details.'});
        //    }
        //    });
    }

  }

  checkPasswordAndActivate(evt) {
    let {password, confirm} = this.state;
    this.setState({'enabled': false});

    if(password != confirm){
        this.setState({'enabled': true, 'error':'Passwords must match'})
    }else if (password.length < 7) {
        this.setState({'enabled': true, 'error':'Your password must have at least 8 characters.'})
    }else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        this.setState({'enabled': true, 'error':'Your password must have at least one number.'})
    }
    else{
        this.nextStep();
        this.setState({'enabled': true});
        //        this.props.onSubmit(email, fname, lname, signupToken).then(res => {
        //        //id is passed through promise
        //        this.setState({'res':res});
        //        this.props.toggle();
        //    }).catch(err => {
        //    //if the payload email had an error
        //    console.error(err)
        //    if (err) {
        //        this.setState({'enabled': true, 'error':err})
        //    } else {
        //        this.setState({'enabled': true, 'error':'This e-mail is already taken. Please enter another e-mail or contact support@xspaceapp.com for more details.'});
        //    }
        //    });
    }

  }


  render() {
    const errors = this.props.errors || {}
    let { error, enabled, modal} = this.state;
    let errorView = (<div></div>);


    let enabledView = (<a></a>)
    let prev = (<div></div>);
    let fragment = (<h2>None</h2>);

    let stepHeader = (<h2></h2>);
    let title = (<h2></h2>);
    let desc = (<p></p>);

    if (error) {
      errorView = (<div className="animated fadeIn"><br /><p style={{color: 'red'}}>{error}</p><br /></div>);
    }

    if (enabled) {
        enabledView = (<a onClick={ this.activateNewPWAndCompany } className="btn btn-lg btn-green">Activate</a>)
    }else{
        enabledView = (<a className="btn btn-lg btn-primary">Please wait...</a>)
    }

    switch (this.state.step) {
      case 0:
        stepHeader = (<h2><b>Step 2:</b></h2>);
        title = (<h2>Company Setup</h2>);
        desc = (<p>Enter your company info to complete your account setup.</p>);
        enabledView = (<a onClick={ this.checkCompanyAndNext } className="btn btn-lg btn-blue">Next</a>)
        fragment = (<div><Input value={this.state.companyName} onChange={this.inputCompanyNameChange} label="Company Name" group type="text" validate error="wrong" success="right"/>
                    <Input value={this.state.companySubDomain} onChange={this.inputCompanySubDomain} label="Company Domain" group type="text" validate error="wrong" success="right"/></div>)
        break;
      case 1:
        stepHeader = (<h2><b>Step 3:</b></h2>);
        title = (<h2>Enter Your Credentials</h2>);
        desc = (<p>Enter your desired account login credentials to complete your account setup.</p>);
            //if the submit button is enabled

        if (!enabled) {
            enabledView = (<a onClick={ this.activateNewPWAndCompany } className="btn btn-lg btn-green">Activate</a>)
        }

        prev = (<a onClick={ this.previousStep } className="btn btn-lg btn-red">Back</a>)
        fragment = (<div><Input label="Type your password" onChange={this.inputPasswordChange} value={this.state.password} icon="lock" group type="password" validate/>
        <Input label="Confirm your password" onChange={this.inputConfirmChange} value={this.state.confirm} icon="lock" group type="password" validate/></div>)
        break;
      default:
        break;
    }

    let passwordForm = (<div></div>);
    let activateModal = (<Modal backdrop="true" isOpen={this.state.modal} toggle={this.toggle} style={{top:'50%'}} centered>
                                  <ModalHeader toggle={this.toggle}>{this.state.statusHeader}</ModalHeader>
                                  <ModalBody>
                                    <center><div><img src="https://i2.wp.com/xspaceapp.com/wp-content/uploads/2019/04/email-1346077-1009x1024.png?fit=296%2C300&ssl=1"
                                                      style={{width: "40%", paddingBottom: 20}}/>
                                    </div>
                                    <b> {this.state.status}</b></center>
                                  </ModalBody>
                                  <ModalFooter>
                                  </ModalFooter>
                              </Modal>)

    return (
      <div className="top-content">
      {activateModal}
        <div className="inner-bg panel-graphic2">
            <div className="row">
                <div className="animated fadeInLeft col-md-5 nopadding slow" >
                    <div className="panel-light2 p-8">
                        <div className="row animated fadeIn delay-1s">
                          <div className="col-sm-8 offset-2">
                            <br />
                            <br />
                            <br />
                            <br />
                            <center><img src={logo} alt='' height = "200px" width="200px"/>
                            <h2>{stepHeader} {title}</h2></center>
                            <hr />
                            <div className="desc">
                              {desc}
                            </div>

                          </div>
                        </div>
                        <div className="row animated fadeIn delay-1s">
                          <div className="col-sm-8 offset-sm-2 form-box">
                            {errorView}
                            {fragment}
                            <br />
                            <div className="text-right">
                              {prev}
                              {enabledView}
                              <br />
                              <br />
                            </div>
                            <div id="note"/>
                          </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-7 nopadding">
                    <div className="">
                        <center>
                        <div className="threeDView">
                            <iframe className="threekit-player threeDView" style={{top: '50%'}} frameBorder="0" src="https://clara.io/player/v2/2feca606-a262-4b4e-8e39-76d95dc2fdaa?tools=hide&amp;tools.zoom=false&amp;hideThumbnail=true" />
                        </div></center>
                    </div>
                </div>
            </div>

      </div>

      </div>

    )
  }
}
