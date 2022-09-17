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
      'hideThis': false, 
      'queuedProducts': [],
      'modal': true,
      'store': "Shopify",
      'dropdownOpen': false
    }
    this.enqueue = this.enqueue.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  
  handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
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
      this.props.enqueue(this.props.index, true)
    }else{
      this.props.remove(this.props.index, false)
    }
  }

  render() {
      let {product, queued, showStatus} = this.props
      let {editing, dropdownOpen, hideThis} = this.state
      let editingView = (<Button onClick={this.edit} color="cyan">Edit</Button>)
      let inputName =  (<span className="product-update-name">{product.name}</span>)
      let inputUPC = (<div>UPC#: {product['sku']}</div>)
      let inputSKU = (<div>SKU#: {product['upc']}</div>)
      let foundOnStore = (<b style={{color: '#388e3c'}}>Found</b>)
      let foundNotOnStore = (<b style={{color: '#d74444'}}>Not Found</b>)

      let enqueue = (<div></div>)
      let enqueueView = (<input type="checkbox" className="check-box-pce-card" checked={product.queued} onChange={this.enqueue}/>)
      let dequeue = (<div></div>)
      let deleteView = (<div></div>)

      return (
      
          <div className="row" style={{width: 742, height: 76, border: '2px solid rgb(184, 184, 184)', marginRight: 0, marginLeft: -4, background: 'rgb(255, 255, 255)' }}>
            <div className="col-sm-1" style={{marginTop: 12}}>
              {enqueueView}
            </div>
            <div className="col-md-1" style={{marginLeft: -10, marginTop: 4}}>
              <img id={product.id} src="/media/XSPACE-logo-watermark.png" style={{width:'60px',height:'60px'}} />
            </div>
            <div className="col-md-5">
              {inputName}
            </div>
            {hideThis ? <div className="col-md-3" style={{marginTop: 12}}>
              {inputUPC}
              {inputSKU}
            </div>: ''}
            <div className="col-md-3" style={{marginTop: 12}}>
              <div style={{marginLeft: -5}}>Status #: Published</div>
              <div style={{marginLeft: -5}}>Permissions #: Private</div>
            </div>
            {showStatus ? 
                <div className="col-md-2" style={{marginTop: 12}}>
                  <div style={{marginLeft: -5}}>Store Status {product['ecommerce_id']? foundOnStore : foundNotOnStore}</div>
                </div>
            : ''}
          </div>
    );
  }
}
