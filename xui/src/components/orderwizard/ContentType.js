import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import ReactQuill from 'react-quill'
import TextInput from '../../lib/TextInput'
import ReactHtmlParser from 'react-html-parser';

export default class ContentStandard extends Component {

  constructor(props) {
    super(props);
    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        // dropdownOpenCat: false,
        editing: true,
        modal: true,
        image_file_type: '',
        image_background_type: '',
        image_color_profile: '',
        image_compression_type: '',
        image_ideal_file_size: '',
        image_width: '',
        image_height: '',
        image_margin_type: '',
        image_margin_top: 0,
        image_margin_left: 0,
        image_margin_bottom: 0,
        image_margin_right: 0,
        threeSixtyImage_file_type: '',
        threeSixtyImage_background_type: '',
        threeSixtyImage_color_profile: '',
        threeSixtyImage_compression_type: '',
        threeSixtyImage_margin_type: '',
        threeSixtyImage_margin_top: 0,
        threeSixtyImage_margin_left: 0,
        threeSixtyImage_margin_bottom: 0,
        threeSixtyImage_margin_right: 0,
        threeD_file_type: '',
        threeD_compression_type: '',
        video_file_type: '',
        filename_prefix: '',
        filename_base: '',
        filename_delimiter: '',
        filename_suffix: '',

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
            <div className="col-sm-6">
              {title}
              <hr />
              {heading}
              <br />
            </div>
          </div>
          <br />

        </div>
      </Container>
    );
  }
}
