import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Dropdown, DropdownItem, DropCollapse, DropdownMenu, DropdownToggle, Collapse, NavItem, NavLink, MDBIcon} from 'mdbreact';
import { Offline, Online, Detector } from "react-detect-offline";
import ViewAllNotifications from './ViewAllNotifications'
import { API_ROOT } from '../index';
import { Button,  Modal, ModalBody, ModalHeader, ModalFooter, Container } from 'mdbreact';
import './notifications.css'
import { MDBBtn,MDBCard, MDBDataTable, cssTransition  } from "mdbreact";
import styled from 'styled-components'


const Bell = styled.i`
    .bell {
        position: relative;
        display: inline-block;
        overflow: visible;
        width: 21px;
        height: 22px;
        left: 0px;
        top: 0px;
        transform: matrix(1,0,0,1,0,0);
    }
`
const Table = styled(MDBDataTable)`
  tr {
    th, td {
      font-size: 12px;
      color: #333330;
      line-height: 20px;
      padding: 6px 3px !important;
      font-weight: 400;
      .checkmark {
        top: 7px;
        left: -16px;
        height: 12px;
        width: 12px;
        border: 1px solid #3D3D3D;
        border-radius: 3px;
        background-color: transparent;
      }
    }
  }
  thead {
    tr {
      th {
        font-weight: bold;
        padding-left: 0;
        i {
          display: none;
        }
      }
    }
  }
  thead:last-child {
    display: none;
  }
`
const bell = <svg className="bell" viewBox="3.199 1.835 15.36 16.885">
                <path fill="rgba(177,177,177,1)" id="bell"
                    d="M 15.3483419418335 8.859565734863281 C 13.15872192382813 4.179498195648193 12.01949691772461 2.401299476623535 8.442158699035645 2.475813150405884 C 7.167881965637207 2.501445770263672 7.473396301269531 1.558398365974426 6.501032829284668 1.916064977645874 C 5.531069755554199 2.273731708526611 6.363580703735352 2.797117233276367 5.370809555053711 3.607231855392456 C 2.583967208862305 5.880203247070313 2.840263366699219 7.982091903686523 4.133147239685059 12.99240398406982 C 4.677550315856934 15.10323524475098 2.820456027984619 15.2063627243042 3.55513072013855 17.25102043151855 C 4.091731548309326 18.74248886108398 8.04841136932373 19.36721420288086 12.22237300872803 17.82984733581543 C 16.39693450927734 16.29128456115723 19.02771759033203 13.23859882354736 18.49051666259766 11.74653434753418 C 17.75584411621094 9.700680732727051 16.27088737487793 10.82971572875977 15.3483419418335 8.859566688537598 Z M 11.76980304718018 16.56906890869141 C 8.041808128356934 17.94250679016113 4.978263378143311 17.13537406921387 4.84861421585083 16.77591896057129 C 4.625931739807129 16.15596580505371 6.052064895629883 14.08984375 10.31425857543945 12.51909065246582 C 14.57645130157471 10.94833850860596 16.95514297485352 11.53073883056641 17.20363616943359 12.22222709655762 C 17.35069274902344 12.63115978240967 15.49899864196777 15.19443798065186 11.76980304718018 16.5684700012207 Z M 10.57175350189209 13.23680877685547 C 8.62342643737793 13.95512294769287 7.269319534301758 14.77596855163574 6.391191482543945 15.51514530181885 C 7.008822441101074 16.07191276550293 8.164854049682617 16.20782661437988 9.316685676574707 15.78339576721191 C 10.78303337097168 15.24451160430908 11.68517208099365 14.00340843200684 11.32863712310791 13.01386451721191 C 11.32383728027344 13.00134658813477 11.31783390045166 12.99180698394775 11.31303215026855 12.97928905487061 C 11.07174205780029 13.05738067626953 10.82504940032959 13.14262294769287 10.57175540924072 13.23680877685547 Z">
                </path>
            </svg>

