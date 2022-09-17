import React, {Component, Fragment } from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { ToastContainer, toast, Button, Alert, Modal, ModalBody, ModalHeader, ModalFooter, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink } from 'mdbreact'
import LeftSideMenu from './menu/LeftSideMenu'
import { MDBBtn, MDBIcon } from "mdbreact";
import UpgradeView from './UpgradeView'
import { API_ROOT } from '../index';
import { MDBCard, MDBDataTable, cssTransition  } from "mdbreact";

import { FlexView, LeftPanel, RightPanel } from './ecommerceapi/ApiKeyView'
import { Wrapper } from './MyAccountView'
import { StyledTable } from '../lib/styled-table'
import { StyledButton } from '../lib/button'

const StyledWrapper = styled(Wrapper)`
  .invite-wrapper-body {
    padding: 80px 25px;
    div.flex-div {
      display: flex;
      max-width: 779px;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 65px;
    }
    h3 {
      font-size: 18px;
      line-height: 26px;
      color: #333330;
      font-weight: 400;
    }
    p {
      color: #333330;
      font-size: 14px;
      opacity: .5;
      line-height: 20px;
    }
    b {
      font-size: 14px;
      color: #333333;
      font-weight: bold;
      line-height: 20px;
    }
  }
`

export default class Invitations extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      'userProfile': [],
      'invitations': [],
      'invitationRows':[],
      'modalinvitation': false,
      'modalbasicinvitation': false,
      'message':'',
      'atSubLimit': false,
      'modal': false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.closeInvitationDialog = this.closeInvitationDialog.bind(this);
    this.closeBasicInvitationDialog = this.closeBasicInvitationDialog.bind(this);
    this.sendInvitation = this.sendInvitation.bind(this);
    this.sendBasicInvitation = this.sendBasicInvitation.bind(this);
    this.getInvitations = this.getInvitations.bind(this);
    this.notify = this.notify.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this)
    this.evaluateAccess = this.evaluateAccess.bind(this)


  }

  toggleDialog() {
    this.setState({
      modal: !this.state.modal
    });
  }

  notify(type){
        switch (type) {
          case 'info':
            toast.info('Info message', {
              autoClose: 3000
            });
            break;
          case 'success':

            let msg = (<Fragment><i className="fa fa-envelope-open" style={{paddingRight:'10px', paddingLeft:'10px'}}></i><p className="d-inline-block">   Your invitation was successfully sent.</p></Fragment>);
            toast.success(msg, {
              position: "top-right",
              autoClose: 7000,
              className: "notification-box",
              progressClassName: "notification-prog",
              closeButton: true,

            });
            break;
          case 'warning':
            toast.warn('Warning message');
            break;
          case 'error':
            toast.error('Error message');
            break;
        }
    };

  closeInvitationDialog() {
    this.setState({ 'modalinvitation': !this.state.modalinvitation,'message':''});
  }
  closeBasicInvitationDialog() {
    this.setState({ 'modalbasicinvitation': !this.state.modalbasicinvitation,'message':''});
  }

  evaluateAccess(){
    if(this.state.atSubLimit === true){
        this.toggleDialog();
    }
    else{
        this.closeInvitationDialog();
    }
  }

  getInvitations() {

    var username = this.props.userInfo.userName

    fetch(API_ROOT + '/api/user/invitation/?query_string='+username, {
      method: 'get',
    })
      .then(res => res.json())
      .catch(error => console.log(error))
      .then(response => {

        this.setState({'invitations':response});
        this.setState({'invitationRows':this.assembleInvites()});
      });

  }

  resendEmailInvite(invite){

    var formdata = new FormData();
    formdata.append('invitationemail', invite.emailId);
    formdata.append('senderemail', this.props.userInfo.email);
    formdata.append('first_name', invite.firstName);
    formdata.append('last_name', invite.lastName);
    formdata.append('userName', this.props.userInfo.userName);
    formdata.append('newcompany',invite.newCompanyName)
    console.log(this.props.userInfo);

    let location = window.location.hostname
    let sub = location.split('.')[0];
    if (sub.includes("localhost"))
      sub = "localhost:3000"

    fetch(API_ROOT + '/api/user/invitation/', {
      method: 'post',
      headers: new Headers({
        'x-api-subdomain': sub
      }),
      body: formdata
    })
      .then(res => res.json())
      .catch(error => console.log(error))
      .then(response => {
        //console.log(response['message']);
        this.setState({'message':response['message']});
      });

      this.notify('success');


  }


  assembleInvites = () => {
    let inv =this.state.invitations.map((invite, index) => {
      return (
        {
          email: invite.emailId,
          status: 'Pending',
          resend_link:(<a className="red-text" onClick={this.resendEmailInvite.bind(this, invite)} ><u>Resend Link</u></a>)
        }
      )
    });
    return inv;
  }

  sendInvitation(event) {
    event.preventDefault();
    this.setState({'message':'Please wait sending invitation...'});
    var fname = event.target[0].value;
    var lname = event.target[1].value;
    var email = event.target[2].value;
    var newCompanyName=event.target[3].value;
    //console.log(this.props.userInfo);

    var formdata = new FormData();
    formdata.append('invitationemail', email);
    formdata.append('senderemail', this.props.userInfo.email);
    formdata.append('first_name', fname);
    formdata.append('last_name', lname);
    formdata.append('userName', this.props.userInfo.userName);
    formdata.append('newcompany',newCompanyName)
    console.log(this.props.userInfo);

    let location = window.location.hostname
    let sub = location.split('.')[0];
    if (sub.includes("localhost"))
      sub = "localhost:3000"

    fetch(API_ROOT + '/api/user/invitation/', {
      method: 'post',
      headers: new Headers({
        'x-api-subdomain': sub
      }),
      body: formdata
    })
      .then(res => res.json())
      .catch(error => console.log(error))
      .then(response => {
        //console.log(response['message']);
        this.setState({'message':response['message']});
      });

      //alert("Invitation resent sucessfully")
  }
  sendBasicInvitation(event) {
    event.preventDefault();
    this.setState({'message':'Please wait sending invitation...'});
    var fname = event.target[0].value;
    var lname = event.target[1].value;
    var email = event.target[2].value;
    //var newCompanyName=event.target[3].value;
    //console.log(this.props.userInfo);

    var formdata = new FormData();
    formdata.append('invitationemail', email);
    formdata.append('senderemail', this.props.userInfo.email);
    formdata.append('first_name', fname);
    formdata.append('last_name', lname);
    formdata.append('userName', this.props.userInfo.userName);
    //formdata.append('newcompany',newCompanyName)
    console.log(this.props.userInfo);

    let location = window.location.hostname
    let sub = location.split('.')[0];
    if (sub.includes("localhost"))
      sub = "localhost:3000"

    fetch(API_ROOT + '/api/user/invitation/', {
      method: 'post',
      headers: new Headers({
        'x-api-subdomain': sub
      }),
      body: formdata
    })
      .then(res => res.json())
      .catch(error => console.log(error))
      .then(response => {
        //console.log(response['message']);
        this.setState({'message':response['message']});
      });

      //alert("Invitation resent sucessfully")
  }
  componentWillMount() {
    document.title = 'XSPACE | Invitations'
  }

  componentWillReceiveProps(nextProps) {
    this.setState({'userProfile':nextProps.userInfo || '' })
  }

  componentDidMount(){
    this.props.getUserInfo()
    this.getInvitations()

//    this.props.runBillingCheck().then((res) => {

//        var maxUsersBool = this.props.billingCheck["at_max_users"];
//        if (maxUsersBool == true){
//            this.setState({"atSubLimit": true})
//        }

//     }).catch((err) => {
//      console.log(err)
//    })

  }

  handleClick(e) {
    e.preventDefault();

    if(e.currentTarget.getAttribute('name')==="logout"){
      localStorage.clear();
      window.location.reload();
    }
  }

  render() {
    const errors = this.props.errors || {}

    const data = {
    columns: [
      {
        label: 'Email',
        field: 'email',
        sort: 'asc',
      },
      {
        label: 'Status',
        field: 'status',
        sort: 'asc',
      },
      {
        label: 'Resend Link',
        field: 'resend_link',
        sort: 'asc',
      },
    ],
    rows: this.state.invitationRows
  };

    let InvitationForm = (
      <Modal isOpen={this.state.modalinvitation} onRequestClose={this.closeInvitationDialog} size="md" >
        <ModalHeader style={{ justifyContent: 'center' }}><label>Invite User</label></ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12 form-group" style={{ margin: 'auto' }}>
              <form onSubmit={this.sendInvitation}>
                <p>Invite a team member/colleague to your XSPACE account. They will be able to do everything you can do <b>except</b> access to billing, edit organizational info, and invite additional users.</p>
                <div style={{ margin: '15px 0px' }}><label>First Name </label><input type="text" className="form-control" name="fname" id="fname" required/></div>
                <div style={{ margin: '15px 0px' }}><label>Last Name </label><input type="text" className="form-control" name="lname" id="lname" required/></div>
                <div style={{ margin: '15px 0px' }}><label>Email Address </label><input type="email" className="form-control" name="email" id="email" required/></div>
                <div style={{ margin: '15px 0px' }}><label>Contractor Company Name</label><input type="text" className="form-control" name="newcompany" id="newcompany" required/></div>
                <center><StyledButton type="submit" color="green">Send Invitation</StyledButton>{' '}</center>
              </form>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div style={{marginRight:'45px',fontWeight:'600'}}>{this.state.message}</div>
          <Button color="red" onClick={this.closeInvitationDialog}>Close</Button>{' '}
        </ModalFooter>
      </Modal>
    )
    let BasicInvitationForm = (
      <Modal isOpen={this.state.modalbasicinvitation} onRequestClose={this.closeInvitationDialog} size="md" >
        <ModalHeader style={{ justifyContent: 'center' }}><label>Invite User</label></ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12 form-group" style={{ margin: 'auto' }}>
              <form onSubmit={this.sendBasicInvitation}>
                <p>Invite a team member/colleague to your XSPACE account. They will be able to do everything you can do <b>except</b> access to billing, edit organizational info, and invite additional users.</p>
                <div style={{ margin: '15px 0px' }}><label>First Name </label><input type="text" className="form-control" name="fname" id="fname" required/></div>
                <div style={{ margin: '15px 0px' }}><label>Last Name </label><input type="text" className="form-control" name="lname" id="lname" required/></div>
                <div style={{ margin: '15px 0px' }}><label>Email Address </label><input type="email" className="form-control" name="email" id="email" required/></div>
                <center><StyledButton type="submit" color="green">Send Invitation</StyledButton>{' '}</center>
              </form>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div style={{marginRight:'45px',fontWeight:'600'}}>{this.state.message}</div>
          <Button color="red" onClick={this.closeBasicInvitationDialog}>Close</Button>{' '}
        </ModalFooter>
      </Modal>
    )


    let pop = (<Fragment>
        <ToastContainer
          hideProgressBar={false}
          newestOnTop={true}
          autoClose={7000}
          bodyClassName="notification-body"
          className="animated fadeIn"
        />
      </Fragment>)

    let upgrade = (
      <Modal className="form-dark" contentClassName="card card-image" isOpen={this.state.modal} toggle={this.toggleDialog} size="lg" centered>
        <ModalHeader className="white-text" toggle={this.toggleDialog}>Upgrade Your Subscription Plan </ModalHeader>
        <ModalBody >
          <UpgradeView
            fieldValues={this.fieldValues}
            processing={this.state.processing}
            submit={this.submit}>
          </UpgradeView>
        </ModalBody>
      </Modal>
    );

    return (
      <div className="container">
        {pop}
        {upgrade}
        {InvitationForm}
        {BasicInvitationForm}
        <FlexView>
          <LeftPanel>
            <LeftSideMenu key={6} data={this.props}/>
          </LeftPanel>
          <RightPanel>
            <StyledWrapper>
              <div className='wrapper-header'>
                <Link className="nav-link active" to="#">Invites</Link>
              </div>
              <div className='invite-wrapper-body'>
                <div className='flex-div'>
                  <div>
                    <h3>Invite a User</h3>
                    <p>You may invite users to join your account.</p>
                  </div>
                  <StyledButton className='small-btn filled-btn' onClick={this.evaluateAccess}
                                style={{width: 'fit-content', paddingLeft: 18, paddingRight:18}}>Add New Contractor</StyledButton>
                  <StyledButton className='small-btn filled-btn' onClick={this.closeBasicInvitationDialog}>Add New User</StyledButton>
                </div>
                <b>Pending Invites</b>
                <StyledTable>
                  <MDBDataTable
                    responsive
                    hover
                    data={data}
                    searchLabel="Search..."
                  />
                </StyledTable>
              </div>
            </StyledWrapper>
          </RightPanel>
        </FlexView>
      </div>
  )
  }
}
