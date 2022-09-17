import React, {Component, Fragment } from 'react'
import styled from 'styled-components'
import {
    ToastContainer,
    toast,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    MDBModalBody,
    MDBModal
} from 'mdbreact'
import LeftSideMenu from './menu/LeftSideMenu'
import { MDBBtn, MDBIcon } from "mdbreact";
import UpgradeView from './UpgradeView';
import CompanyEdit from './CompanyEdit';
import { API_ROOT } from '../index';
import { MDBDataTable  } from "mdbreact";
import { FlexView, LeftPanel, RightPanel } from './ecommerceapi/ApiKeyView'
import { StyledTable } from '../lib/styled-table'
import {makeStyles} from "@material-ui/core/styles";
import './organizationview.css';
import Card from "@material-ui/core/Card";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {CardMedia} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress'
const RightPanelWrapper = styled(RightPanel)`
  &&& {
    padding: 50px;
    .company-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 25px;
      div:last-child {
        text-align: center;
      }
      img {
        width: 165px;
        display: block;
      }
      button {
        display: inline-block;
      }
      .profile-edit {
        position: relative;
        i {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 18px;
          :hover {
            cursor: pointer;
          }
        }
      }
    }
    .flex-div {
      display: flex;
      padding-bottom: 15px;
      > div {
        flex: 1;
      }
    }
    p {
      margin: 0;
      color: #333330;
      opacity: .5;
      font-size: 14px;
      line-height: 20px;
    }
    b {
      font-size: 14px;
      line-height: 20px;
      color: #333333;
    }
    h5 {
      font-size: 18px;
      margin-bottom: 10px;
      color: #333330;
      line-height: 26px;
      font-weight: 400;
    }
  }
`

const useStyles = makeStyles({
    root: {
    },
    cardMedia: {
        zIndex: -1,
        position:'relative',
        height: 100,
    },
})

const StyledModal = styled(MDBModal)`
  width: 25%
  .modal-content {
    border-radius: 10px;
    height: 70%;
  }
  .modal-header {
    border-bottom: 2px solid #F4F5FA;
    .modal-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 90%;
      b, button {
        color: #333333;
        font-size: 16px;
        line-height: 26px;
      }
      button {
        border: 2px solid #F4F5FA;
        background-color: white;
        border-radius: 20px;
        width: 120px;
        height: 38px;
        :hover {
          background-color: #00A3FF;
          color: white;
          border: none;
        }
      }
    }
  }

  .modal-body {
    .container {
      padding: 0px 0px;
      overflow-y: auto;
      overflow-x: hidden;
      height: 100%;
      width: 100%;
      position: relative;
      h4 {
        font-size: 18px;
        line-height: 26px;
        color: #333330;
        font-weight: 400;
        text-align: center;
        margin-bottom: 2.5%;
      }
      .row {
        justify-content: space-between;
        padding-bottom: 2.5%;
      }
      .card-item {
        width: 133px;
        height: 133px;
        padding-top: 2.5%;
        border: 2px solid rgba(61, 61, 61, .2);
        border-radius: 10px;
        text-align: center;
        img {
          width: 32px;
          margin-bottom: 2.5%;
        }
        h6, p {
          font-size: 11px;
          line-height: 26px;
          margin: 0;
          font-weight: 400;
        }
        h6 {
          font-weight: bold;
        }
      }
      center {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow-y: auto;
        a, button {
          width: 133px;
          height: 38px;
          color: #333333;
          font-size: 14px;
          font-weight: bold;
          line-height: 20px;
          border-radius: 19px;
          border: 2px solid #F4F5FA;
          :hover {
            background-color: #00A3FF;
            color: white;
            border: none;
          }
        }
        a {
          text-decoration: none;
          color: #333333;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          margin-right: 30px;
          border: 2px solid #F4F5FA;
          :hover {
            background-color: #00A3FF;
            color: white;
            border: none;
          }
        }
      }
    }
  }
`

