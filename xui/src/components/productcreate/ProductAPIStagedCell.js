import React, { Component } from 'react';
import { Button, Card, CardBody, CardImage, CardTitle, CardText, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import TextInput from '../../lib/TextInput'
import ReactQuill from 'react-quill'

export default class ProductExcelCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      error: {
        upc: '',
        upcType: '',
        sku: '',
        manufacturer: '',
        name: '',
        price: '',
        length: '',
        width: '',
        height: '',
        editing: false
      }
    }

    this.remove = this.remove.bind(this)
    this.edit = this.edit.bind(this)
    this.enqueue = this.enqueue.bind(this);
    this.toggle = this.toggle.bind(this);
    this.select = this.select.bind(this);
    this.updateNameValue = this.updateNameValue.bind(this);
    this.updateDescriptionValue = this.updateDescriptionValue.bind(this);
    this.updateUPCValue = this.updateUPCValue.bind(this);
    this.updateSKUValue = this.updateSKUValue.bind(this);
    this.updateManufactureValue = this.updateManufactureValue.bind(this);
    this.updatePriceValue = this.updatePriceValue.bind(this);
    this.updateLengthValue = this.updateLengthValue.bind(this);
    this.updateHeightValue = this.updateHeightValue.bind(this);
    this.updateWidthValue = this.updateWidthValue.bind(this);

  }

  componentWillUpdate(nextProps, nextState) {

  }

  remove(idx) {
    this.props.remove(this.props.index)
  }

  edit(idx) {
    this.setState({'editing': !this.state.editing})
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

  enqueue(idx) {
    this.props.enqueue(this.props.index)
  }

  updateNameValue(evt) {
    let { product, index } = this.props
    if ('Product Name' in product)
      this.props.updateProductInQueue(index, 'Product Name', evt.target.value)
    else
      this.props.updateProductInQueue(index, 'name', evt.target.value)
  }

  updateDescriptionValue(evt) {
    let evtCap = evt + ''
    this.setState({
      'description':evtCap
    });
  }

  updateUPCValue(evt) {
    // let val = evt.target.value
    // if (!/^[0-9]*$/.test(val)) {
    //   this.setState({'error':{'upc':'This is not a valid barcode number.'}})
    // }
    // else if (this.state.upcType == 'UPC-A') {
    //   if (val.length != 12)
    //     this.setState({'error':{'upc':'Please enter a valid UPC-A code'}})
    //   else
    //     this.setState({'error':{'upc':''}})
    // }
    // else if (this.state.upcType == 'UPC-E') {
    //   if (val.length != 6)
    //     this.setState({'error':{'upc':'Please enter a valid UPC-E code'}})
    //   else
    //     this.setState({'error':{'upc':''}})
    // }
    // else if (this.state.upcType == 'EAN-8') {
    //   if (val.length != 8)
    //     this.setState({'error':{'upc':'Please enter a valid EAN-8 code'}})
    //   else
    //     this.setState({'error':{'upc':''}})
    // }
    // else if (this.state.upcType == 'EAN-13') {
    //   if (val.length != 13)
    //     this.setState({'error':{'upc':'Please enter a valid EAN-13 code'}})
    //   else
    //     this.setState({'error':{'upc':''}})
    // }
    // this.setState({
    //   'upc':evt.target.value
    // });
  }

  updateSKUValue(evt) {
    let { product, index } = this.props
    if ('Product SKU/UPC' in product)
      this.props.updateProductInQueue(index, 'Product SKU/UPC', evt.target.value)
    else
      this.props.updateProductInQueue(index, 'sku', evt.target.value)
  }

  updateManufactureValue(evt) {
    let { product, index } = this.props
    if ('Manufacturer' in product)
      this.props.updateProductInQueue(index, 'Manufacturer', evt.target.value)
    else
      this.props.updateProductInQueue(index, 'manufacturer', evt.target.value)
  }

  updatePriceValue(evt) {
    let regex = /^(\d*\.)?\d+$/g;
    if (!regex.test(evt.target.value)) {
      this.setState({error: {price: 'Please enter a valid value. ##.##'}})
    } else {
      this.setState({error: {price: ''}})
    }
    let { product, index } = this.props
    if ('Price' in product)
      this.props.updateProductInQueue(index, 'Price', evt.target.value)
    else
      this.props.updateProductInQueue(index, 'price', evt.target.value)
  }

  updateLengthValue(evt) {
    let regex = /^\d+$/;
    if (!regex.test(evt.target.value)) {
      this.setState({error: {length: 'Please enter a valid value. ##'}})
    } else {
      this.setState({error: {length: ''}})
    }
    let { product, index } = this.props
    if ('Product Length' in product)
      this.props.updateProductInQueue(index, 'Product Length', evt.target.value)
    else
      this.props.updateProductInQueue(index, 'length', evt.target.value)
  }

  updateWidthValue(evt) {
    let regex = /^\d+$/;
    if (!regex.test(evt.target.value)) {
      this.setState({error: {width: 'Please enter a valid value. ##'}})
    } else {
      this.setState({error: {width: ''}})
    }
    let { product, index } = this.props
    if ('Product Width' in product)
      this.props.updateProductInQueue(index, 'Product Width', evt.target.value)
    else
      this.props.updateProductInQueue(index, 'width', evt.target.value)
  }

  updateHeightValue(evt) {
    let regex = /^\d+$/;
    if (!regex.test(evt.target.value)) {
      this.setState({error: {height: 'Please enter a valid value. ##'}})
    } else {
      this.setState({error: {height: ''}})
    }
    let { product, index } = this.props
    if ('Product Height' in product)
      this.props.updateProductInQueue(index, 'Product Height', evt.target.value)
    else
      this.props.updateProductInQueue(index, 'height', evt.target.value)
  }

  render() {

    let {product, queued} = this.props
    let {editing, dropdownOpen} = this.state

    let upcType = (
      <Dropdown isopen={dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav caret><p>{product['upcType']}</p></DropdownToggle>
        <DropdownMenu>
            <DropdownItem onClick={this.select}>UPC-A</DropdownItem>
            <DropdownItem onClick={this.select}>UPC-E</DropdownItem>
            <DropdownItem onClick={this.select}>EAN-8</DropdownItem>
            <DropdownItem onClick={this.select}>EAN-13</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )

    let editingView = (<Button onClick={this.edit} color="cyan">Edit</Button>)
    let inputName =  (<div><p>Product Name</p><span class="pce-card-value">{product['name']}</span></div>)
    let inputDescription = <ReactQuill style={{height: 200, marginBottom: 50}} label="Product Description" onChange={this.updateDescriptionValue} value={this.state.description}/>
    let inputUPC = (<div><p>Product UPC</p><span class="pce-card-value">{product['upc']}</span></div>)
    let inputSKU = (<div><p>Product SKU</p><span class="pce-card-value">{product['sku']}</span></div>)
    let inputUPCType = (<div><p>Product UPC Type</p><span class="pce-card-value">{product['upcType']}</span></div>)
    let inputManu = (<div><TextInput label="Manufacturer" onChange={this.updateManufactureValue} error={this.state.error.manufacturer} value={product['manufacturer']}/></div>)
    let inputPrice = (<div><p>Price</p><span class="pce-card-value">{product.price}</span></div>)
    let inputLength = (<div><p>Length (in):</p><p>{product['length']}</p></div>)
    let inputWidth = (<div><p>Width (in):</p><p>{product['width']}</p></div>)
    let inputHeight = (<div><p>Height (in):</p><p>{product['height']}</p></div>)
    let inputManufacturer = (<div><p>Manufacturer</p><span class="pce-card-value">{product.Manufacturer}</span></div>)

    if (editing) {
      editingView = (<Button onClick={this.edit} color="light-green">Save</Button>)
      inputName =  <TextInput name="Name" label="Name (required)" error={this.state.name} onChange={this.updateNameValue} error={this.state.error.name} value={product['name']}/>
      inputDescription = <ReactQuill style={{height: 200, marginBottom: 50}} label="Product Description" onChange={this.updateDescriptionValue} value={product['description']}/>
      inputUPC = <TextInput label="Product UPC (required)" onChange={this.updateUPCValue} error={this.state.error.upc} value={product['upc']}/>
      inputUPCType = upcType
      inputSKU = <TextInput label="Product SKU (required)" onChange={this.updateSKUValue} error={this.state.error.sku} value={product['sku']}/>
      inputManu = <TextInput label="Manufacturer" onChange={this.updateManufactureValue} error={this.state.error.manufacturer} value={product['manufacturer']}/>
      inputPrice = <TextInput label="Price (required)" onChange={this.updatePriceValue} error={this.state.error.price} value={product.price}/>
      inputLength = <TextInput label="Length (inches, required)" onChange={this.updateLengthValue} error={this.state.error.length} value={product['length']}/>
      inputWidth = <TextInput label="Width (inches, required)" onChange={this.updateWidthValue} error={this.state.error.width} value={product['width']}/>
      inputHeight = <TextInput label="Width (inches, required)" onChange={this.updateHeightValue} error={this.state.error.width} value={product['height']}/>
      inputManufacturer = <TextInput label="Manufacturer" onChange={this.updateManufactureValue} error={this.state.error.manufacturer} value={product['manufacturer']} />
    }

    if (queued) {
      editingView = (<div></div>)
    }

    let enqueue = (<div></div>)
    let dequeue = (<div></div>)
    let deleteView = (<div></div>)

    if (!editing) {
      enqueue = (!this.props.product.queued) ? <Button onClick={this.enqueue} color="light-green">Mark As Correct</Button> : <div></div>
      dequeue = (this.props.product.queued) ? <Button onClick={this.enqueue} color="yellow">Mark As Incorrect</Button> : <div></div>
      deleteView = (<Button onClick={this.remove} color="danger">Delete</Button>)
    }

    return (
      <div class="pce-card">
        <div class="pce-card-top">
          <div class="row">
            <div class="col-sm-3">
              {inputName}
            </div>
            <div class="col-sm-3">
              {inputSKU}
            </div>
            <div class="col-sm-3">
              {inputUPC}
            </div>
            <div class="col-sm-3">
              {inputPrice}
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <p>Product Description</p>
              <span class="pce-card-value"></span>
            </div>
            <div class="col-sm-2">
              {upcType}
            </div>
            <div class="col-sm-2">
              {inputManufacturer}
            </div>
            <div class="col-sm-2">
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3">
            </div>
            <div class="col-sm-3">
              {inputLength}
            </div>
            <div class="col-sm-3">
              {inputWidth}
            </div>
            <div class="col-sm-3">
              {inputHeight}
            </div>
          </div>
        </div>

        <div className={(this.props.product.queued) ? "pce-card-foot-enabled animated fadeIn" : "pce-card-foot animated fadeIn"}>
          <div class="row">
            <div class="col-sm-6">
              <h4>&#35;{this.props.index + 1}</h4>
            </div>
            <div class="col-sm-2">
              {deleteView}
            </div>
            <div class="col-sm-1">
              {editingView}
            </div>
            <div class="col-sm-3">
              {enqueue}
              {dequeue}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
