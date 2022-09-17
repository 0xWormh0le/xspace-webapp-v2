import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalHeader, ModalBody, ModalFooter } from 'mdbreact';

import ReactQuill from 'react-quill';

import axios from 'axios';

export default class ProductAPIEntry extends Component {

  constructor(props) {
    super(props);

    this.state = {
      'products':[],
      'quantity': 20,
      'page': 1,
      'queuedProducts': [],
      'modal': true,
      'store': "Shopify",
      'dropdownOpen': false
    }
    this.enqueue = this.enqueue.bind(this);
  }

  componentDidMount() {

  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    })
  }

  enqueue(event) {
    if(event.target.checked){
      this.props.enqueue(this.props.index)
    }else{
      this.props.removeProductFromQueue(this.props.index)  
    }
  }

  render() {
      let {product, queued} = this.props
      let {editing, dropdownOpen} = this.state

      let editingView = (<Button onClick={this.edit} color="cyan">Edit</Button>)
      let inputName =  (<span className="product-update-name">{product.name}</span>)
      let inputUPC = (<div>UPC#: {product['sku']}</div>)
      let inputSKU = (<div>SKU#: {product['upc']}</div>)

      if (queued) {
        editingView = (<div></div>)
      }

      let enqueue = (<div></div>)
      let dequeue = (<div></div>)
      let deleteView = (<div></div>)

      return (
        <div className="row" style={{width: 742, height: 76, border: '2px solid rgb(184, 184, 184)', marginRight: 0, marginLeft: -4, background: 'rgb(255, 255, 255)' }}>
          <div className="col-md-1" style={{marginLeft: -10, marginTop: 4}}>
              <img id={product.id} src="/media/XSPACE-logo-watermark.png" style={{width:'60px',height:'60px'}} />
          </div>
          <div className="col-md-4">
            {inputName}
          </div>
          <div className="col-md-3" style={{marginLeft:-23, marginTop: 12}}>
            {inputUPC}
            {inputSKU}
          </div>
          <div className="col-md-3" style={{marginTop: 12}}>
            <div style={{marginLeft: -5}}>Status #: Published</div>
            <div style={{marginLeft: -5}}>Permissions #: Private</div>
          </div>
        </div>
    );
  }
}
