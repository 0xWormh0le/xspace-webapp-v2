import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalBody, ModalHeader, ModalFooter, MDBBtn } from 'mdbreact';
import ReactQuill from 'react-quill'
import { API_ROOT } from '../index';
import $ from 'jquery';

export default class UpgradeView extends Component {

  constructor(props) {
    super(props);
    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        dropdownOpenCat: false,
        editing: true,
        modal: false,
    };

    this.submit = this.submit.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);

  }

  state = {

  }

  componentDidMount() {


  }



  toggleDialog() {
    this.setState({
      modal: !this.state.modal
    });
  }


  componentWillReceiveProps(nextProps) {


  }


  submit() {

  }

  render() {
    const errors = this.props.errors || {}
    const message = this.props.message;
    console.log(message);


    let title = <h3 className="animated fadeInDown white-text">Explore the benefits of more storage, products, APIs and more by upgrading your subscription.</h3>
    return (
      <Container>
        <Modal isOpen={this.state.modal}>
          <ModalHeader toggle={this.toggleDialog}>Creating A New Product</ModalHeader>
          <ModalBody>
            Please wait, we are processing your submission...
          </ModalBody>
        </Modal>
        <div className="animated">
          <div className="row">
            <div className="col-sm-6">
              <p className="white-text">{message}</p>
              {title}
              <ul className="upgrade">
                <li className="white-text"><i className="fa fa-check" aria-hidden="true"></i> Unlimited Products</li>
                <li className="white-text"><i className="fa fa-check" aria-hidden="true"></i> Storage / CDN Solutions</li>
                <li className="white-text"><i className="fa fa-check" aria-hidden="true"></i> Full API Access</li>
                <li className="white-text"><i className="fa fa-check" aria-hidden="true"></i> Product Auto Updates</li>
              </ul>
              <MDBBtn rounded gradient="peach" className="mb-3 mt-3" href="/#/myaccount/plans"><i className="fa fa-plus-circle" aria-hidden="true"></i>     Upgrade My Plan</MDBBtn>

            </div>
            <div className="col-sm-6">
                <center><img src="http://xspaceapp.com/wp-content/uploads/2019/03/5-layers-e1551573851922.png" width="300px" height="300px"></img></center>
            </div>
          </div>


        </div>
      </Container>
    );
  }
}
