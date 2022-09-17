import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalBody, ModalHeader, ModalFooter, MDBBtn } from 'mdbreact';
import ReactQuill from 'react-quill'
import { API_ROOT } from '../index';
import $ from 'jquery';
import { MDBInput, MDBNavbar, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon, MDBSideNavItem, MDBSideNavCat, MDBSideNavNav, MDBSideNav, MDBContainer } from "mdbreact";
import { MDBCard, MDBDataTable, cssTransition  } from "mdbreact";

export default class ViewAllNotifications extends Component {

  constructor(props) {
    super(props);
    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        dropdownOpenCat: false,
        editing: true,
        modal: false,
        notifArray:[],
        notifsRow:[]
    };

    this.submit = this.submit.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.assembleNotifs = this.assembleNotifs.bind(this);
    this.getNotifcationObjects = this.getNotifcationObjects.bind(this);

  }

  state = {

  }

  componentDidMount() {
     this.setState({notifArray:this.props.notifArray});
     //this.setState({notifsRow:this.assembleNotifs()});
  }

  getNotifcationObjects() {


  }

  toggleDialog() {
    this.setState({
      modal: !this.state.modal
    });
  }

  assembleNotifs = () => {
    console.log(this.state.notifArray);
    let inv = this.state.notifArray.map((notif, index) => {
      return (
        {
          email: notif.id,
          status: 'Pending',
          mark_as_read :""
        }
      )
    });
    return inv;
  }



  componentWillReceiveProps(nextProps) {


  }


  submit() {

  }

  render() {
    const errors = this.props.errors || {}
    const message = this.props.message;
    console.log(message);

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
        label: 'Clear',
        field: 'mark_as_read',
        sort: 'asc',
      },
    ],
    rows: this.state.notifsRow
  };


    let title = <h3 class="animated fadeInDown">All Notifications</h3>
    return (
      <Container>
        <div className="animated">
          <div className="row">
            <div className="col-sm-12">
              <p className="white-text">{message}</p>
              <MDBDataTable
                          responsive
                          hover
                          data={data}
                        />
              <MDBBtn rounded gradient="peach" className="mb-3 mt-3" href="/#/myaccount/plans"><i class="fa fa-plus-circle" aria-hidden="true"></i>     Upgrade My Plan</MDBBtn>

            </div>
          </div>


        </div>
      </Container>
    );
  }
}
