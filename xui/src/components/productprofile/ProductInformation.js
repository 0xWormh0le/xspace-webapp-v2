import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import ReactQuill from 'react-quill';
import {login, register} from  '../../actions/auth'
import TextInput from '../../lib/TextInput'
//import Parser from 'html-react-parser'
import ReactHtmlParser from 'react-html-parser';

export default class ProductInformation extends Component {

  constructor(props) {
    super(props);

    this.state = {
        edit: false,
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        dropdownOpenCat: false,
        editing: true,
        upc: '-',
        upcType: '--Select--',
        sku: '-',
        manufacturer: '-',
        name: '-',
        description: '',
        descriptionHTML: '',
        price: 0.0,
        length: 0.0,
        width: 0.0,
        height: 0.0,
        error: {
          upc: '',
          upcType: '',
          sku: '',
          manufacturer: '',
          name: '',
          price: '',
          length: '',
          width: '',
          height: ''
        }
    };

    this.updateNameValue = this.updateNameValue.bind(this);
    this.updateDescriptionValue = this.updateDescriptionValue.bind(this);
    this.updateUPCValue = this.updateUPCValue.bind(this);
    this.updateUPCtypeValue = this.updateUPCtypeValue.bind(this);
    this.updateSKUValue = this.updateSKUValue.bind(this);
    this.updateManufactureValue = this.updateManufactureValue.bind(this);
    this.updatePriceValue = this.updatePriceValue.bind(this);
    this.updateLengthValue = this.updateLengthValue.bind(this);
    this.updateWidthValue = this.updateWidthValue.bind(this);
    this.updateHeightValue = this.updateHeightValue.bind(this);

    this.toggle = this.toggle.bind(this);
    this.select = this.select.bind(this);

  }

