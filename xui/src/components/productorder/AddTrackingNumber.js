import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import TextInput from '../../lib/TextInput'
import axios from 'axios';
import { API_ROOT } from '../../index';
import FedexLogo from './assets/Fedex-logo.png'
import DHLLogo from './assets/DHL-logo.png'
import UPSLogo from './assets/UPS-Logo.png'

export default class AddTrackingNumber extends Component {

  constructor(props) {
    super(props);
    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        // dropdownOpenCat: false,
        modal: false,
        'message': '',
        trackingNumber: '',
        rawResponse: '',
        error: {
          trackingNumber: '',
        }
    };
    this.toggle = this.toggle.bind(this);
    this.select = this.select.bind(this);
    this.submit = this.submit.bind(this);
    // this.toggleCat = this.toggleCat.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.updateTrackingNumberField = this.updateTrackingNumberField.bind(this);
    this.checkValidity = this.checkValidity.bind(this);
    
  }

  handleInputChange = (event) => {
    const target = event.target,
        value = target.type ===
        'checkbox' ? target.checked : target.value,
      name = target.name
      this.state.errors[name] = ''
    this.setState({
        [name]: value
    });
  }

  state = {

  }

  componentDidMount() {
    if (this.props.trackingNumberProp) {
      let trackingNumberProp = this.props.trackingNumberProp
      this.setState({
        "trackingNumber":trackingNumberProp.trackingNumber,
      })
    }

  }

  toggleDialog() {
    this.setState({
      modal: !this.state.modal
    });
  }

  checkValidity() {
    let trackingNumberPass;
    let {trackingNumber} = this.state;
    let pass = true
    if (trackingNumber === '') {
      trackingNumberPass = 'The Tracking Number field cannot be empty.'
      pass = false
    }
    if (pass === false) {
      this.setState(
        {'error':
          {
            'trackingNumber':trackingNumberPass,
          }
        }
      )
    }

    return pass
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.processing === true && this.props.processing === false) {
      this.toggleDialog()
      let {trackingNumber} = this.state;
      this.props.onSubmit(trackingNumber)
    }else if (nextProps.product && nextProps.processing === true && this.props.processing === true) {
      this.toggleDialog()
      this.props.finish()
    }
  }

  updateTrackingNumberField(evt) {
    this.setState({
      'trackingNumber':evt.target.value
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  select(event) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      upcType: event.target.innerText
    });
  }

  submit() {
    let { trackingNumber } = this.state
    let thisScope = this
    let trackingNumberProp = {
      "tracking_number": trackingNumber,
      "order": this.props.orderId
    }

    const config = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'authorization': 'Bearer '+this.props.accessToken
      }
    }

    if(this.checkValidity()) {
        axios.post(API_ROOT + '/api/order-track/', JSON.stringify({"orderTrack": trackingNumberProp}), config)
        .then(function (response) {
            thisScope.setState({message: response.data.message})
        }).catch(function (error) {
            thisScope.setState({message: error})
        });
    } 
  }

  render() {
    const errors = this.props.errors || {}
    
    let { trackingNumber,message } = this.state;

    let inputtrackingNumber = <TextInput label="Enter Shipment Tracking Number Here:" name="tracking_number" id="tacknumber" onChange={this.updateTrackingNumberField} error={this.state.error.trackingNumber} />

    let successMessage = <div></div>
    if(message){
      successMessage = <div class="alert alert-success dismiss">{message}</div>
    }

    if (this.props.minimal) {
      prompt = (
        <div>
          <Button color="success" onClick={ this.submit }>Add Tracking Number</Button>
          <Button color="red" onClick={ this.props.cancel }>Cancel</Button>
        </div>
      )
    }

    let resp = <p></p>
    if (this.state.rawResponse !== '') {
      resp = (<p>{this.state.rawResponse}</p>)
    }

    return (
      <Container>
        <Modal isOpen={this.state.modal}>
          <ModalHeader toggle={this.toggleDialog}><b>Add Tracking Number To Order</b></ModalHeader>
          <ModalBody>

          </ModalBody>
        </Modal>
        <div className="animated">
          <div className="row">
            <div className="col-sm-12">
              <p>In order to ensure your products arrive safely at our capture studios, we require the tracking number for your shipment.
              Simply copy and paste your mail carrier’s tracking number into the field below. Once your done, click the Add Tracking Number button to submit. </p>

              <p>We will be notified once you have submitted a valid tracking number. You may add multiple tracking numbers for this order by resubmiting this form again.</p>

              <br />
            </div>

            <div className="col-sm-3">
                <img src="https://www.freeiconspng.com/uploads/usps-icon-3.png" style={{width: 150, height: 150}}/>
            </div>

            <div className="col-sm-3">
                <img src={UPSLogo} style={{width: 150, height: 150}}/>
            </div>

            <div className="col-sm-3">
                <img src={FedexLogo} style={{width: 150, height: 150}}/>
            </div>

            <div className="col-sm-3">
                <img src={DHLLogo} style={{width: 150, height: 150}}/>
            </div>

            <div className="col-md-12" style={{marginTop:30}}>
             {inputtrackingNumber}
             {successMessage}
             {prompt}
            </div>

          </div>
          <br />

        </div>
      </Container>
    );
  }
}
