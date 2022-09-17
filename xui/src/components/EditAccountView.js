import React, {Component, Fragment} from 'react'
import styled from 'styled-components'
import { Link } from "react-router-dom";
import {Modal, ModalBody, ModalHeader, ModalFooter, Alert, Button, Form, MDBModal, toast} from 'mdbreact'
import OccupationEditFormView from './OccupationEditFormView'
import PhoneEditFormView from './PhoneEditFormView'
import LeftSideMenu from './menu/LeftSideMenu'
import './userprofile.css'
import { API_ROOT } from '../index'
import { FlexView, LeftPanel, RightPanel } from './ecommerceapi/ApiKeyView'
import { Wrapper } from './MyAccountView'
import ProfileEdit from "./ProfileEdit";
import {makeStyles} from "@material-ui/core/styles";

const AccountWrapper = styled(Wrapper)`
  .wrapper-body {
    .user-profile-section {
      display: flex;
      align-items: center;
      img {
        width: 100px;
        height: 100px;
        margin-right: 35px;
      }
      h1 {
        font-size: 48px;
        color: #333330;
        line-height: 62px;
        font-weight: bold;
        margin: 0;
      }
      div {
        position: relative;
        margin-left: 30px;
        input {
          opacity: 0;
          width: 18px;
        }
        i {
          font-size: 18px;
          color: #000000;
          :hover {
            cursor: pointer;
          }
        }
      }
    }
    .user-detail-section {
      display: flex;
      justify-content: space-between;
      padding-top: 55px;
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

const ProfileInfoEditStyledModal = styled(StyledModal)`
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

