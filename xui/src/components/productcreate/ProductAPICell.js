import React, { Component } from 'react';
import { Button, Card, CardBody, CardImage, CardTitle, CardText, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import TextInput from '../../lib/TextInput'
import ReactQuill from 'react-quill'

export default class ProductAPICell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      error: {
        upc: '',
        sku: '',
        name: '',
        editing: false
      }
    }

    this.enqueue = this.enqueue.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {

  }

  enqueue() {
    this.props.enqueue(this.props.index)
  }

  render() {

    let {product, queued} = this.props
    let {editing, dropdownOpen} = this.state

    let editingView = (<Button onClick={this.edit} color="cyan">Edit</Button>)
    let inputName =  (<div><p><strong>{product.name}</strong></p></div>)
    let inputUPC = (<div><p>UPC <strong>{product['sku']}</strong></p></div>)
    let inputSKU = (<div><p>SKU <strong>{product['upc']}</strong></p></div>)

    if (queued) {
      editingView = (<div></div>)
    }

    let enqueue = (<div></div>)
    let enqueueView = (<input type="checkbox" className="check-box-pce-card" checked={product.queued} onClick={this.enqueue}/>)
    let dequeue = (<div></div>)
    let deleteView = (<div></div>)

    return (
      <div class="pce-card">
        <div class="pce-card-top">
          <div class="row">
            <div class="col-xs-1">
              {enqueueView}
            </div>
            <div class="col-sm-5">
              {inputName}
            </div>
            <div class="col-sm-3">
              {inputSKU}
            </div>
            <div class="col-sm-3">
              {inputUPC}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