  componentDidMount() {}

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
    this.props.updateProduct['UPCType']=event.target.innerText;
  }

  updateNameValue(evt) {    
    this.props.updateProduct['name']=evt.target.value;
  }

  updateDescriptionValue(evt) {
    let evtCap = evt + ''
    this.props.updateProduct['description']=evtCap;
  }

  updateUPCValue(evt) {
    var upccode=evt.target.value;
    if(this.state.upcType=='UPC-A')
    {
      this.props.updateProduct['upccode'] = upccode;
    }
    if(this.state.upcType=='UPC-E')
    {
      this.props.updateProduct['upccode'] = upccode;
    }
    if(this.state.upcType=='EAN-8')
    {
      this.props.updateProduct['upccode'] = upccode;
    }
    if(this.state.upcType=='EAN-13')
    {
      this.props.updateProduct['upccode'] = upccode;
    }
  }

  updateUPCtypeValue(evt) {
    this.props.updateProduct['UPCType']=evt.target.innerText;
    //evt.target.value;
  }

  updateSKUValue(evt) {
    this.props.updateProduct['sku']=evt.target.value;
  }

  updateManufactureValue(evt) {
    this.props.updateProduct['manufacturer']=evt.target.value;
  }

  updatePriceValue(evt) {
    this.props.updateProduct['price']=evt.target.value.replace(/\D/,'');
  }

  updateLengthValue(evt) {
    this.props.updateProduct['length']=evt.target.value;
  }

  updateWidthValue(evt) {
    this.props.updateProduct['width']=evt.target.value;
  }

  updateHeightValue(evt) {
    this.props.updateProduct['height']=evt.target.value;
  }

  render() {
    const errors = this.props.errors || {}
    const product = this.props.product
 
    let updateProduct = this.props.updateProduct
    const productspecs = this.props.productspecs
    let { upc, sku, manufacturer, name, description, price, upcType } = this.state;
    
    let inputName = (<div><br /><h6 className="animated fadeInDown">Product Name: {product.name}</h6></div>)
    let inputDescription = (<div><br /><h6 className="animated fadeInDown">Description: {ReactHtmlParser(product.description)}</h6></div>)
    let inputUPC = (<div><br /><h6 className="animated fadeInDown">UPC Code: {product.upccode}</h6></div>)
    let inputUPCtype = (<div><br /><h6 className="animated fadeInDown">UPC Type: {product.UPCType}</h6></div>)
    let inputSKU = (<div><br /><h6 className="animated fadeInDown">SKU: {product.sku}</h6></div>)
    let inputManu = (<div><h6>Manufacturer:</h6><p className="pill">{product.manufacturer}</p></div>)
    let inputPrice = (<div><h6 className="animated fadeInDown">Price: {product.price}</h6></div>)
    let permissions = (<p>You have selected</p>)
    let inputLength = (<h6 className="animated fadeInDown">{product.length} in</h6>)
    let inputWidth = (<h6 className="animated fadeInDown">{product.width} in</h6>)
    let inputHeight = (<h6 className="animated fadeInDown">{product.height} in</h6>)

    /*
    let upcType = (
      <Dropdown isopen={this.state.dropdownOpen.toString()} toggle={this.toggle}>
        <DropdownToggle nav caret><p>{this.state.upcType}</p></DropdownToggle>
        <DropdownMenu>
            <DropdownItem onClick={this.select}>UPC-A</DropdownItem>
            <DropdownItem onClick={this.select}>UPC-E</DropdownItem>
            <DropdownItem onClick={this.select}>EAN-8</DropdownItem>
            <DropdownItem onClick={this.select}>EAN-13</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )*/

    if (this.props.editing) {
      if(upcType=='--Select--')
      {
        upcType = product.UPCType;
      }

      inputName =  <TextInput name="Name" label="Name (required)" onChange={this.updateNameValue} error={this.state.error.name} placeholder={product.name}/>
      inputDescription = <ReactQuill style={{height: 200, marginBottom: 50}} label="Product Description" onChange={this.updateDescriptionValue} placeholder={product.description}/>
      inputUPC = <TextInput label="Product UPC Code(required)" onChange={this.updateUPCValue} error={this.state.error.upc} placeholder={product.upccode}/>
      inputUPCtype = (
                      <Dropdown isopen={this.state.dropdownOpen.toString()} toggle={this.toggle}>
                        UPC Type (required)<DropdownToggle nav caret><p>{upcType}</p></DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem onClick={this.select}>UPC-A</DropdownItem>
                            <DropdownItem onClick={this.select}>UPC-E</DropdownItem>
                            <DropdownItem onClick={this.select}>EAN-8</DropdownItem>
                            <DropdownItem onClick={this.select}>EAN-13</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )

      /*<TextInput label="Product UPC Type(required)" onChange={this.updateUPCtypeValue} error={this.state.error.upcType} placeholder={product.UPCType}/>*/
      inputSKU = <TextInput label="Product SKU (required)" onChange={this.updateSKUValue} error={this.state.error.sku} placeholder={product.sku}/>
      inputManu = <TextInput label="Manufacturer" onChange={this.updateManufactureValue} error={this.state.error.manufacturer} placeholder={product.manufacturer}/>
      inputPrice = <TextInput label="Price (required)" onChange={this.updatePriceValue} error={this.state.error.price} placeholder={product.price}/>

      inputLength = <TextInput label="Length (inches, required)" onChange={this.updateLengthValue} error={this.state.error.length} placeholder={product.length}/>
      inputWidth = <TextInput label="Width (inches, required)" onChange={this.updateWidthValue} error={this.state.error.width} placeholder={product.width}/>
      inputHeight = <TextInput label="Height (inches, required)" onChange={this.updateHeightValue} error={this.state.error.height} placeholder={product.height}/>
      
    }

    let arr = []
    for (let p in productspecs) {
      arr.push(p)
    }

    return (
      <div className="animated fadeIn">
        <br />
        <div className="row">
          <div className="col-sm-5" style={{textAlign: "left"}}>
            {inputName}
            <br />
            <div>{inputDescription}</div>
          </div>
          <div className="col-sm-7">
            <div className="row">
              <div className="col-sm-7">
                <h6>Product Category:</h6>
                <p className="pill">{product.category}</p>
              </div>
              <div className="col-sm-5">
                {inputManu}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4">
                {inputSKU}
              </div>
              <div className="col-sm-4">
                {inputUPCtype}
              </div>
              <div className="col-sm-4">
                {inputUPC}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4">
                {inputPrice}
              </div>
            </div>
            <div className="row">
              <h6>Product Specifications:</h6>
              <table width="100%">
                <tbody>
                <tr>
                  <td style={{width:'90px'}}>Length:</td>
                  <td style={{width:'200px'}}>{inputLength}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td>{inputWidth}</td>
                  <td>Custom Key:</td>
                  <td> - </td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td>{inputHeight}</td>
                  <td>Custom Key:</td>
                  <td> - </td>
                </tr>
                <tr>
                  <td>Weight:</td>
                  <td>{product.weight} lb</td>
                  <td>Custom Key:</td>
                  <td> - </td>
                </tr>
                <tr>
                  <td>Custom Key:</td>
                  <td> - </td>
                  <td>Custom Key:</td>
                  <td> - </td>
                </tr>
                <tr>
                  <td>Custom Key:</td>
                  <td> - </td>
                  <td>Custom Key:</td>
                  <td> - </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  }
}