export default class EditProfilePageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      userName: props.userName,
      'userProfile': [],
      profilePic: '/icons8-customer-128.png',
      message: '',
      title: '',
      editProfile: '',
      companyRole: '',
      email:'',
      firstName: '',
      lastName: '',
      fullName: '',
      phoneNum: '',
      profileURL:'',
      permissions:'',
    }

    this.toggle = this.toggle.bind(this);
    this.handleProfileImageError = this.handleProfileImageError.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.uploadProfileImage = this.uploadProfileImage.bind(this);
    this.toggleEditProfile = this.toggleEditProfile.bind(this);
    this.notify = this.notify.bind(this);
    this.get_profilePic = this.get_profilePic.bind(this);
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

  toggleEditProfile() {
    this.setState({
      editProfile: !this.state.editProfile
    });
  }

  componentWillMount() {
    document.title = 'XSPACE | Edit Account'
    console.log("Component WILL mount in EditAccountView")
    this.setState({'userProfile':this.props.userInfo || '' })
  }

  componentDidMount() {
    console.log("Component DID mount in EditAccountView")
      this.setState({'userProfile':this.props.userInfo || '' });
      this.setState({ "userName": this.props.userInfo.userName});
      this.setState({ "companyRole": this.props.userInfo.companyRole});
      this.setState({ "email": this.props.userInfo.email});
      this.setState({ "firstName": this.props.userInfo.firstName});
      this.setState({ "lastName": this.props.userInfo.lastName});
      this.setState({ "fullName": this.props.userInfo.fullName});
      this.setState({ "phoneNum": this.props.userInfo.phoneNum});
      this.setState({ "profileURL": this.props.userInfo.profileURL});
      this.setState({ "permissions": this.props.userInfo.permissions});
  }

  componentWillReceiveProps(nextProps, nextContext) {
      this.setState({'userProfile':nextProps.userInfo || '' })
      let checkAgainstPrevious = JSON.stringify(nextProps.userProfile) !== JSON.stringify(this.props.userProfile)
      console.log('check', checkAgainstPrevious)
      console.log('nextProps', JSON.stringify(nextProps.userProfile), JSON.stringify(this.props.userProfile))
      if (checkAgainstPrevious) {
        this.setState({ "userName": nextProps.userInfo.userName});
        this.setState({ "companyRole": nextProps.userInfo.companyRole});
        this.setState({ "email": nextProps.userInfo.email});
        this.setState({ "firstName": nextProps.userInfo.firstName});
        this.setState({ "lastName": nextProps.userInfo.lastName});
        this.setState({ "fullName": nextProps.userInfo.fullName});
        this.setState({ "phoneNum": nextProps.userInfo.phoneNum});
        this.setState({ "profileURL": nextProps.userInfo.profileURL});
        this.setState({ "permissions": nextProps.userInfo.permissions});
      } else {
        this.setState({ "profilePic": '/icons8-customer-128.png'});
      }
      this.setState({ "userProfile": nextProps.userInfo }, () => {
                console.log('updated', this.state.userProfile)
            });
  }


  uploadProfileImage(){
    this.props.uploadProfilePic().then((response)=>{

    }).catch((error)=>{

    })
  }

  handleProfileImageError(e) {
    this.setState({profilePic: '/icons8-customer-128.png'});
  }

  notify(type){
        switch (type) {
          case 'info':
            toast.info('Info message', {
              autoClose: 3000
            });
            break;
          case 'success2':
            let msg2 = (<Fragment><i className="fa fa-envelope-open"
                                     style={{paddingRight: '10px', paddingLeft: '10px'}}/>
                                     <p className="d-inline-block">   Your profile was successfully updated.</p>
            </Fragment>);
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

  uploadHandler(event) {
      let filesize = (event.size/1024)/1024
      let filename = event.name
      let imgformat = filename.split('.')
      imgformat = imgformat[imgformat.length-1]
      if(imgformat==='jpg' || imgformat==='png' || imgformat==='jpeg') {
          if(filesize <= 1.00){
              let data = new FormData()
              console.log("submitting image at:", event, '/api/user_profilepic/')
              data.append('profileURL', event)
              data.append('userId', this.state.userProfile.userid)
              fetch(API_ROOT + '/api/user_profilepic/', {
                method: 'post',
                body: data
              }).then(res => res.json())
              .catch(error => console.error('Error:', error))
              .then(response => {
                if(response['profileURL']!=null){
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
                  this.get_profilePic();
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

  get_profilePic(){
      if(this.state.profileURL === ''){
          // console.log("getCompanyLogo set logo as:", 'icons8-customer-128.png')
          return 'icons8-customer-128.png'
      }
      else{
          // console.log("getCompanyLogo set logo as:", this.state.companyLogoURL)
          return this.state.profileURL
      }
  }

  handleInputChange = (event) => {
    console.log('hitting handle Input Change')
    const target = event.target,
          value = target.type ===
            'checkbox' ? target.checked : target.value,
          name = target.name
    this.setState({
      [name]: value
    });
  }

  render() {
    const errors = this.props.errors || {}
    console.log("userProfile", this.state.userProfile)
    // Modal for editing company information
    let editToggle = (
        <ProfileInfoEditStyledModal className="edit-company-info-modal" isOpen={this.state.editProfile}
                                    toggle={this.toggleEditProfile} centered>
            <ModalHeader className="black-text" toggle={this.toggleEditProfile}>Edit Profile Info </ModalHeader>
            <ModalBody >
              <ProfileEdit
                profile={this.state.userProfile}
                updateProfile={this.props.updateUserDetails}
                uploadHandler={this.uploadHandler}
                notify={this.notify}
                cancel={this.toggleEditProfile}
              />
            </ModalBody>
        </ProfileInfoEditStyledModal>
    );

    return (
      <div className="container">
        {editToggle}
        <FlexView>
          <LeftPanel>
            <LeftSideMenu key={1} data={this.props} perms={this.state.permissions}/>
          </LeftPanel>
          <RightPanel>
            <AccountWrapper>
              <div className='wrapper-header'>
                <div>
                  <Link className="nav-link" to="/myaccount/setting">Settings</Link>
                  <Link className="nav-link active" to="/myaccount/edit">Edit Profile</Link>
                  <Link className="nav-link" to="/myaccount/notification">Notifications</Link>

                </div>
              </div>
              <div className='wrapper-body'>
                <div className='user-profile-section'>
                  {console.log('userprofile', this.state, this.state.profilePic)}
                  <img src={this.state.profileURL ? this.state.profileURL : this.state.profilePic} alt="Profile Pic" />
                  <h1>{this.state.fullName}</h1>
                  <div>
                    {/*<input className="box__file" type="file" name="file" id="file1" onChange={this.uploadHandler} style={{display:'none'}}  />*/}
                    <i className="fa fa-edit" onClick={this.toggleEditProfile} />
                  </div>
                </div>
                {/* <UserFullNameEditFormView
                  userInfo={userProfile}
                  updateFullName={this.props.updateUserDetails}
                  getUserInfo={this.props.getUserInfo}>
                </UserFullNameEditFormView> */}
                <div className='user-detail-section'>
                  <OccupationEditFormView
                    userInfo={this.state}
                    updateRole={this.props.updateUserDetails}
                    getUserInfo={this.props.getUserInfo} />
                  <PhoneEditFormView
                    userInfo={this.state}
                    accessToken={this.props.accessToken}
                    updatePhone={this.props.updateUserDetails}
                    getUserInfo={this.props.getUserInfo} />
                </div>
              </div>
            </AccountWrapper>
            <Modal backdrop="false" isOpen={this.state.modal} toggle={this.toggle} style={{top:'25%'}} centered>
              <ModalHeader toggle={this.toggle}>{this.state.title}</ModalHeader>
              <ModalBody>
                <div>{this.state.message}</div>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" name="close" onClick={this.toggle}>Close</Button>{' '}
              </ModalFooter>
            </Modal>
            </RightPanel>
          </FlexView>
        </div>
      );
    }
}
