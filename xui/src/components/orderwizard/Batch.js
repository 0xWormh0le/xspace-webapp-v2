import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import ReactQuill from 'react-quill'
import axios from 'axios';
import * as qs from 'query-string';
import  Loader from 'react-loader';
import { truncateChar } from '../../util/RegexTest'
import { API_ROOT } from '../../index';
import { MDBTable, MDBTableBody, MDBTableHead, MDBDataTable   } from 'mdbreact';
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from "mdbreact";

export default class BatchOrder extends Component {

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
        ProductData: [],
        pageCount: 1,
        SelectedProductId: [],
        tableRows: [],
    };
    this.toggle = this.toggle.bind(this);
    this.toggleCat = this.toggleCat.bind(this);
    this.sortProduct = this.sortProduct.bind(this);
    this.ClearMessage = this.ClearMessage.bind(this);
    this.state.JsonData =[]
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

  componentDidMount() {
    /*Get All Product Data*/
    this.getAllProduct()
  }

  previousPage = () => {
    this.state.pageCount = this.state.pageCount-1
    if(this.state.pageCount != 0){
      this.getAllProduct()
    }else{
      this.state.pageCount = this.state.pageCount+1
    }
  }

  nextPage = () => {
    this.state.isLoaded = false
    this.state.pageCount = this.state.pageCount+1
    this.getAllProduct()
  }

  sortProduct(evt) {
    this.state.isLoaded = false
    this.setState({
      'sort': evt.target.value
    });
    this.getAllProduct(evt.target.value, true)
  }

  assembleProducts= () => {
    let productsRow =this.state.ProductData.map((product, index) => {
      return (
        {
          radio: <label className="pcw-sm-container" style={{marginLeft: 19,marginTop: -13}}>
                          <input type="checkbox" name="radio" className="check-box-pce-card" onChange={this.changeCheckbox.bind(this, product)} style={{marginLeft: 30}} />
                          <span className="checkmark"></span>
                          </label>,
          id: index,
          productname: 'test',
          xspaceid: this.props.truncateChar(product.uniqueID),
          upc: product.upccode,
          sku: product.SKU,
          category: product.category,
        }
      )
    });
    return productsRow;
  }

 
  /*get product data */
  getAllProduct = (sort,flag) => {
    //console.log(this.state)
    let apiUrl
    if(flag){
      apiUrl = API_ROOT + '/api/xspace-products/'
    }else{
      apiUrl = API_ROOT + '/api/xspace-products/'
    }

    let thisScope = this;
      const config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'authorization': 'Bearer ' + this.props.accessToken
        },
      }

      axios.get(apiUrl,config)
      .then(function (response) {
        thisScope.props.fieldValues.isLoaded = true;
        const newProduct = response.data.result.map((product) => {
          product['isChecked'] = false,
          product['is360viewrequired'] = false,
          product['is2drequired'] = false,
          product['is3dmodelrequired']= false,
          product['isvideorequired'] = false,
          product['notes2d'] = "",
          product['notes360view'] = "",
          product['notes3dmodel']= "",
          product['notesvideo'] = ""
          return product;
        });
        thisScope.setState({
          ProductData: newProduct,
          isLoaded: true,
        });
        thisScope.setState({ tableRows:thisScope.assembleProducts()});
        //console.log(thisScope.state.tableRows);

      })
      .catch(function (error) {
        console.error(error);
      });
  }

  handleCheckboxChange(event) {
    this.setState({isChecked: event.target.checked});
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

  ClearMessage(){
    this.setState({
        noRecord: false
    });
  }

  /*Search product*/
  onSubmit = (event) => {
      const conmont = this
      event.preventDefault()
      const search_query = this.state.searchQuery
      const user_id = this.props.fieldValues.user_id
      axios.get(API_ROOT + '/api/product_search?query_string='+search_query+'&user_id='+user_id)
      .then(function (response) {
        if(response.data.length != 0){
          const newProduct = response.data.map((product) => {
            product['isChecked'] = false,
            product['is360viewrequired'] = false,
            product['is2drequired'] = false,
            product['is3dmodelrequired']= false,
            product['isvideorequired'] = false,
            product['notes2d'] = "",
            product['notes360view'] = "",
            product['notes3dmodel']= "",
            product['notesvideo'] = ""
          return product;
          });

          conmont.setState({
            ProductData: newProduct,
            noRecord: false,
            isLoaded: true
          });
        }else{
          conmont.setState({
            noRecord: true,
            isLoaded: true
          });
        }

      })
      .catch(function (error) {
        console.error(error);
      });
  }



  render() {

    const data = {
    columns: [
      {
        label: '',
        field: 'radio',
        sort: 'asc'
      },
      {
        label: '#',
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
        label: 'Category',
        field: 'category',
        sort: 'asc'
      },
    ],
    rows: this.state.tableRows
  };

    let orderingDropDown = (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav caret><p>Descending</p></DropdownToggle>
        <DropdownMenu>
            <DropdownItem href="#">Ascending</DropdownItem>
            <DropdownItem href="#">Descending</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
    return (
          <div className="animated fadeIn">
          <MDBRow>
            <MDBCol md="9">
                <h4>Create A Batch</h4>
                <p>Create a batch within your order to make ordering hundreds of products a seamless experience.</p>
            </MDBCol>
            <MDBCol md="3">
                <MDBBtn rounded gradient="aqua"><i className="fa fa-video-camera" aria-hidden="true"></i>       Show Me How</MDBBtn>
            </MDBCol>
          </MDBRow>
          <hr />

          <MDBRow>
            <MDBCol md="9">
                <h4>Create A Batch</h4>
                <p>Create a batch within your order to make ordering hundreds of products a seamless experience.</p>
            </MDBCol>
            <MDBCol md="3">
                <MDBBtn rounded gradient="aqua"><i className="fa fa-video-camera" aria-hidden="true"></i>       Show Me How</MDBBtn>
            </MDBCol>
          </MDBRow>

          </div>
    );
  }
}
