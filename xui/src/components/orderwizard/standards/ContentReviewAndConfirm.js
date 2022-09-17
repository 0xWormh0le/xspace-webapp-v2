import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import ReactHtmlParser from 'react-html-parser';
import { MDBInput } from "mdbreact";
export default class ContentReviewAndConfirm extends Component {

  constructor(props) {
    super(props);
    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        // dropdownOpenCat: false,
        editing: true,
        modal: true,

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

  }

  toggleDialog() {
    this.setState({
      modal: !this.state.modal
    });
  }

  checkValidity() {
    let namePass, skuPass, pricePass, upcPass, heightPass, widthPass, lengthPass;
    let {name, sku, price, upc, length, width, height} = this.state;
    let pass = true
    if (name == '') {
      namePass = 'Name field cannot be empty'
      pass = false
    }
    if (sku == '') {
      skuPass = 'SKU field cannot be empty'
      pass = false
    }
    if (price == '') {
      pricePass = 'Price field cannot be empty'
      pass = false
    }
    if (upc == '') {
      upcPass = 'UPC field cannot be empty'
      pass = false
    }
    if (height == '') {
      heightPass = 'Height field cannot be empty'
      pass = false
    }
    if (width == '') {
      widthPass = 'Width field cannot be empty'
      pass = false
    }
    if (length == '') {
      lengthPass = 'Length field cannot be empty'
      pass = false
    }

    if (pass == false) {
      this.setState(
        {'error':
          {
            'name':namePass,
            'sku':skuPass,
            'upc':upcPass,
            'price':pricePass,
            'height':heightPass,
            'width':widthPass,
            'length':lengthPass
          }
        }
      )
    }

    return pass
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  submit() {

  }

  render() {
    const errors = this.props.errors || {}

    let step = this.props.step;

    let title = <h2 class="animated fadeInDown" style={{fontWeight: 200}}>Single Product Entry</h2>
    let heading = <h3 class="animated fadeInDown">Create a single product on the XSPACE platform.</h3>

    return (
      <Container>
        <div className="animated">
          <div className="row">
            <div className="col-lg-5">
              <center><p class="animated fadeInDown"><b>What Are Content Standards?</b></p>
              <img src="https://s3.amazonaws.com/storagev2/media/img/icons8-todo-list-512.png" width="150px" height="150px"></img></center>
              <center><p class="animated fadeInDown">Content Standards helps us define how your visuals should be formatted, & organized.
              <br /><br />By creating a content standard, we can ensure all product content created by XSPACE meets your brand's requirements. Sites like Amazon, Walmart, Target, etc. use content standards to for consistent branding.</p></center>
            </div>
            <div className="col-lg-7">
              <h5 class="animated fadeInDown">1. What would you like to name this content standard?</h5>
              <MDBInput label="Content Standard Name" outline />

              <i><p>You may use content standard names such as:</p>
              <ul>
                 <li>“Fashion Clothing Content Standard”</li>
                 <li>“My Shopify Store Content Standard”</li>
                 <li>“Electronics Content Standards Q4 2018”</li>
              </ul></i>



              <h5 class="animated fadeInDown">2. Add a description (Optional)</h5>
              <MDBInput type="textarea" label="Description" outline />
            </div>
          </div>
          <br />

        </div>
      </Container>
    );
  }
}
