import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import ReactHtmlParser from 'react-html-parser';
import { MDBInput } from "mdbreact";
import  Loader from 'react-loader';
import { API_ROOT } from '../../../index';
import axios from 'axios';
import { Wrapper } from '../../productcreate/ProductDone'
import { StyledButton } from '../../../lib/button'

export default class ContentSave extends Component {

  constructor(props) {
    super(props);
    this.state = {
        collapse: false,
        isWideEnough: false,
        editing: true,
        modal: true,
        isSaveSuccessfully: true,
        isLoaded: true,
        rawResponse: '',
        error: {
        }
    };
    this.toggle = this.toggle.bind(this);
    this.submit = this.submit.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    
  }

  state = {

  }

  componentDidMount() {
    console.log(this.props)
    this.submit();
  }

  toggleDialog() {
    this.setState({
      modal: !this.state.modal
    });
  }

  saveStandard(){
        const config = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }
        const thisScope = this
        const standards_data = this.props.fieldValues;
        axios.post(API_ROOT + '/api/content_standards/', JSON.stringify(standards_data), config)
        .then(function (response) {
            thisScope.setState({
                isSaveSuccessfully: true,
                isLoaded: true,
            });
        })
        .catch(function (error) {
            console.error(error);
        });

  }


  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  submit() {
  fetch(API_ROOT + '/api/onboard/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + this.props.accessToken,
        },
        body: JSON.stringify({
          'user': this.props.userInfo.userid,
          'create_standard':true
        })
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
    var payload = this.props.fieldValues;
    ////console.log(this.props);
    this.props.standardSubmit(payload);


    this.setState({
                // using spread operator, you will need transform-object-rest-spread from babel or
                // another transpiler to use
                isLoaded: true,
                isSaveSuccessfully: true
            });
  }

  render() {
    const errors = this.props.errors || {}

    let step = this.props.step;

    if(this.state.isSaveSuccessfully){
        return (
             <Wrapper>
                <div class="container animated fadeIn">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                <h5>All Done! </h5>
                <p>Your content standard has been created successfully.</p>
                <StyledButton onClick={ this.props.cancel }>Continue With My Order</StyledButton>
                </div>
            </Wrapper>
        );
    }
    else{
        return (
            <Container>
                <div class="row animated">
                    <div class="col-lg-12">

                        <Loader loaded={this.state.isLoaded} lines={13} length={20} width={10} radius={30}
                            corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
                            trail={60} shadow={false} hwaccel={false} className="spinner-border text-primary"
                            zIndex={2e9} top="120px" left="50%" scale={1.00}
                            loadedClassName="spinner-border" />
                    </div>
                    <div className="col-lg-12">
                        <p className="loading-bar-css">One Moment Please...<br />Your Content Standard Is Being Created. </p>
                    </div>
                </div>
            </Container>           
        );
    }
  }
}