const CompanyInfoEditStyledModal = styled(StyledModal)`
  .modal-content {
    max-width: 1008px;
    overflow-x: hidden;
    margin: auto;
    .flex-container-row {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    .modal-body {
      width: 100%;
      height: 70%;
      overflow-x: hidden;
      .row {
        justify-content: center;
        button {
          min-width: 133px;
          height: 38px;
          background-color: #00A3FF;
          border-radius: 19px;
          color: white;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
`

 function WhiteLabel(props){
  // console.log(props);
  const perms = props.data['permissions'];
  // console.log(perms);
  const isW = perms ? perms.includes('WHITELABEL') : false;

  if (isW) {
    return <div><MDBBtn className="mt-3" gradient="peach" onClick={props.closeWhiteLabelDialog}>
                                <MDBIcon icon="image" className="mr-1" />     Edit Company White Label
                          </MDBBtn></div>;
  }
  return <div/>;
}

export default class OrganizationView extends Component {

  constructor(props, context) {
    super(props, context);
    this.fieldValues = {
        companyName: null,
        companyEmail: null,
        companyWebsiteURL: null,
        companyPhoneNumber: null,
        companyLogoURL: null,
        industry:null,
        company:{},
        mainAddress:{
            address1: '',
            address2: '',
            poBoxNum: '',
            city: '',
            state: '',
            zipcode: '',
            country: '',
        },
    }
    this.state = {
      "wlChange":false,
      'whitelabel':{'logo':'',
                              'foreground1':'',
                              'foreground2':'',
                              'buttonColor1':'',
                              'buttonColor2':'',
                              'backgroundColor':''},
      'userProfile': [],
      'users': [],
      'usersRows':[],
      'modalinvitation': false,
      'modalWhitelabel':false,
      'message':'',
      'atSubLimit': false,
      'modal': false,
      'editCompany':false,
      'companyName':'',
      'companyEmail': '',
      'companyPhoneNumber': '',
      'address1':'',
      'address2':'',
      'poBoxNum':'',
      'city':'',
      'state': '',
      'zipode':'',
      'country':'',
      'industry':'',
      'companyWebsite':'',
      'companyLogo':'icons8-customer-128.png',
      'company': []
    };

    this.handleColor=this.handleColor.bind(this);
    this.updateWhiteLabel=this.updateWhiteLabel.bind(this);
    this.closeWhiteLabelDialog=this.closeWhiteLabelDialog.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.closeInvitationDialog = this.closeInvitationDialog.bind(this);
    this.sendInvitation = this.sendInvitation.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.notify = this.notify.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this)
    this.evaluateAccess = this.evaluateAccess.bind(this)
    this.assembleUsers = this.assembleUsers.bind(this)
    this.getCompanyLogo = this.getCompanyLogo.bind(this)
    this.toggleEditCompany = this.toggleEditCompany.bind(this)
    this.toggle = this.toggle.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.uploadProfileImage = this.uploadProfileImage.bind(this);
  }

  toggle(event) {
    try{
      //console.log(event.currentTarget);
      this.setState({
        modal: !this.state.modal
      });
    }catch(err){
      this.setState({
        modal: !this.state.modal
      });
    }
  }

  componentWillReceiveProps(nextProps){

      // console.log(nextProps)
      this.setState({'userProfile':nextProps.userInfo || '' })
      let checkAgainstPrevious = JSON.stringify(nextProps.company) !== JSON.stringify(this.props.company)
      // console.log(checkAgainstPrevious)

      if(checkAgainstPrevious){
        //Perform some operation
        var username = this.props.userInfo.userName

        this.setState({ "users": nextProps.company["users"] }, () => {
                this.setState({'usersRows':this.assembleUsers()});
            });
        this.setState({ "companyName": nextProps.company["companyName"]});
        this.setState({ "companyEmail": nextProps.company["companyEmail"]});
        this.setState({ "industry": nextProps.company["industry"]});
        this.setState({ "companyWebsite": nextProps.company["companyWebsiteURL"]});
        this.setState({ "companyPhoneNumber": nextProps.company["companyPhoneNumber"]});
        this.setState({ "companyLogoURL": nextProps.company["companyLogoURL"]});

        if(nextProps.company["mainAddress"] == null){
            this.setState({ "address1": 'No Address 1' });
            this.setState({ "address2": 'No Address 2'});
            this.setState({ "poBoxNum": 'No PO Box Num'});
            this.setState({ "city": 'No City'});
            this.setState({ "state": 'No State'});
            this.setState({ "zipcode": 'No Zip Code '});
            this.setState({ "country": 'No Country'});
        }
        else{
            this.setState({ "address1": nextProps.company["mainAddress"]["address1"]});
            this.setState({ "address2": nextProps.company["mainAddress"]["address2"]});
            this.setState({ "poBoxNum": nextProps.company["mainAddress"]["poBoxNum"]});
            this.setState({ "city": nextProps.company["mainAddress"]["city"]});
            this.setState({ "state": nextProps.company["mainAddress"]["state"]});
            this.setState({ "zipcode": nextProps.company["mainAddress"]["zipcode"]});
            this.setState({ "country": nextProps.company["mainAddress"]["country"]});
        }

        this.setState({ "company": nextProps.company }, () => {
                console.log(this.state.company)
            });

      }
  }

  toggleDialog() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleEditCompany() {
    this.setState({
      editCompany: !this.state.editCompany
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
          case 'success2':
            let msg2 = (<Fragment><i className="fa fa-envelope-open" style={{paddingRight:'10px', paddingLeft:'10px'}}></i><p className="d-inline-block">   Your company was successfully updated.</p></Fragment>);
            toast.success(msg2, {
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

  closeInvitationDialog = () => {
    this.setState({ 'modalinvitation': !this.state.modalinvitation,'message':''});
  }

  closeWhiteLabelDialog() {
    this.setState({ 'modalWhitelabel': !this.state.modalWhitelabel,'message':''});
  }

  evaluateAccess = () => {
    if(this.state.atSubLimit === true){
        this.toggleDialog();
    }
    else{
        this.closeInvitationDialog();
    }
  }

  getCompanyLogo(){
      if(this.state.companyLogoURL === ''){
          // console.log("getCompanyLogo set logo as:", 'icons8-customer-128.png')
          return 'icons8-customer-128.png'
      }
      else{
          // console.log("getCompanyLogo set logo as:", this.state.companyLogoURL)
          return this.state.companyLogoURL
      }

  }

  uploadProfileImage(){
    this.props.uploadProfilePic().then((response)=>{
    }).catch((error)=>{
    })
  }

  popup(){
    document.getElementById('file1').click();
  }

  getUsers() {
    var username = this.props.userInfo.userName

    this.setState({ "users": this.props.company["users"] }, () => {
            var url = this.state.users;
            //console.log(url);
            this.setState({'usersRows':this.assembleUsers()});
        });

    this.setState({ "companyName": this.props.company["companyName"]});
    this.setState({ "companyEmail": this.props.company["companyEmail"]});
    this.setState({ "industry": this.props.company["industry"]});
    this.setState({ "companyWebsite": this.props.company["companyWebsiteURL"]});
    this.setState({ "companyLogoURL": this.props.company["companyLogoURL"]})

    this.fieldValues.companyName=this.props.company["companyName"];
    this.fieldValues.companyEmail=this.props.company["companyEmail"];
    this.fieldValues.companyWebsiteURL=this.props.company["companyWebsiteURL"];
    this.fieldValues.industry= this.props.company["industry"];
    this.fieldValues.companyPhoneNumber=this.props.company["companyPhoneNumber"];


    if(this.props.company["mainAddress"] == null){
        this.setState({ "address1": 'No Address 1' });
        this.setState({ "address2": 'No Address 2'});
        this.setState({ "poBoxNum": 'No PO Box Num'});
        this.setState({ "city": 'No City'});
        this.setState({ "state": 'No State'});
        this.setState({ "zipcode": 'No Zip Code '});
        this.setState({ "country": 'No Country'});

        this.fieldValues.mainAddress.address1='No Address 1';
        this.fieldValues.mainAddress.address2='No Address 2';
        this.fieldValues.mainAddress.poBoxNum='No PO Box Num';
        this.fieldValues.mainAddress.city='No City';
        this.fieldValues.mainAddress.state='No State';
        this.fieldValues.mainAddress.zipcode='No Zip Code ';
        this.fieldValues.mainAddress.country='No Country';


    }
    else{
        this.setState({ "address1": this.props.company["mainAddress"]["address1"]});
        this.setState({ "address2": this.props.company["mainAddress"]["address2"]});
        this.setState({ "poBoxNum": this.props.company["mainAddress"]["poBoxNum"]});
        this.setState({ "city": this.props.company["mainAddress"]["city"]});
        this.setState({ "state": this.props.company["mainAddress"]["state"]});
        this.setState({ "zipcode": this.props.company["mainAddress"]["zipcode"]});
        this.setState({ "country": this.props.company["mainAddress"]["country"]});


        this.fieldValues.mainAddress.address1=this.props.company["mainAddress"]["address1"];
        this.fieldValues.mainAddress.address2=this.props.company["mainAddress"]["address2"];
        this.fieldValues.mainAddress.poBoxNum=this.props.company["mainAddress"]["poBoxNum"];
        this.fieldValues.mainAddress.city= this.props.company["mainAddress"]["city"];
        this.fieldValues.mainAddress.state=this.props.company["mainAddress"]["state"];
        this.fieldValues.mainAddress.zipcode=this.props.company["mainAddress"]["zipcode"];
        this.fieldValues.mainAddress.country=this.props.company["mainAddress"]["country"];

    }

    //console.log(this.props.company["users"]);
    //this.setState({'users':this.props.company["users"]});
    //console.log(this.state.users);


  }

  uploadHandler(event) {
      // console.log('parent received:', event)
      // console.log('filesize:', event.size)
      // console.log('filename:', event.name)
      let filesize = (event.size/1024)/1024
      let filename = event.name
      let imgformat = filename.split('.')
      imgformat = imgformat[imgformat.length-1]
      if(imgformat=='jpg' || imgformat=='png' || imgformat=='jpeg') {
          if(filesize <= 1.00){
              let data = new FormData()
              data.append('companyLogoURL', event)
              data.append('userId', this.state.userProfile.userid)
              fetch(API_ROOT + '/api/company_profilepic/', {
                method: 'post',
                body: data
              }).then(res => res.json())
              .catch(error => console.error('Error:', error))
              .then(response => {
                if(response['companyLogoURL']!=null){
                  this.setState({
                                  'message':"Something went wrong Unable to update companyLogoURL",
                                  'title':"Error Message"
                               });
                  this.toggle();
                  //alert("Something went wrong Unable to update FullName");
                }else{
                  this.setState({
                                  'message':"companyLogoURL Picture Updated Successfully",
                                  'title':"Success Message"
                               });
                  this.toggle();
                  //alert("Profile Picture Updated Successfully");
                  this.getCompanyLogo();
                }
              });

            }else{
              this.setState({
                             'message':"File is larger then 1 MB",
                             'title':"Error Message"
                           });
              this.toggle();
              //alert('File is larger then 1 MB');
            }
          }else{
            this.setState({
                             'message':"Invalid File Format",
                             'title':"Error Message"
                           });
            this.toggle();
            //alert('Invalid File Format');
          }
  }

  resendEmailInvite(invite) {

      var formdata = new FormData();
      formdata.append('invitationemail', invite.emailId);
      formdata.append('senderemail', this.props.userInfo.email);
      formdata.append('first_name', invite.firstName);
      formdata.append('last_name', invite.lastName);
      formdata.append('userName', this.props.userInfo.userName);

      // console.log(this.props.userInfo);

      fetch(API_ROOT + '/user/invitation/', {
          method: 'post',
          body: formdata
      })
          .then(res => res.json())
          .catch(error => console.log(error))
          .then(response => {
              //console.log(response['message']);
              this.setState({'message': response['message']});
          });

      this.notify('success');
  }


  assembleUsers = () => {
    let inv;
    if(this.state.users){
        inv =this.state.users.map((user, index) => {
          return (
            {
              fname: user.first_name,
              lname: user.last_name,
              email: user.email,
              status: 'Active',
            }
          )
        });
    }
    else{
        inv = (
            {
              fname: '-',
              lname: '-',
              email: '-',
              status: '-',
            }
          );
    }
    return inv;
  }

  updateWhiteLabel(event) {
    event.preventDefault();
    this.setState({'message':'Please wait while updating company settings...'})
    setTimeout(this.setState({'message':""}), 3000);

    var myurl = event.target[0].value;
    var myfg1 = event.target[3].value;
    var myfg2 = event.target[5].value;
    var myb1 = event.target[7].value;
    var myb2 = event.target[9].value;
    var mybg = event.target[1].value;

    //console.log(this.props.userInfo);

    var formdata ={"userId":this.props.userInfo.userid,
                "name":"default",
                "logoUrl":myurl,
                "backgroundColor":mybg,
                "foregroundColor1":myfg1,
                "foregroundColor2":myfg2,
                "buttonColor1":myb1,
                "buttonColor2":myb2,
                "type":"put"}

    // console.log(this.props.userInfo);

    fetch(API_ROOT + '/api/wLabels/', {
      method: 'put',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify(formdata)
    })
      .then(res => res.json())
      .catch(error => console.log(error))
      .then(response => {
        //console.log(response['message']);

      });

      alert("Settings set successfully. The page will reload for the new settings to take effect")
      setTimeout(window.location.reload.bind(window.location), 3000);
  }
  handleColor(e,val){

  if(val=="logo"){
  this.setState({'wlChange':true,whitelabel: {'logo':e.target.value,
                              'foreground1':this.state.whitelabel.foreground1,
                              'foreground2':this.state.whitelabel.foreground2,
                              'buttonColor1':this.state.whitelabel.buttonColor1,
                              'buttonColor2':this.state.whitelabel.buttonColor2,
                              'backgroundColor':this.state.whitelabel.backgroundColor}})
  }
  if(val=="fg1"){
  this.setState({'wlChange':true,whitelabel: {'logo':this.state.whitelabel.logo,
                              'foreground1':e.target.value,
                              'foreground2':this.state.whitelabel.foreground2,
                              'buttonColor1':this.state.whitelabel.buttonColor1,
                              'buttonColor2':this.state.whitelabel.buttonColor2,
                              'backgroundColor':this.state.whitelabel.backgroundColor}})
  }
  if(val=="fg2"){
  this.setState({'wlChange':true,whitelabel: {'logo':this.state.whitelabel.logo,
                              'foreground1':this.state.whitelabel.foreground1,
                              'foreground2':e.target.value,
                              'buttonColor1':this.state.whitelabel.buttonColor1,
                              'buttonColor2':this.state.whitelabel.buttonColor2,
                              'backgroundColor':this.state.whitelabel.backgroundColor}})
  }
  if(val=="bg"){
  this.setState({'wlChange':true,whitelabel: {'logo':this.state.whitelabel.logo,
                              'foreground1':this.state.whitelabel.foreground1,
                              'foreground2':this.state.whitelabel.foreground2,
                              'buttonColor1':this.state.whitelabel.buttonColor1,
                              'buttonColor2':this.state.whitelabel.buttonColor2,
                              'backgroundColor':e.target.value}})
  }
    if(val=="bc1"){
  this.setState({'wlChange':true,whitelabel: {'logo':this.state.whitelabel.logo,
                              'foreground1':this.state.whitelabel.foreground1,
                              'foreground2':this.state.whitelabel.foreground2,
                              'buttonColor1':e.target.value,
                              'buttonColor2':this.state.whitelabel.buttonColor2,
                              'backgroundColor':this.state.whitelabel.backgroundColor}})
  }
   if(val=="bc2"){
  this.setState({'wlChange':true,whitelabel: {'logo':this.state.whitelabel.logo,
                              'foreground1':this.state.whitelabel.foreground1,
                              'foreground2':this.state.whitelabel.foreground2,
                              'buttonColor1':this.state.whitelabel.buttonColor1,
                              'buttonColor2':e.target.value,
                              'backgroundColor':this.state.whitelabel.backgroundColor}})
  }
  }

  sendInvitation = (event) => {
    event.preventDefault();
    this.setState({'message':'Please wait sending invitation...'});
    var fname = event.target[0].value;
    var lname = event.target[1].value;
    var email = event.target[2].value;

    //console.log(this.props.userInfo);

    var formdata = new FormData();
    formdata.append('invitationemail', email);
    formdata.append('senderemail', this.props.userInfo.email);
    formdata.append('first_name', fname);
    formdata.append('last_name', lname);
    formdata.append('userName', this.props.userInfo.userName);

    // console.log(this.props.userInfo);

    fetch(API_ROOT + '/user/invitation/', {
      method: 'post',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify(formdata)
    })
      .then(res => res.json())
      .catch(error => console.log(error))
      .then(response => {
        //console.log(response['message']);
        this.setState({'message':response['message']});
      });

      alert("Invitation resent sucessfully")
  }
  componentWillMount() {
    document.title = 'XSPACE | Organization'
  }

  componentDidMount(){
    this.props.getUserInfo();
    // console.log('retrieveCompany', this.props.retrieveCompany())
    this.props.retrieveCompany().then((res) => {
        // console.log('inside retrieveCompany', res);
      this.getUsers();
    }).catch((err) => {
      console.log(err)
    });
    // console.log(this.props.userInfo.whitelabel);
    if (this.props.userInfo.whitelabel)
      this.setState({
        'whitelabel': {'logo':this.props.userInfo.whitelabel.logo,
        'foreground1':this.props.userInfo.whitelabel.foreground1,
        'foreground2':this.props.userInfo.whitelabel.foreground2,
        'buttonColor1':this.props.userInfo.whitelabel.buttonColor1,
        'buttonColor2':this.props.userInfo.whitelabel.buttonColor2,
        'backgroundColor':this.props.userInfo.whitelabel.backgroundColor}
      });

  }

  handleClick = (e) => {
    e.preventDefault();

    if(e.currentTarget.getAttribute('name') === "logout"){
      localStorage.clear();
      window.location.reload();
    }
  }

  render() {
    let {userProfile} = this.state;
    let {userInfo} = this.props
    const errors = this.props.errors || {}
    const classes = useStyles

    const data = {
    columns: [
      {
        label: 'First Name',
        field: 'fname',
        sort: 'asc',
      },
      {
        label: 'Last Name',
        field: 'lname',
        sort: 'asc',
      },
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
    ],
    rows: this.state.usersRows
  };

     let WhiteLabelForm = (
      <Modal isOpen={this.state.modalWhitelabel} onRequestClose={this.closeWhiteLabelDialog} size="md" >
        <ModalHeader style={{ justifyContent: 'center' }}><label>White Labeling</label></ModalHeader>
        <ModalBody>

          <div className="row">

            <div className="col-md-12 form-group" style={{ margin: 'auto' }}>
              <form onSubmit={this.updateWhiteLabel}>

               <div style={{display:'flex', marginTop:'45px'}}>
                <div ><label style={{marginTop: '30px'}}>Primary Logo </label><div style={{ borderWidth:'thin',width:'160px',display: 'flex', borderStyle: 'solid', borderRadius:'10px',borderColor:'grey', marginRight:'25px'}}><input style={{width:'100px'}}type="url" className="form-control" name="logoInput" id="logoInput" required value={this.state.whitelabel.logo} onChange={(e)=>{this.handleColor(e,"logo")}}></input><img src={this.state.whitelabel.logo} style={{ width:'65px', height:'65px'}}></img></div></div>
                <div ><label style={{marginTop: '30px'}}>Background Color </label><div style={{ borderWidth:'thin',width:'160px',display: 'flex', borderStyle: 'solid', borderRadius:'10px',borderColor:'grey'}}><input type="text" value={this.state.whitelabel.backgroundColor} onChange={(e)=>{this.handleColor(e,"bg")}} style={{border:'none',width:'60px', borderRadius:"10px"}}></input><input type="color" className="form-control" name="bgcolor" id="bgcolor" required value={this.state.whitelabel.backgroundColor} onChange={(e)=>{this.handleColor(e,"bg")}} style={{ width:'20px', height:'20px', backgroundColor: this.state.whitelabel.backgroundColor, marginLeft:'60px'}}></input></div></div>
               </div>
               <div style={{display:'flex', marginTop:'45px'}}>
                <div ><label style={{marginTop: '30px', marginRight:'30px'}}>Primary Brand Color </label><div style={{ borderWidth:'thin',width:'160px',display: 'flex', borderStyle: 'solid', borderRadius:'10px',borderColor:'grey'}}><input type="text" value={this.state.whitelabel.foreground1} onChange={(e)=>{this.handleColor(e,"fg1")}} style={{border:'none',width:'60px', borderRadius:"10px"}}></input><input type="color" className="form-control" name="fcolor1" id="fcolor1" required value={this.state.whitelabel.foreground1} onChange={(e)=>{this.handleColor(e,"fg1")}} style={{ width:'20px', height:'20px', backgroundColor: this.state.whitelabel.foreground1, marginLeft:'60px'}}></input></div></div>
                <div ><label style={{marginTop: '30px'}}>Secondary Brand Color </label><div style={{ borderWidth:'thin',width:'160px',display: 'flex', borderStyle: 'solid', borderRadius:'10px',borderColor:'grey'}}><input type="text" value={this.state.whitelabel.foreground2} onChange={(e)=>{this.handleColor(e,"fg2")}} style={{border:'none',width:'60px', borderRadius:"10px"}}></input><input type="color" className="form-control" name="fcolor2" id="fcolor2" required value={this.state.whitelabel.foreground2} onChange={(e)=>{this.handleColor(e,"fg2")}} style={{ width:'20px', height:'20px', backgroundColor: this.state.whitelabel.foreground2, marginLeft:'60px'}}></input></div></div>
               </div>
               <div style={{display:'flex', marginTop:'45px'}}>
                <div ><label style={{marginTop: '30px', marginRight:'30px'}}>Primary Button Color </label><div style={{ borderWidth:'thin',width:'160px',display: 'flex', borderStyle: 'solid', borderRadius:'10px',borderColor:'grey'}}><input type="text" value={this.state.whitelabel.buttonColor1} onChange={(e)=>{this.handleColor(e,"bc1")}} style={{border:'none',width:'60px', borderRadius:"10px"}}></input><input type="color" className="form-control" name="bcolor1" id="bcolor1" required value={this.state.whitelabel.buttonColor1} onChange={(e)=>{this.handleColor(e,"bc1")}} style={{ width:'20px', height:'20px', backgroundColor: this.state.whitelabel.buttonColor1, marginLeft:'60px'}}></input></div></div>
                <div ><label style={{marginTop: '30px'}}>Secondary Button Color </label><div style={{ borderWidth:'thin',width:'160px',display: 'flex', borderStyle: 'solid', borderRadius:'10px',borderColor:'grey'}}><input type="text" value={this.state.whitelabel.buttonColor2} onChange={(e)=>{this.handleColor(e,"bc2")}} style={{border:'none',width:'60px', borderRadius:"10px"}}></input><input type="color" className="form-control" name="bcolor2" id="bcolor2" required value={this.state.whitelabel.buttonColor2} onChange={(e)=>{this.handleColor(e,"bc2")}} style={{ width:'20px', height:'20px', backgroundColor: this.state.whitelabel.buttonColor2, marginLeft:'60px'}}></input></div></div>
               </div>
                <Button disabled={!this.state.wlChange} type="submit" color="green">Set New Css Settings</Button>{' '}
              </form>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div style={{marginRight:'45px',fontWeight:'600'}}>{this.state.message}</div>
          <Button color="red" onClick={this.closeWhiteLabelDialog}>Close</Button>{' '}
        </ModalFooter>
      </Modal>
    )

    let InvitationForm = (
      <Modal isOpen={this.state.modalinvitation} onRequestClose={this.closeInvitationDialog} size="md" >
        <ModalHeader style={{ justifyContent: 'center' }}><label>Invite User</label></ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12 form-group" style={{ margin: 'auto' }}>
              <form onSubmit={this.sendInvitation}>
                <div style={{ margin: '15px 0px' }}><label>First Name </label><input type="text" className="form-control" name="fname" id="fname" required></input></div>
                <div style={{ margin: '15px 0px' }}><label>Last Name </label><input type="text" className="form-control" name="lname" id="lname" required></input></div>
                <div style={{ margin: '15px 0px' }}><label>Email ID </label><input type="email" className="form-control" name="email" id="email" required></input></div>
                <Button type="submit" color="green">Send Invitation</Button>{' '}
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
            processing={this.state.processing}>
          </UpgradeView>
        </ModalBody>
      </Modal>
    );

    // Modal for editing company information
    let editToggle = (
        <CompanyInfoEditStyledModal className="edit-company-info-modal" isOpen={this.state.editCompany}
                                    toggle={this.toggleEditCompany} centered>
            <ModalHeader className="black-text" toggle={this.toggleEditCompany}>Edit Company Info </ModalHeader>
            <ModalBody >
              <CompanyEdit
                company={this.state.company}
                updateCompany={this.props.updateCompany}
                uploadHandler={this.uploadHandler}
                fieldValues={this.fieldValues}
                processing={this.state.processing}
                notify={this.notify}
                cancel={this.toggleEditCompany}
              />
            </ModalBody>
        </CompanyInfoEditStyledModal>
    );

    return (
      <div className="container">
        {pop}
        {upgrade}
        {editToggle}
        {WhiteLabelForm}
        <FlexView>
          <LeftPanel>
            <LeftSideMenu key={4} data={this.props}/>
          </LeftPanel>
          <RightPanelWrapper>
            <div className='company-header'>
              <div>
                <h1>{this.state.companyName}</h1>
                <p>{this.state.industry} / {this.state.companyWebsite}</p>
              </div>
              <div className='profile-edit'>
                  {this.state.companyLogoURL ? (
                      <div style={{backgroundImage: `${this.state.companyLogoURL}`}}>
                          <img src={`${this.state.companyLogoURL}`}/>
                      </div>
                      ) : (
                          <div>
                              <CircularProgress />
                          </div>
                      )}

                {/*<img src={`${this.state.companyLogoURL}`} alt='' onClick={this.evaluateAccess}/>*/}
                <i className="fa fa-edit" onClick={this.toggleEditCompany}/>
                {/* <MDBBtn className="mt-3" gradient="peach" onClick={this.toggleEditCompany}>
                  <MDBIcon icon="users" className="mr-1" />
                </MDBBtn> */}
                <WhiteLabel data={this.props.userInfo} closeWhiteLabelDialog={this.closeWhiteLabelDialog}/>
              </div>
            </div>
            <h5 style={{display: 'block', width:'100%', borderBottom: "1px solid #ccc"}}>Organization Details</h5>
            <div className='flex-div'>
                <div>
                    <p>Company Admin Email</p>
                    <b>{this.state.companyEmail}</b>
                </div>
                {/*<div>*/}
                {/*    <p>Company</p>*/}
                {/*    <b>{this.state.companySlug}</b>*/}
                {/*</div>*/}
            </div>
            <div className='flex-div'>
              <div>
                <p>Address 1</p>
                <b>{this.state.address1}</b>
              </div>
              <div>
                <p>Address 2</p>
                <b>{this.state.address2}</b>
              </div>
            </div>
            <div className='flex-div'>
                {/*<div>*/}
                {/*  <p>PO Box Number</p>*/}
                {/*  <b>{this.state.poBoxNum}</b>*/}
                {/*</div>*/}
                <div>
                    <p>City / State / Zip</p>
                    <b>{this.state.city}, {this.state.state} {this.state.zipcode}</b>
                </div>

                <div style={{paddingBottom: 35}}>
                  <p>Country</p>
                  <b>{this.state.country}</b>
                </div>
            </div>
            <h5 style={{display: 'block', width:'100%', borderBottom: "1px solid #ccc", paddingBottom: 0}}>Active Users</h5>
            <StyledTable>
              <MDBDataTable
                responsive
                hover
                data={data}
              />
            </StyledTable>
            <Modal backdrop="false" isOpen={this.state.modal} toggle={this.toggle} style={{paddingTop:'0%', paddingBottom:'25%', overflowY: "auto", maxHeight: '100%',}} centered>
              <ModalHeader toggle={this.toggle}>Change Company Logo</ModalHeader>
              <ModalBody style={{padding: 0}}>
                <div>{this.state.message}</div>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" name="close" onClick={this.toggle}>Close</Button>{' '}
              </ModalFooter>
            </Modal>
          </RightPanelWrapper>
        </FlexView>
      </div>
  )
  }
}
