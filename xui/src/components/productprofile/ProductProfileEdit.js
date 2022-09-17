import React, { Component } from 'react';
import styled from 'styled-components'
import { Input, Label, MDBButton, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'mdbreact';
import ReactQuill from 'react-quill'
import './productprofile.css';
import axios from 'axios';
import { API_ROOT } from '../../index';
import TextInput from '../../lib/TextInput';
import { Select } from '../../lib/select'

const Wrapper = styled.div`
  display: flex;
  position: relative;
  height: auto;
  .form-group {
    text-align: left;
    label {
      color: #333330;
      font-size: 12px;
      line-height: 20px;
    }
    input {
      font-size: 14px;
      line-height: 20px;
      color: #333333;
      font-weight: bold;
      border: none;
    }
  }
  button {
    width: 100%;
    font-size: 10px;
    padding: 10px 0;
  }
  .left-panel {
    width: 100%;
    height: auto;
  }
  .right-panel {
    width: 178px;
    margin-left: 15px;
    text-align: left;
    height: auto;
  }
`

const StyledTextInput = styled(TextInput)``

export default class ProductProfileEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        dropdownOpenCat: false,
        editing: true,
        modal: false,
        upccode: '',
        UPCType: 'UPC-A',
        SKU: '',
        manufacturer: '',
        name: '',
        description: '',
        descriptionHTML: '',
        categories: [],
        selectedCategory: 24,
        selectedCategoryText: 'Uncategorized',
        price: 0.0,
        length: 0.0,
        width: 0.0,
        height: 0.0,
        rawResponse: '',
        error: {
          upc: '',
          UPCType: '',
          SKU: '',
          manufacturer: '',
          name: '',
          price: '',
          length: '',
          width: '',
          height: ''
        }
    };
    this.toggle = this.toggle.bind(this);
    this.select = this.select.bind(this);
    this.submit = this.submit.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.updateNameValue = this.updateNameValue.bind(this);
    this.updateDescriptionValue = this.updateDescriptionValue.bind(this);
    // this.updateUPCTypeValue = this.updateUPCTypeValue.bind(this);
    this.updateUPCValue = this.updateUPCValue.bind(this);
    this.updateSKUValue = this.updateSKUValue.bind(this);
    this.updateManufactureValue = this.updateManufactureValue.bind(this);
    this.updatePriceValue = this.updatePriceValue.bind(this);
    this.updateLengthValue = this.updateLengthValue.bind(this);
    this.updateWidthValue = this.updateWidthValue.bind(this);
    this.updateHeightValue = this.updateHeightValue.bind(this);
    this.checkValidity = this.checkValidity.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
  }

  state = {

  }

  componentDidMount() {
    if (this.props.product) {
      this.getCategory();
      let product = this.props.product

      //if the upccode fails initial validation, override type to none
      let upcTypeOverride = this.checkUPCTypeOverride(product.upccode, product.UPCType)

      this.setState({
        "name": product.name,
        "SKU": product.SKU,
        "description": product.description,
        "price": product.price,
        "length": product.length,
        "width": product.width,
        "height": product.height,
        "upccode": product.upccode,
        "UPCType": upcTypeOverride,
        "selectedCategory": product.category,
        "manufacturer": product.manufacturer,
      })
    }
  }

  getCategory(){
    axios.get(API_ROOT +'/api/category/')
      .then(res => {
        const persons = res.data;
        this.setState({'categories':res.data.categories})
        //console.log(res);
      })
  }

  selectCategory(event) {
    this.setState({
      selectedCategory: event.target.value
    }, () => {
      this.props.onChange('category', this.state.selectedCategory)

    });
  }

  toggleDialog() {
    this.setState({
      modal: !this.state.modal
    });
  }

  checkUPCTypeOverride(upccode, UPCType) {
    if (upccode.length !== 12 &&
      upccode.length !== 13 &&
      upccode.length !== 8 &&
      upccode.length !== 6) {
        return 'None'
    }
    return UPCType
  }

  checkValidity() {
    let namePass, skuPass, pricePass, upcPass, heightPass, widthPass, lengthPass;
    let {name, SKU, price, upccode, length, width, height} = this.state;
    let pass = true
    if (name === '') {
      namePass = 'Name field cannot be empty'
      pass = false
    }
    if (SKU === '') {
      skuPass = 'SKU field cannot be empty'
      pass = false
    }
    if (price === '') {
      pricePass = 'Price field cannot be empty'
      pass = false
    }

    if (upccode === '') {
      upcPass = 'UPC field cannot be empty'
      pass = false
    } else if (!upccode.match(/^\d+$/gi)) {
      upcPass = 'UPC cannot contain characters'
      pass = false
    }

    if (height === '') {
      heightPass = 'Height field cannot be empty'
      pass = false
    }
    if (width === '') {
      widthPass = 'Width field cannot be empty'
      pass = false
    }
    if (length === '') {
      lengthPass = 'Length field cannot be empty'
      pass = false
    }

    if (pass === false) {
      this.setState(
        {'error':
          {
            'name':namePass,
            'SKU':skuPass,
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

  componentWillReceiveProps(nextProps, nextContext) {

      if (nextProps.step === 2) {
        if (this.checkValidity()) {

        } else {
          this.props.reset()
        }
      }

      if (nextProps.processing === true && this.props.processing === false) {
        this.toggleDialog()
        let { upccode, SKU, manufacturer, name, description, price, height, width, length, category, UPCType } = this.state;
        this.props.onSubmit(SKU, name, price, height, width, length, description, category, manufacturer, upccode, UPCType)
      }
      else if (nextProps.product && nextProps.processing === true && this.props.processing === true) {
        this.toggleDialog()
        this.props.finish()
      }
  }

  updateNameValue(evt) {
    this.setState({
      'name':evt.target.value
    }, () => {
      this.props.onChange('name', this.state.name)
    });
  }

  updateDescriptionValue(evt) {
    let evtCap = evt + ''
    this.setState({
      'description':evtCap
    }, () => {
      this.props.onChange('description', evtCap)
    });
  }

  updateUPCValue(evt) {
    let val = evt.target.value
    if (!/^[0-9]*$/.test(val)) {
      this.setState({'error':{'upc':'This is not a valid barcode number.'}})
    }
    else if (this.state.UPCType === 'UPC-A') {
      if (val.length !== 12)
        this.setState({'error':{'upc':'Please enter a valid UPC-A code'}})
      else
        this.setState({'error':{'upc':''}})
    }
    else if (this.state.UPCType === 'UPC-E') {
      if (val.length !== 6)
        this.setState({'error':{'upc':'Please enter a valid UPC-E code'}})
      else
        this.setState({'error':{'upc':''}})
    }
    else if (this.state.UPCType === 'EAN-8') {
      if (val.length !== 8)
        this.setState({'error':{'upc':'Please enter a valid EAN-8 code'}})
      else
        this.setState({'error':{'upc':''}})
    }
    else if (this.state.UPCType === 'EAN-13') {
      if (val.length !== 13)
        this.setState({'error':{'upc':'Please enter a valid EAN-13 code'}})
      else
        this.setState({'error':{'upc':''}})
    }
    else if (this.state.UPCType === 'None') {
      if (val.length > 49)
        this.setState({'error':{'upc':'The maximum is 50 characters for this field.'}})
      else
        this.setState({'error':{'upc':''}})
    }
    this.setState({
      'upccode':evt.target.value
    }, () => {
      this.props.onChange('upccode', this.state.upccode)
    });
  }

  updateSKUValue(evt) {
    this.setState({
      'SKU':evt.target.value
    }, () => {
      this.props.onChange('SKU', this.state.SKU)
    });
  }

  updateManufactureValue(evt) {
    this.setState({
      'manufacturer':evt.target.value
    }, () => {
      this.props.onChange('manufacturer', this.state.manufacturer)
    });
  }

  updatePriceValue(evt) {
    let regex = /^(\d*\.)?\d+$/g;
    if (!regex.test(evt.target.value)) {
      this.setState({error: {price: 'Please enter a valid value. ##.##'}})
    } else {
      this.setState({error: {price: ''}})
    }
    this.setState({price: evt.target.value}, () => {
      this.props.onChange('price', this.state.price)
    });
  }

  updateLengthValue(evt) {
    let regex = /^(\d*\.)?\d+$/g;
    if (!regex.test(evt.target.value)) {
      this.setState({error: {length: 'Please enter a valid value. ##'}})
    } else {
      this.setState({error: {length: ''}})
    }
    this.setState({
      'length':evt.target.value
    }, () => {
      this.props.onChange('length', this.state.length)
    });
  }

  updateWidthValue(evt) {
    let regex = /^(\d*\.)?\d+$/g;
    if (!regex.test(evt.target.value)) {
      this.setState({error: {width: 'Please enter a valid value. ##'}})
    } else {
      this.setState({error: {width: ''}})
    }
    this.setState({
      'width':evt.target.value
    }, () => {
      this.props.onChange('width', this.state.width)
    });
  }

  updateHeightValue(evt) {
    let regex = /^(\d*\.)?\d+$/g;
    if (!regex.test(evt.target.value)) {
      this.setState({error: {height: 'Please enter a valid value. ##'}})
    } else {
      this.setState({error: {height: ''}})
    }
    this.setState({
      'height':evt.target.value
    }, () => {
      this.props.onChange('height', this.state.height)
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  select(event) {
    console.log(event.target.value)
    this.setState({ UPCType: event.target.value }, () => {
      this.props.onChange('UPCType', this.state.UPCType)
    });
  }

  submit() {
    if(this.checkValidity()) {
        this.props.submit()
    } else {
      alert("Please check all fields for valid data.")
    }
  }

  render() {
    const errors = this.props.errors || {}

    let { selectedCategory, UPCType, categories, upccode, SKU, manufacturer, name, description, price, height, width, length } = this.state;

    let step = this.props.step;

    let title = <h2 className="animated fadeInDown" style={{fontWeight: 200}}>Single Product Entry</h2>
    let selectCategory = <label className="animated fadeInDown">Product Category</label>
    let heading = <h3 className="animated fadeInDown pcw-pad-header">Create a single product on the XSPACE platform.</h3>
    let inputName =  <StyledTextInput id="product edit info productname" name="Name" label="Name" error={this.state.error.name} onChange={this.updateNameValue} value={name}/>
    let inputDescription = <ReactQuill style={{height: 200, marginBottom: 50}} id="product edit info productdescription" label="Product Description" onChange={this.updateDescriptionValue} value={description}/>
    let inputUPC = <StyledTextInput id="product edit info productupc" label="Product UPC (required)" onChange={this.updateUPCValue} error={this.state.error.upc} value={upccode}/>
    let inputSKU = <StyledTextInput id="product edit info productsku" label="Product SKU (required)" onChange={this.updateSKUValue} error={this.state.error.SKU} value={SKU}/>
    let inputManu = <StyledTextInput id="product edit info productmanufacturer" label="Manufacturer" onChange={this.updateManufactureValue} error={this.state.error.manufacturer} value={manufacturer}/>
    let inputPrice = <StyledTextInput id="product edit info productprice" label="Price (required)" onChange={this.updatePriceValue} error={this.state.error.price} value={price}/>
    let inputLength = <StyledTextInput id="product edit info productlength" label="Length (inches, required)" onChange={this.updateLengthValue} error={this.state.error.length} value={length}/>
    let inputWidth = <StyledTextInput id="product edit info productwidth" label="Width (inches, required)" onChange={this.updateWidthValue} error={this.state.error.width} value={width}/>
    let inputHeight = <StyledTextInput id="product edit info productheight" label="Height (inches, required)" onChange={this.updateHeightValue} error={this.state.error.height} value={height}/>

    let permissions = (
      <div>
        <hr />
        <div className="pcw-sm-outer-radio">
          <label className="pcw-sm-container">Private (default)
            <input type="radio" name="radio" />
            <span className="checkmark"/>
          </label>
          <p>This setting marks your product as private. Only you can have access to the products link at assets.</p>
          <label className="pcw-sm-container">View/Read Only
            <input type="radio" name="radio" />
            <span className="checkmark"/>
          </label>
          <p>This setting only allows specified users on XSPACE to view this page if they have a link and use its assets.</p>
          <label className="pcw-sm-container">Public
            <input type="radio" name="radio" />
            <span className="checkmark"/>
          </label>
          <p>This setting marks your product as public. Anyone can have access to the products link and its assets.</p>
        </div>
      </div>
    )

    // let categoryList = (
    //   <div></div>
    // )

    if (categories.length > 0) {
    }

    if (this.props.minimal) {
      permissions = (
        <div className="col-sm-3">
          <Button color="success" onClick={ this.submit }>Submit Changes</Button>
          <Button color="red" onClick={ this.props.cancel }>Cancel Changes</Button>
        </div>
      )
    }
    let UPCTypeView = (
      <Select onChange={this.select}>
        <option value={'None'}>None</option>
        <option value={'UPC-A'}>UPC-A</option>
        <option value={'UPC-E'}>UPC-E</option>
        <option value={'EAN-8'}>EAN-8</option>
        <option value={'EAN-13'}>EAN-13</option>
      </Select>
    )

    let categoryDropDown = (
        <div>
          <label style={{textAlign: 'left', margin: '0px', fontSize: 12, color: '#333330', lineHeight: '20px', marginTop: '5px', left:0}}>Product Category</label>
          <Select onChange={this.selectCategory}>
            {categories.map((category,index) => (
                <option key={index} value={category.title}>
                  {category.title}
                </option>
            ))}
          </Select>
        </div>
    )

    if (step === 2) {
      title = <h2 id="product edit info title" className="animated fadeInDown" style={{fontWeight: 200}}>Confirm Product Entry</h2>
      heading = <h3 id="product edit info heading" className="animated fadeInDown" style={{fontWeight: 200}}>Please check all entries before submitting...</h3>
      inputName = (<div id="product edit info name" className="pcw-result"><br /><p>Name (required)</p><h5 className="animated fadeInDown">{this.state.name}</h5></div>)
      inputDescription = (<div id="product edit info description"><br /><p>Description</p><h5 className="animated fadeInDown">{this.state.description}</h5></div>)
      inputUPC = (<div id="product edit info UPC" className="pcw-result"><br /><p>UPC</p><h5 className="animated fadeInDown">{this.state.upccode}</h5></div>)
      inputSKU = (<div id="product edit info SKU" className="pcw-result"><br /><p>SKU (required)</p><h5 className="animated fadeInDown">{this.state.SKU}</h5></div>)
      inputManu = (<div id="product edit info manufacturer" className="pcw-result"><br /><p>Manufacturer</p><h5 className="animated fadeInDown">{this.state.manufacturer}</h5></div>)
      inputPrice = (<div id="product edit info price" className="pcw-result"><br /><p>Price (required)</p><h5 className="animated fadeInDown">{this.state.price}</h5></div>)
      permissions = (<p>You have selected</p>)
      inputLength = (<div id="product edit info length" className="pcw-result"><br /><p>Length</p><h5 className="animated fadeInDown">{this.state.length}</h5></div>)
      inputWidth = (<div id="product edit info width" className="pcw-result"><br /><p>Width</p><h5 className="animated fadeInDown">{this.state.width}</h5></div>)
      inputHeight = (<div id="product edit info height" className="pcw-result"><br /><p>Height</p><h5 className="animated fadeInDown">{this.state.height}</h5></div>)
    }

    let resp = <p></p>
    if (this.state.rawResponse !== '') {
      resp = (<p>{this.state.rawResponse}</p>)
    }

    return (
      <Container>
        <div className="animated">
          <Wrapper>
            <div className='left-panel'>
              {inputName}
              {inputDescription}
              {resp}
              <table width="100%">
                <tbody>
                  <tr>
                    <td>
                      {inputUPC}
                    </td>
                    <td>
                      {UPCTypeView}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='right-panel'>
              {inputSKU}
              {inputManu}
              {inputPrice}
              {inputLength}
              {inputWidth}
              {inputHeight}
              {categoryDropDown}
            </div>
            {!this.props.minimal && permissions}
          </Wrapper>
        </div>
      </Container>
    );
  }
}
