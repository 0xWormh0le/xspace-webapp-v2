import React, {Component, Fragment} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { ToastContainer, MDBBtn, MDBIcon, toast, Alert, Button, Modal, ModalBody, ModalHeader, ModalFooter, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'
import UserEmailEditFormView from './UserEmailEditFormView';
import UserNameEditFormView from './UserNameEditFormView';
import UserPasswordEditFormView from './UserPasswordEditFormView';
import TwoFactorAuthEditFormView from './TwoFactorAuthEditFormView';
import TimeZoneEditFormView from './TimeZoneEditFormView';
import LanguageEditFormView from './LanguageEditFormView';
import LeftSideMenu from './menu/LeftSideMenu'
import { MDBTooltip } from 'mdbreact';
import TextInput from '../lib/TextInput'
import styled from 'styled-components'
import { FlexView, LeftPanel, RightPanel } from './ecommerceapi/ApiKeyView'

import { API_ROOT } from '../index';

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
      background-color: white;
      border: 2px solid #F4F5FA;
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
    width: 133px;
    height: 38px;
    border-radius: 19px;
    border: none;
    :hover {
      background-color: #EB5757;
      color: white;
      cursor: pointer;
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

export default class AppsView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      userProfile: [],
      storeCreate: false,
      appCreate: false,

    };
    this.handleClick = this.handleClick.bind(this);
    this.notify = this.notify.bind(this);

    this.storeCreateDialog = this.storeCreateDialog.bind(this);
    this.appCreateDialog = this.appCreateDialog.bind(this);
    this.createApplication = this.createApplication.bind(this);
    this.createStore = this.createStore.bind(this);

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

  appCreateDialog(){
   this.setState({
      appCreate: !this.state.appCreate
    });
  }

  storeCreateDialog(){
   this.setState({
      storeCreate: !this.state.storeCreate
    });
  }

  createApplication(){

  }

  createStore(){

  }

  handleClick(e) {
    e.preventDefault();

    if(e.currentTarget.getAttribute('name')==="logout"){
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

            let msg = (<Fragment><i className="fa fa-envelope-open" style={{paddingRight: '10px', paddingLeft: '10px'}}/><p className="d-inline-block">   Your invitation was successfully sent.</p></Fragment>);
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

     let createStoreModal = (
      <Modal isOpen={this.state.storeCreate} onRequestClose={this.storeCreateDialog} size="lg" >
        <ModalHeader style={{ justifyContent: 'left' }}><label><b>Connect A New Store</b></label></ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-7">
                <div className="mb-3"> <label><b>Store Name</b></label><input type="text" placeholder="Store Name" className="form-control" name="storename" id="storename" required></input></div>
                <div className="mb-3"><label><b>Store Description</b></label><input type="text" placeholder="Store Description" className="form-control" name="storedesc" id="storedesc" required></input></div>
                <div className="mb-3"><label><b>Store Link</b></label><input type="text" placeholder="i.e. https://awesomeshop.shopify.com" className="form-control" name="storelink" id="storelink" required></input></div>

                <div className="label-content">
                    <label><b>Choose Your E-Commerce Platform</b></label>
                    <p>Please select the store type associated with your e-commerce software. If you are not using an exisitng e-commerce platform,
                    select the custom applications to host your store front.</p>
                    <select onChange={this.handleOnChangeEcommercePlatform} className="browser-default custom-select">
                      <option value="shopify">Shopify</option>
                      <option value="magento">Magento</option>
                      <option value="woocommerce">WooCommerce</option>
                      <option value="bigcommerce">BigCommerce</option>
                    </select>
                </div>

                <div className="row">
                    <div className="col-md-12">
                     <MDBBtn className="mt-3" gradient="aqua" onClick={this.appCreateDialog}>
                        <MDBIcon icon="download" className="mr-1" />     Download Plugin
                     </MDBBtn>
                    </div>
                </div>

            </div>
            <div className="col-md-5">
                <img src="https://xspaceapp.com/wp-content/uploads/2019/05/icons8-box-500.png" width='300' height='300'></img>
                <center><p>Once you connect your store, you can control products, assets, settings and more.</p></center>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="red" onClick={this.storeCreateDialog}>Close</Button>{' '}
          <MDBBtn color="green" onClick={this.appCreateDialog}>
              <MDBIcon icon="plus" className="mr-1" />    Create Store
          </MDBBtn>
        </ModalFooter>
      </Modal>
    )

    let appCreateModal = (
      <Modal isOpen={this.state.appCreate} onRequestClose={this.appCreateDialog} size="lg" >
        <ModalHeader style={{ justifyContent: 'left' }}><label><b>Create A New Application</b></label></ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-7">
                <div className="mb-3"> <label><b>App Name</b></label><input type="text" placeholder="App Name" className="form-control" name="storename" id="storename" required></input></div>
                <div className="mb-3"><label><b>App Description</b></label><input type="text" placeholder="App Description" className="form-control" name="storedesc" id="storedesc" required></input></div>
                <div className="mb-3"><label><b>App Domain</b></label><input type="text" placeholder="i.e. https://awesomewebapp.com" className="form-control" name="storelink" id="storelink" required></input></div>
                <div className="mb-3"><label><b>App Callback URL</b></label><input type="text" placeholder="i.e. https://awesomewebapp.com/api/v1/callback.js" className="form-control" name="storelink" id="storelink" required></input></div>

                <div className="row">
                    <div className="col-md-12">
                     <MDBBtn className="mt-3" color="blue" onClick={this.appCreateDialog}>
                        <MDBIcon icon="magic" className="mr-1" />    How Do I Connect An App?
                     </MDBBtn>
                    </div>
                    <div className="col-md-12">
                     <MDBBtn className="mt-3" color="red" onClick={this.appCreateDialog}>
                        <MDBIcon icon="download" className="mr-1" />     Download SDK
                     </MDBBtn>
                    </div>
                </div>

            </div>
            <div className="col-md-5">
                <img src="https://xspaceapp.com/wp-content/uploads/2019/05/icons8-console-512.png" width='300' height='300'></img>
                <center><p>Once you create your app, you can control products, assets, settings and more.</p></center>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="red" onClick={this.appCreateDialog}>Close</Button>{' '}
          <MDBBtn color="green" onClick={this.appCreateDialog}>
              <MDBIcon icon="plus" className="mr-1" />    Create App
          </MDBBtn>
        </ModalFooter>
      </Modal>
    )

    return (
      <div className="container">
        {pop}
        {createStoreModal}
        {appCreateModal}
        <FlexView>
          <LeftPanel>
            <LeftSideMenu data={this.props}></LeftSideMenu>
          </LeftPanel>
          <RightPanel>
            <Wrapper>
              <div className='wrapper-header'>
                <div>
                  <Link className="nav-link active" to="/myaccount/setting">My Stores</Link>
                  <Link className="nav-link" to="/myaccount/edit">My Apps</Link>
                </div>
              </div>
              <div className='wrapper-body'>
                <DetailBox>
                  <div className='box-title'>
                    <h3>My Stores</h3>
                    <img src='' alt=''/>
                  </div>
                  <div className='box-body'>
                    <div>
                      <p>Your identifier is</p>
                      <b></b>
                      <MDBBtn className="mt-3" gradient="aqua" onClick={this.appCreateDialog}>
                            <MDBIcon icon="plus" className="mr-1" />     Add A New Custom App
                     </MDBBtn>
                     <MDBBtn className="mt-3" gradient="aqua" onClick={this.storeCreateDialog}>
                            <MDBIcon icon="plus" className="mr-1" />     Add A New Store
                     </MDBBtn>

                    </div>
                    <div>
                      <span>Disclaimer:</span>
                      <span>We use your identifier for developer and support purposes only.</span>
                    </div>
                  </div>
                </DetailBox>
              </div>
            </Wrapper>
          </RightPanel>

        </FlexView>
      </div>
  )
  }
}
