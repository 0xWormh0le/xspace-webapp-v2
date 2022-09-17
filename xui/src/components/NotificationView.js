import React, {Component, Fragment} from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import LeftSideMenu from './menu/LeftSideMenu'
import { MDBSwitch } from "mdbreact";
import { ToastContainer, toast } from 'mdbreact';

import { FlexView, LeftPanel, RightPanel } from './ecommerceapi/ApiKeyView'
import { Wrapper } from './MyAccountView'

const NotificationWrapper = styled(Wrapper)`
  .notification-row {
    display: flex;
    padding-bottom: 40px;
    .left-item {
      width: 65%;
      margin-right: 50px;
      h3 {
        font-size: 18px;
        line-height: 26px;
        color: #333330;
        font-weight: 400;
        margin: 0;
      }
      p {
        font-size: 14px;
        line-height: 20px;
        opacity: .5;
        margin: 0;
        max-width: 455px;
      }
    }
    .right-item {
      flex: 1;
      .notification-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        b {
          font-size: 18px;
          line-height: 26px;
          color: #333330;
          font-weight: 400;
        }
      }
    }
  }
`

export default class NotificationPageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
            dropdownOpen: false,
            switch1: true,
            userProfile: []
        };

        this.notify = this.notify.bind(this);
    }

    componentDidMount() {
        if(this.props.isAuthenticated && this.props.userInfo === undefined){
            this.props.getUserInfo()
        }else{
            this.setState({'userProfile':this.props.userInfo || '' })
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({'userProfile':nextProps.userInfo || '' })
    }


    handleSwitchChange = nr => () => {
        let switchNumber = `switch${nr}`;
        this.setState({
            [switchNumber]: !this.state[switchNumber]
        });
    }

    notify(type){
        return () => {
            switch (type) {
                case 'info':
                    toast.info('Info message', {
                        autoClose: 3000
                    });
                    break;
                case 'success':
                    let msg = (<Fragment><i className="fa fa-cog" style={{paddingRight: '10px', paddingLeft: '10px'}}/>
                        <p className="d-inline-block">   Your setting was successfully set.</p></Fragment>);
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
                    break;
            }
        };
    };

    render() {

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
                        <LeftSideMenu data={this.props}/>
                    </LeftPanel>
                    <RightPanel>
                        <NotificationWrapper>
                            <div className='wrapper-header'>
                                <div>
                                    <Link className="nav-link" to="/myaccount/setting">Settings</Link>
                                    <Link className="nav-link" to="/myaccount/edit">Edit Profile</Link>
                                    <Link className="nav-link active" to="/myaccount/notification">Notifications</Link>

                                </div>
                            </div>
                            <div className='wrapper-body'>
                                <div className='notification-row'>
                                    <div className='left-item'>
                                        <h3>Preferred Method of Notifications</h3>
                                        <p>You may recieve push notifications via email and/or SMS in addition to checking notifications right on the dashboard.</p>
                                    </div>
                                    <div className='right-item'>
                                        <div className='notification-item'>
                                            <b>EMAIL:</b>
                                            <MDBSwitch labelLeft="" labelRight="" checked={this.state.switch1} onChange={this.notify("success")}/>
                                        </div>
                                        <div className='notification-item'>
                                            <b>SMS/TEXT:</b>
                                            <MDBSwitch labelLeft="" labelRight="" disabled />
                                        </div>
                                    </div>
                                </div>

                                <div className='notification-row'>
                                    <div className='left-item'>
                                        <h3>Notify Me When I Get Direct Messages on XSPACE</h3>
                                        <p>When a user sends you a message (including replies), send me a notification via Email</p>
                                    </div>
                                    <div className='right-item'>
                                        <div className='notification-item'>
                                            <b>EMAIL:</b>
                                            <MDBSwitch labelLeft="" labelRight="" checked={this.state.switch1} onChange={this.notify("success")}/>
                                        </div>
                                    </div>
                                </div>

                                <div className='notification-row'>
                                    <div className='left-item'>
                                        <h3>Notify Me When A Product in My Catalog Has Been Edited.</h3>
                                        <p>Whenever an Edit is made to a product in your personal catalog, send me a notification via email</p>
                                    </div>
                                    <div className='right-item'>
                                        <div className='notification-item'>
                                            <b>EMAIL:</b>
                                            <MDBSwitch labelLeft="" labelRight="" checked={this.state.switch1} onChange={this.notify("success")} />
                                        </div>
                                    </div>
                                </div>

                                <div className='notification-row'>
                                    <div className='left-item'>
                                        <h3>Notify Me When My Changes To A Product/Catalog Has Been Approved/Denied</h3>
                                        <p>Whenever you make an edit to someone else&quot;s product/catalog the owner can approve or deny your changes. When this happens, send me a notification via email.</p>
                                    </div>
                                    <div className='right-item'>
                                        <div className='notification-item'>
                                            <b>EMAIL:</b>
                                            <MDBSwitch labelLeft="" labelRight="" checked={this.state.switch1} onChange={this.notify("success")}/>
                                        </div>
                                    </div>
                                </div>

                                <div className='notification-row'>
                                    <div className='left-item'>
                                        <h3>Notify Me When My Capture Orders Are Updated</h3>
                                        <p>Whenever your capture order has been update in its process, send me a notification via EMAIL.</p>
                                    </div>
                                    <div className='right-item'>
                                        <div className='notification-item'>
                                            <b>EMAIL:</b>
                                            <MDBSwitch labelLeft="" labelRight="" checked={this.state.switch1} onChange={this.notify("success")} />
                                        </div>
                                    </div>
                                </div>

                                <div className='notification-row'>
                                    <div className='left-item'>
                                        <h3>Notify Me When I Recieve A Connection Request</h3>
                                        <p>Whenever a user requests a social connection request, send me a notification via email.</p>
                                    </div>
                                    <div className='right-item'>
                                        <div className='notification-item'>
                                            <b>EMAIL:</b>
                                            <MDBSwitch labelLeft="" labelRight="" checked={this.state.switch1} onChange={this.notify("success")} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </NotificationWrapper>
                    </RightPanel>
                </FlexView>
            </div>
        );
    }
}
