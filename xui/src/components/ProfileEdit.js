import React, { Component } from 'react';
import styled from 'styled-components'

import {
  MDBInput,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  MDBModalBody
} from 'mdbreact';
import axios from 'axios';
import { API_ROOT } from  '../index';
import $ from 'jquery';
import TextInput from '../lib/TextInput';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { MDBSelect, MDBSelectInput, MDBSelectOptions, MDBSelectOption} from "mdbreact";
import { CountryList } from '../constants'
import { Select } from '../lib/select'
import ProfilePictureUploader from "./EditAccountViewProfileDragNDrop";

const Wrapper = styled(Container)`
  .button-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 25px 0;
    button {
      width: 133px;
      height: 38px;
      border: 2px solid #F4F5FA;
      color: #333330;
      font-size: 14px;
      line-height: 20px;
      background-color: white;
      border-radius: 19px;
      font-weight: bold;
      :hover {
        color: white;
        background-color: #00A3FF;
        border: none;
      }
    }
  }
`

export default class ProfileEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        dropdownOpenCat: false,
        editing: true,
        modal: false,
        profile: [],
        firstName: '',
        lastName: '',
        fullName: '',
        companyRole: '',
        phoneNum: '',
        uploadedFile: null,
      errors:[]
    };
    this.submit = this.submit.bind(this);
    this.handleOnChangeFullName_LastTrigger = this.handleOnChangeFullName_LastTrigger.bind(this);
    this.handleOnChangeFullName_FirstTrigger = this.handleOnChangeFullName_FirstTrigger.bind(this);
    this.handleOnChangeFirstName = this.handleOnChangeFirstName.bind(this);
    this.handleOnChangeLastName = this.handleOnChangeLastName.bind(this);
    this.handleOnChangeCompanyRole = this.handleOnChangeCompanyRole.bind(this);
    this.handleOnChangePhoneNum = this.handleOnChangePhoneNum.bind(this);
    this.handleFileSubmit = this.handleFileSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.profile) {
      const profile = this.props.profile
      this.setState({ "profile": profile },
          function () {console.log('setting state1', this.state)});
      console.log('profile set as', profile, this.state.profile)
      this.setState({
        "firstName":this.props.profile.firstname ? this.props.profile.firstname : undefined,
        "lastName":this.props.profile.lastname ? this.props.profile.lastname : undefined,
        "fullName": this.state.firstName + ` ` + this.state.lastName,
        "companyRole":this.props.profile.companyRole ? this.props.profile.companyRole : undefined,
        "phoneNum":this.props.profile.phoneNum ? this.props.profile.phoneNum : undefined,
      }, function () {console.log('setting state2', this.state)});
    }
  }

  handleOnChangeFirstName(evt){
    if (evt) {
      let target = evt.target.value
      // update locally
      this.setState({ 'firstName':target })
      this.handleOnChangeFullName_FirstTrigger(target)
    }

  }

  handleOnChangeLastName(evt){
    if (evt) {
      let target = evt.target.value
    // update locally
    this.setState({ 'lastName':target })
    this.handleOnChangeFullName_LastTrigger(target)
    }
  }

  handleOnChangeFullName_LastTrigger(name) {
    this.setState({ 'fullName': this.state.firstName + ` ` + name })
  }

  handleOnChangeFullName_FirstTrigger(name) {
    this.setState({ 'fullName': name + ` ` + this.state.lastName })
  }

  handleOnChangePhoneNum(evt){
    if (evt) {
      let target = evt.target.value
    // update locally
    this.setState({ 'phoneNum':target})
    }

  }
  // handleOnChangeEmail(evt){
  //   this.setState({
  //     'state':evt.target.value
  //   });
  //   this.props.fieldValues.newAddressData.state = evt.target.value
  //   //console.log(this.props.fieldValues.newAddressData.state)
  // }
  handleOnChangeCompanyRole(evt){
    if (evt) {
      let target = evt.target.value
    // update locally
    this.setState({ 'companyRole':target })
    }
  }

  submit() {
    let { firstName, lastName, fullName, companyRole, phoneNum, uploadedFile } = this.state
    // var selectedCategory = $("#categoryList option:selected").attr('id');
    console.log('submitting before', firstName, lastName, fullName, companyRole, phoneNum, uploadedFile)
    // Error catching for bad inputs
    if (!firstName) {
      firstName = null
    }
    if (!lastName) {
      lastName = null
    }
    if (!fullName) {
      fullName = null
    }
    if (!companyRole) {
      companyRole = null
    }
    if (!phoneNum) {
      phoneNum = null
    }
    console.log('submitting after', firstName, lastName, fullName, companyRole, phoneNum, uploadedFile)
    let profileSubmit = {
      "firstName": firstName,
      "lastName": lastName,
      "fullName": fullName,
      "companyRole": companyRole,
      "phoneNum":phoneNum,
    }

    // if there is an uploaded file then let's upload it
    if (uploadedFile) {
      this.props.uploadHandler(uploadedFile)
    }
    // if there was adjusted information, let's adjust it in the database
    console.log("profileSubmit", profileSubmit)
    this.props.updateProfile(profileSubmit)
    this.props.notify('success2')
    this.props.cancel();
  }

  handleFileSubmit(dataTransfer) {
    console.log("handleFileSubmit receieved:", dataTransfer)
    let target = dataTransfer
    console.log('target that was transferred', target)
    this.setState({uploadedFile: target})
    // this.props.profileURL = this.state.uploadedFile
    console.log('target that was recorded', this.state.uploadedFile)
  }

  render() {
    const errors = this.props.errors || {}

    let inputFirstName =  <TextInput name="First Name" label="First Name" onChange={this.handleOnChangeFirstName} value={this.state.firstName}/>
    let inputLastName =  <TextInput name="Last Name" label="Last Name" onChange={this.handleOnChangeLastName} value={this.state.lastName}/>
    let inputCompanyRole =  <TextInput name="Company Role" label="Company Role"  onChange={this.handleOnChangeCompanyRole} value={this.state.companyRole}/>
    let inputPhoneNum = <TextInput name="Phone Number"  label="Phone Number" onChange={this.handleOnChangePhoneNum} value={this.state.phoneNum}/>
    // let inputFullName = <TextInput name="Full Name"  label="Full Name" value={this.state.fullName} readonly/>
    let profilePictureInput = <ProfilePictureUploader fieldValues={this.state} handleFileSubmit={this.handleFileSubmit}/>

    return (
      <Wrapper>
        <div className="animated">
          <div className="row">
            <div className="col-sm-6">
              {inputFirstName}
              {inputLastName}
            </div>
            <div className="col-sm-6">
              {inputCompanyRole}
              {inputPhoneNum}
              <br />
            </div>
          </div>
            {/*<div>*/}
            {/*  {inputFullName}*/}
            {/*</div>*/}
          <br/>
          <div>
            {profilePictureInput}
          </div>

          <div className='button-wrapper'>
            <button onClick={this.submit}>Save</button>
            <button onClick={this.props.cancel}>Cancel</button>
          </div>
        </div>
      </Wrapper>
    );
  }
}
