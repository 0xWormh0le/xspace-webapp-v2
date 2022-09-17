import React, {Component} from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'
import { charOnly } from '../util/RegexTest'
import  Loader from 'react-loader';
import TextInput from '../lib/TextInput'

import { API_ROOT } from '../index';

export const Wrapper = styled.div`
  flex: 1;
  p {
    font-size: 14px;
    color: #000000;
    opacity: .5;
    line-height: 20px;
    margin: 0%;
  }
  span {
    font-size: 14px;
    color: #000000;
    line-height: 20px;
  }
  .update-row {
    display: flex;
    align-items: center;
    padding-top: 20px;
    .form-group {
      margin: 0;
      margin-right: 10px;
      input {
        font-size: 14px;
        line-height: 20px;
        border: none;
      }
    }    
    i {
      font-size: 18px;
    }
  }
`

export default class OccupationPageView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isEditingOccupation: false,
      companyRole: '',
      errors: {},
      'userInfo': '',
      responseMessage: '',
      isSuccess: true

    };
  }

  render() {
    let {userInfo} = this.props
    return (
      <Wrapper>
        <p>Your current role is:</p>
        <span>{userInfo.companyRole}</span>
      </Wrapper>
    )
  }
}
