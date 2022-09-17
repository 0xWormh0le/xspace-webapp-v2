import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalHeader, ModalBody, ModalFooter } from 'mdbreact';

import ReactQuill from 'react-quill';

export default class BillingPlan extends Component {

  constructor(props) {
    super(props);

    this.state = {
      'modal': true,
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
      return (
      <div class="row">
           <div class="col-md-12">
               <h3>Billing History   <i className="fa fa-question-circle editquestion-mark"></i></h3>
               <p>Test</p>
           </div>
      </div>
    );
  }
}