export default class NavbarView extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          collapse: false,
          isWideEnough: false,
          dropdownOpen: false,
          aDropdownOpen: false,
          modal:false,
          'userProfile': [],
          notifications: [],
          unreadCount: 0,
          companyList: [],
          notifArray:[],
          notifsRow:[]
      };

      this.onClick = this.onClick.bind(this);
      this.toggle = this.toggle.bind(this);
      this.logout = this.logout.bind(this);
      this.setCompany = this.setCompany.bind(this)
      this.assembleNotifications = this.assembleNotifications.bind(this);
      this.toggleNotifDialog = this.toggleNotifDialog.bind(this);
      this.getNotifcationObjects = this.getNotifcationObjects.bind(this);
    }

    componentDidMount() {
      if(this.props.isAuthenticated && this.props.userInfo === undefined){
        this.props.getUserInfo();
        //this.props.getNotifs();

        if(this.props.userInfo !== undefined){
        }



      } else if(this.props.isAuthenticated && this.props.userInfo){
        if (this.props.userInfo.email) {
          if (this.props.userInfo.email === "j.dallas@xspaceapp.com") {
            this.props.getCompanyList().then((res) => {
              this.setState({companyList: res.payload.data})
            }).catch((err) => {
              console.log(err)
            })
          }
        }
        if (this.props.userInfo.notifs) {
          this.setState({'userProfile':this.props.userInfo || '' ,
            'notifications':this.props.userInfo.notifs["notifications"] || '' ,
            'notifArray':this.props.userInfo.notifs["notifications"],
            'unreadCount':this.props.userInfo.notifs["unreadCount"]});
            //this.assembleNotifications(this.props.notifs["notifications"]);

          let inv = this.props.userInfo.notifs["notifications"].map((notification, index) => {
                let status = null;
                if(notification.unread === true){
                  status = (<i class="fa fa-circle fa-2x"></i>)
                }
                else{
                  status = (<i class="fa fa-check-circle fa-2x green-text"></i>)
                }
                return (
                  {
                    verb: notification.verb,
                    date: notification.timestamp,
                    read: status
                  }
                )
              });

              console.log(inv);
              this.setState({notifsRow:inv});
        }
      }

      else{
        this.setState({'userProfile':this.props.userInfo || '' })
        //this.props.getNotifs();
        //this.setState({'notifications':this.props.userInfo["notifications"] || '' })
      }
    }

    componentWillReceiveProps(nextProps) {
      this.setState({'userProfile':nextProps.userInfo || '' })
      //this.setState({'notifications':nextProps.userInfo.notifs || '' })
      //this.setState({notifArray:nextProps.notifs["notifications"]});
      //this.setState({unreadCount:nextProps.notifs["unreadCount"]});

    }

    getNotifcationObjects() {

    }

    assembleNotifications(notifArray){
        let inv = notifArray.map((notification, index) => {
          return (
            {
              id: notification.id,
              verb: notification.verb,
              mark_as_read: "Test"
            }
          )
        });

        console.log(inv);
        return inv;

    }

    onClick(){
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleOrgs() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleNotifDialog() {
        this.setState({
            modal: !this.state.modal
        });

        if(this.state.modal === true){
            this.props.clearNotifs();
            this.props.getUserInfo();
        }
    }



    logout(e) {
      e.preventDefault();

      if(e.currentTarget.getAttribute('name')=="logout"){
        localStorage.clear();
        window.location.reload();
      }

    }

    setCompany(uniqueId) {
      this.props.updateCompany(uniqueId).then((res)=> {
        console.log(res)
        alert("You are now changing organizations. Page will refresh.")
        // window.location.reload()
      }).catch((err)=> {
        console.log(err)
      })
    }

    render() {
        let {userProfile} = this.state
        const isAuthenticated = this.props.isAuthenticated;
        let orgDropdownView = (<div></div>)
        if (userProfile) {
          if (userProfile.profileURL) {
            //console.log(userProfile);
            var profileImage = (<img src={userProfile.profileURL} className="avatar rounded-circle z-depth-0" width="35" alt="prismalogo" />)
          }
          else{
            var profileImage = (<img src="/icons8-customer-128.png" className="avatar rounded-circle z-depth-0" width="35" alt="prismalogo" />)
          }
          if (userProfile.email) {
            if (userProfile.email == "j.dallas@xspaceapp.com") {
              if (this.state.companyList) {
                let companyList = this.state.companyList
                let dropdownItems = companyList.map((com) => {
                  return (<DropdownItem href="#" key={com.uniqueID} onClick={()=>{this.setCompany(com.uniqueID)}}><i className="fa fa-user" style={{paddingRight:5 }}></i>{com.companyName}</DropdownItem>)
                })
                orgDropdownView = (
                  <NavItem>
                    {isAuthenticated && (
                      <Dropdown isopen={this.state.dropdownOpen.toString()} toggle={this.toggle}>
                        <DropdownToggle nav caret>
                          <span className="badge badge-info mb-2 mr-2 ml-2">Switch Organization</span>
                          <i className="fa fa fa-bars fa-2x" />
                        </DropdownToggle>
                        <DropdownMenu style={{overflowY: "scroll", height: "500px"}}>
                          {dropdownItems}
                        </DropdownMenu>
                      </Dropdown>
                    )}
                  </NavItem>
                )
              }
            }
          }
        }



        const data = {
            columns: [
              {
                label: 'Notification',
                field: 'verb',
                sort: 'desc',
              },
              {
                label: 'Date',
                field: 'date',
                sort: 'desc',
              },
              {
                label: 'Read',
                field: 'read',
                sort: 'desc',
              },
            ],
            rows: this.state.notifsRow
          };

        let viewAllNotifsModal = (
          <Modal className="" contentClassName="" isOpen={this.state.modal} toggle={this.toggleNotifDialog} size="lg" centered>
            <ModalHeader className="" toggle={this.toggleNotifDialog}>All Notifications</ModalHeader>
            <ModalBody >
                <Container>
                    <div className="animated">
                      <div className="row">
                        <div className="col-sm-12">
                           <Table
                              btn
                              searchLabel="Search notifications..."
                              responsive
                              pagination="true"
                              data={data} />

                        </div>
                      </div>


                    </div>
                </Container>
            </ModalBody>
          </Modal>
        );



        if (userProfile.profileURL) {
          //console.log(userProfile);
          var profileImage = (<img src={userProfile.profileURL} className="avatar rounded-circle z-depth-0" width="35" alt="prismalogo" />)
        }
        else{
          var profileImage = (<img src="/icons8-customer-128.png" className="avatar rounded-circle z-depth-0" width="35" alt="prismalogo" />)
        }

        return (

            <Navbar color="elegant-color" style={{minHeight: 108}} expand="md" dark fixed="top">
                {viewAllNotifsModal}
                { !this.state.isWideEnough && <NavbarToggler onClick = { this.onClick } />}
                <Collapse isOpen = { this.state.collapse } navbar>
                    <NavbarBrand href="#">
                    <div >
                      <img className="mainLogo"  alt="logo" />
                    </div>
                    </NavbarBrand>
                    {isAuthenticated && (
                      <NavbarNav left>
                        <NavItem>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        </NavItem>
                        {/*<NavItem>
                            <Link to="/products/create" className="nav-link">Import</Link>
                        </NavItem>*/}
                        {/*<NavItem>
                            <Link to="/order/create" className="nav-link">Order</Link>
                        </NavItem>*/}
                        <NavItem>
                            <Link to="/products/manage" className="nav-link">Product Library</Link>
                        </NavItem>
                         <NavItem>
                            <Link to="/products/orders" className="nav-link">Order History</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/myaccount/setting" className="nav-link">Account</Link>
                        </NavItem>
                      </NavbarNav>
                    )}
                    <NavbarNav right>
                      {orgDropdownView}
                      <NavItem>
                          <NavLink className="waves-effect waves-light" to="/shoppingcart">
                              <i className="fa fa-shopping-cart fa-2x"/>
                              {/*<MDBIcon icon="envelope" className="mr-1" />Contact*/}
                          </NavLink>
                      </NavItem>
                      {/*<NavLink>BANJO*/}
                      {/*    <i className="fa fa-shopping-cart fa-2x"/>*/}
                      {/*</NavLink>*/}
                      <NavItem>
                        {isAuthenticated && (
                            // <i className="fa fa-shopping-cart fa-2x"></i>
                            <Dropdown isopen={this.state.dropdownOpen.toString()} toggle={this.toggle}>
                            <DropdownToggle nav caret>
                                { (this.state.unreadCount > 0) ? <span className="badge badge-info mb-2 mr-2 ml-2">{this.state.unreadCount}</span> : <div/>}
                                {/*<i className="fa fa fa-bell-o fa-2x" />*/}
                                {/*<i className="fa fa fa-bell-o fa" />*/}
                                <Bell>{bell}</Bell>
                            </DropdownToggle>
                            <DropdownMenu>
                                <p>You currently have: <b>{this.state.unreadCount}</b> unread notifications.</p>
                                <DropdownItem onClick={this.toggleNotifDialog}><i className="fa fa-list" style={{paddingRight:5}}></i>View All Notifications</DropdownItem>
                                <DropdownItem name="clear" onClick={this.props.clearNotifs}><i className="fa fa-trash" style={{paddingRight:5}}></i>Clear Notifications</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      </NavItem>
                      <NavItem>
                        {isAuthenticated && (
                          <Dropdown isopen={this.state.dropdownOpen.toString()} toggle={this.toggle}>
                            <DropdownToggle nav caret>{profileImage}</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem href="/#/myaccount/setting"><i className="fa fa-user" style={{paddingRight:5}}></i> My Account</DropdownItem>
                                <DropdownItem href="#" name="logout" onClick={this.logout}> <i className="fa fa-sign-out" style={{paddingRight:5}}></i> Logout</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      </NavItem>
                    </NavbarNav>
                </Collapse>
            </Navbar>
        );
    }
}
