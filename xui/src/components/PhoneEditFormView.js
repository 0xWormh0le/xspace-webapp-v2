import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'
import { numberOnly } from '../util/RegexTest'
import  Loader from 'react-loader';
import TextInput from '../lib/TextInput'

import { API_ROOT } from '../index';

import { Wrapper } from './OccupationEditFormView'

export default class PhoneNumberPageView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isEditingFullName: false,
      phoneNumber: '',
      isSuccess: true,
      responseMessage: '',
      errors: {},
      'userInfo': []
    };
  }

  render() {
    let {userInfo} = this.props
    return (
      <Wrapper>
        <p>Phone Number:</p>
        <span>{userInfo.phoneNum ? userInfo.phoneNum : 'You have no number saved'}</span>
      </Wrapper>
    )
  }
}
