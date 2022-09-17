import React, {Component, Fragment} from 'react'
import styled from 'styled-components'
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'mdbreact'
import UserEmailEditFormView from './UserEmailEditFormView';
import UserNameEditFormView from './UserNameEditFormView';
import UserPasswordEditFormView from './UserPasswordEditFormView';
import TwoFactorAuthEditFormView from './TwoFactorAuthEditFormView';
import TimeZoneEditFormView from './TimeZoneEditFormView';
import LanguageEditFormView from './LanguageEditFormView';
import LeftSideMenu from './menu/LeftSideMenu'
import { MDBTooltip } from 'mdbreact';
import TextInput from '../lib/TextInput'

import { API_ROOT } from '../index';

import { FlexView, LeftPanel, RightPanel } from './ecommerceapi/ApiKeyView'
import commentImg from '../assets/img/comment.png'
import StyledTooltip from '../lib/tooltip'

export const Wrapper = styled.div`
  position: relative;
  .wrapper-header {
    display: flex;
    padding: 1rem 25px;
    border-bottom: 2px solid #F4F5FA;
    & > div {
      padding: 4px;
      border: 2px solid #F4F5FA;
      background-color: rgba(244, 245, 250, .4);
      display: flex;
      border-radius: 20px;
    }
    a {
      display: flex;
      width: 116px;
      height: 30px;
      border-radius: 15px;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #333333;
      font-weight: bold;
      line-height: 20px;
      border: 2px solid #F4F5FA;
      background-color: white;
      margin: 0 2px;      
      &:hover, &.active {
        background-color: #00A3FF;
        color: white;
        border: none;
      }
    }
  }
  .wrapper-body {
    padding: 72px 50px;
  }
  .singout-button {
    position: absolute;
    bottom: 10px;
    right: 50px;
    color: #EB5757;
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
    width: 213px;
    height: 58px;
    border-radius: 29px;
    border: 2px solid #F4F5FA;
    :hover {
      background-color: #EB5757;
      color: white;
      cursor: pointer;
      border: none;
    }
  }
`

export const DetailBox = styled.div`
  padding-bottom: 35px;
  .box-title {
    display: flex;
    max-width: 188px;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 4px;
    h3 {
      color: #333330;
      font-size: 18px;
      line-height: 26px;
      margin: 0;
      font-weight: 400;
    }
    img {
      width: 18px;
      height: 18px;
    }
  }
  .box-body {
    display: flex;
    justify-content: space-between;
    div {
      margin-right: 30px;
    }
    div:last-child {
      margin-right: 0;
    }
    p, b {
      margin: 0;
      font-size: 14px;
      color: #000000;
      line-height: 20px;
    }
    p {
      opacity: .5;
    }
    span {
      display: block;
      font-size: 12px;
      line-height: 20px;
      color: #333330;
    }
  }
`

export default class MyAccount extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      'userProfile': []
    };
    this.handleClick = this.handleClick.bind(this);
    this.notify = this.notify.bind(this);
  }

  componentWillMount() {
    document.title = 'XSPACE | My Account'
  }

  componentWillReceiveProps(nextProps) {
    this.setState({'userProfile':nextProps.userInfo || '' })    
  }

  componentDidMount(){
    this.props.getUserInfo()
  }

  handleClick(e) {
    e.preventDefault();

    if(e.currentTarget.getAttribute('name')=="logout"){
      localStorage.clear();
      window.location.reload();
    }
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
      default:
        toast.info('Info message', {
          autoClose: 3000
        });
    }
  }

  render() {
    let {userProfile} = this.state;
    let {userInfo} = this.props
    const errors = this.props.errors || {}

     let pop = (<Fragment>
        <ToastContainer
          hideProgressBar={false}
          newestOnTop={true}
          autoClose={7000}
          bodyClassName="notification-body"
          className="animated fadeIn"
        />
      </Fragment>)

    return (
      <div className="container">
        {pop}
        <FlexView>
          <LeftPanel>
            <LeftSideMenu data={this.props} ></LeftSideMenu>
          </LeftPanel>
          <RightPanel>
            <Wrapper>
              <div className='wrapper-header'>
                <div>
                  <Link className="nav-link active" to="/myaccount/setting">Settings</Link>
                  <Link className="nav-link" to="/myaccount/edit">Edit Profile</Link>
                  <Link className="nav-link" to="/myaccount/notification">Notifications</Link>

                </div>
              </div>
              <div className='wrapper-body'>
                <DetailBox>
                  <div className='box-title'>
                    <h3>Account Identifier</h3>
                    <StyledTooltip txt={'We use your identifier for developer and support purposes only.'}>
                      <img src={commentImg} alt=''/>
                    </StyledTooltip>
                  </div>
                  <div className='box-body'>
                    <div>
                      <p>Your identifier is</p>
                      <b>{userProfile.userName}</b>
                    </div>
                    <div>
                      <span>Disclaimer:</span>
                      <span>We use your identifier for developer and support purposes only.</span>
                    </div>
                  </div>
                </DetailBox>
                <UserEmailEditFormView 
                  userInfo={userProfile}
                  updateEmail={this.props.updateUserDetails}>
                  notify={this.notify}
                </UserEmailEditFormView>
                <UserPasswordEditFormView 
                  userInfo={userProfile}
                  updatePassword={this.props.updateUserDetails}
                  userId={this.props.userId}
                />
                <input type="submit" value="Sign Out" onClick={this.handleClick} name="logout" className="singout-button"/>
              </div>              
            </Wrapper>
          </RightPanel>
        </FlexView>
      </div>
  )
  }
}
