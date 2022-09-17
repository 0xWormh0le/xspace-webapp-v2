import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import ReactQuill from 'react-quill'
import axios from 'axios';
import * as qs from 'query-string';
import  Loader from 'react-loader';
import { truncateChar } from '../../util/RegexTest'
import { API_ROOT } from '../../index';
import Moment from 'react-moment';
import 'moment-timezone';

import { MDBTable, MDBTableBody, MDBTableHead, MDBDataTable, MDBBtn, MDBIcon  } from 'mdbreact';

export default class SelectProductBatch extends Component {

  constructor(props) {
    super(props);

    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        dropdownOpenCat: false,
        editing: true,
        sort: '',
        searchQuery: "",
        isChecked: true,
        noRecord: false,
        isLoaded: false,
        productData: [],
        pageCount: 1,
        selectedProductIndex: 0,
        tableRows: [],
        filteredView: []
    };
    this.toggle = this.toggle.bind(this);
    this.toggleCat = this.toggleCat.bind(this);
    this.sortProduct = this.sortProduct.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.state.JsonData =[]

    this.userData = JSON.parse(localStorage.getItem('persist:root'));
    var data = JSON.parse(this.userData['auth']);
    this.user_id = data['access']['user_id'];

    // this.get_products();
  }

  handleInputChange = (event) => {
      const target = event.target,
          value = target.type ===
          'checkbox' ? target.checked : target.value,
        name = target.name
      this.setState({
          [name]: value
      });
  }

  previousPage = () => {
    this.state.pageCount = this.state.pageCount-1
    if(this.state.pageCount != 0){

    }else{
      this.state.pageCount = this.state.pageCount+1
    }
  }

  nextPage = () => {
    this.state.isLoaded = false
    this.state.pageCount = this.state.pageCount+1

  }

  sortProduct(evt) {
    this.state.isLoaded = false
    this.setState({
      'sort': evt.target.value
    });
  }

  assembleProducts= (productData) => {
    // xspaceid: this.props.truncateChar(product.uniqueID),
    if (productData) {
      return productData.map((product, index) => {
        return (
          {
            id: index + 1,
            productname: product.name,
            xspaceid: product.uniqueID,
            upc: product.upccode,
            sku: product.SKU,
            createddate: <Moment fromNow>{product.created}</Moment>,
            radio: <MDBBtn tag="a" size="sm" floating gradient="peach" onClick={()=>{this.props.removeFromBatch(this.props.batchIndex, index)}}>
              <MDBIcon icon="times-circle" size="md" />
            </MDBBtn>,
          }
        )
      });
    } else {
      return []
    }
  }

  handleCheckboxChange(event) {
    this.setState({isChecked: event.target.checked});
  }

  handleSearchChanged(event) {
    // this.setState({"filteredView": event.target.value})
  }

  changeCheckbox = (product, event) => {

    let arr = this.props.fieldValues.selectedProductLists.slice();

    if(arr.indexOf(product) >= 0) {
      product['isChecked'] = false
      arr.splice(arr.indexOf(product), 1);
    } else {
      product['isChecked'] = true
      arr.push(product);
    }
    this.props.fieldValues.selectedProductLists = arr
    return this.props.fieldValues.selectedProductLists
  }

  changeRadioButton = (product,event) =>{
    this.props.fieldValues.selectedProductLists[0] = product;
  }

  toggle() {
      this.setState({
          dropdownOpen: !this.state.dropdownOpen
      });
  }

  toggleCat() {
      this.setState({
          dropdownOpenCat: !this.state.dropdownOpenCat
      });
  }

  clearMessage(){
    this.setState({
        noRecord: false
    });
  }

  render() {

    const data = {
      columns: [
        {
          label: 'Number',
          field: 'id',
          sort: 'asc'
        },
        {
          label: 'Product Name',
          field: 'productname',
          sort: 'asc'
        },
        {
          label: 'XSPACE ID',
          field: 'xspaceid',
          sort: 'asc'
        },
        {
          label: 'UPC',
          field: 'upc',
          sort: 'asc'
        },
        {
          label: 'SKU',
          field: 'sku',
          sort: 'asc'
        },
        {
          label: 'Created',
          field: 'createddate',
          sort: 'asc'
        },
        {
          label: '',
          field: 'radio',
          sort: 'asc'
        }
      ],
      rows: this.assembleProducts(this.props.data)
    };

    return (
      <div className="animated fadeIn">
        <MDBDataTable
          btn
          searchLabel="Search Name, ID, UPC, or SKU"
          responsive
          pagination="false"
          data={data}></MDBDataTable>
          { this.state.noRecord ? <div class="row" style={{width:1030, height:105 }}>
            <div className="alert-wizard" style={{position: 'absolute', marginLeft: -82, marginTop: 37, background: '#EB5757', width: 1085 }}>
              <p className="alert-wizard-text" style={{width: 366, textAlign: 'center'}}>No result found <i class="fa fa-times" aria-hidden="true" style={{marginLeft: 691,position: 'absolute', marginTop: 12}} onClick={this.clearMessage}></i></p>
              </div>
            </div>: ""
          }
      </div>
    );
  }
}
