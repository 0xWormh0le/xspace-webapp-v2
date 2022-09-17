import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalHeader, ModalBody, ModalFooter } from 'mdbreact';

import ReactQuill from 'react-quill';
import  Loader from 'react-loader';
import { truncateChar } from '../../util/RegexTest'
import { API_ROOT } from '../../index';
import { MDBTable, MDBTableBody, MDBTableHead, MDBDataTable   } from 'mdbreact';
import { MDBContainer, MDBAlert } from 'mdbreact';
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from "mdbreact";
import axios from 'axios';

export default class BillingHistoryModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      'modal': true,
      invoiceListData: this.props.invoiceList,
      invoiceListRows:[],
    }
    this.enqueue = this.enqueue.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderInvoices = this.renderInvoices.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
    this.downloadInvoicePDF = this.downloadInvoicePDF.bind(this);
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

    console.log(this.props);

    if (this.state.invoiceListData && this.state.invoiceListData.length) {

    }
    else{

    }
    this.setState({ invoiceListRows:this.renderInvoices()});
    console.log(this.state.invoiceListData);

  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    })
  }

  renderInvoices = () => {
    let renderObj = null;
    let noRowsFound = (<h4>No Invoices Found</h4>)

    if (this.state.invoiceListData && this.state.invoiceListData.length) {
    // not empty
        let invoicesRow =this.state.invoiceListData.map((invoice, index) => {
          return (
            {
              invoiceid: invoice.invoiceid,
              date: invoice.date,
              amount: '$'+invoice.amount,
              description: invoice.description,
              status: invoice.status,
              action: (<MDBBtn rounded gradient="aqua" onClick={this.downloadInvoicePDF.bind(this, invoice.invoiceid)}>
                            <i className="fa fa-download"></i>
                          </MDBBtn>),
            }
          )
        });
        renderObj = invoicesRow;
    } else {
       // empty
          var lists = [{invoiceid: '-', date: '-', amount: '-', description: '-', status: '-', action: '-'}];
          return(lists);
    }

    return renderObj;
  }

  downloadInvoicePDF = (invoiceID) =>{
    //console.log(invoiceID);
    axios.get(API_ROOT + '/api/download_invoicepdf?query_string='+invoiceID)
    .then(function (response) {
        if(response.data.length != 0){
            var url = response.data.downloadURL;
            var win = window.open(url, '_blank');
            win.focus();

          };
      })
      .catch(function (error) {
        console.error(error);
      });

  }

  renderAlert = () => {
        const data = {
        columns: [
          {
            label: 'Invoice #',
            field: 'invoiceid',
            sort: 'asc'
          },
          {
            label: 'Date',
            field: 'date',
            sort: 'asc'
          },
          {
            label: 'Amount',
            field: 'amount',
            sort: 'asc'
          },
          {
            label: 'Description',
            field: 'description',
            sort: 'asc'
          },
          {
            label: 'Status',
            field: 'status',
            sort: 'asc'
          },
          {
            label: 'Actions',
            field: 'action',
          },
        ],
        rows: this.state.invoiceListRows
       };

       if (!this.state.invoiceListData) {
            return(<MDBContainer>
                <MDBAlert color="info">
                    No Billing Invoices Found
                </MDBAlert>
            </MDBContainer>);
       }
       else{
            return(<MDBDataTable btn searchLabel="Search ID, Date, Amount" width="100%" data={data}></MDBDataTable>);
       }
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
               {this.renderAlert()}
               <div className="row">

               </div>


           </div>
      </div>
    );
  }
}