import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import ReactQuill from 'react-quill'
import axios from 'axios';
import * as qs from 'query-string';
import  Loader from 'react-loader';
import { truncateChar } from '../../util/RegexTest'
import { API_ROOT } from '../../index';
import { MDBTable, MDBTableBody, MDBTableHead, MDBDataTable   } from 'mdbreact';
import Moment from 'react-moment';
import 'moment-timezone';

export default class SelectProduct extends Component {

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
        SelectedProductId: [],
        tableRows: [],
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



  get_products() {
    // console.log("GP")
    // console.log(this.user_id)
    // fetch(API_ROOT + '/api/products_list/'+this.user_id+'/'+20+'/'+1+'/', {
    //     method: 'GET',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //     }
    //   }).then(res => res.json())
    //   .catch(error => console.error('Error:', error))
    //   .then(response => {
    //     console.log("-----------3-----------")
    //     console.log(response)
    //     try{
    //       //console.log(response[response.length-1]['pagecount']);
    //       this.setState({pagecount: response[response.length-1]['pagecount']});
    //       response.pop();
    //       this.setState({
    //         products: response,
    //         isSuccess: true
    //       });
    //     }catch(err){}
    //
    // });
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
    let productsRow =this.state.productData.map((product, index) => {
      return (
        {
          radio: <label className="pcw-sm-container" style={{marginLeft: 19,marginTop: -13}}>
                          <input type="checkbox" name="radio" className="check-box-pce-card" onChange={this.changeCheckbox.bind(this, product)} style={{marginLeft: 30}} />
                          <span className="checkmark"></span>
                          </label>,
          id: index + 1,
          productname: product.name,
          xspaceid: this.props.truncateChar(product.uniqueID),
          upc: product.upccode,
          sku: product.SKU,
          createddate: <Moment fromNow>{product.created}</Moment>,
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
      apiUrl = API_ROOT + '/api/xspace-products2/?format=datatables'
    }else{
      apiUrl = API_ROOT + '/api/xspace-products2/?format=datatables'
    }

    let thisScope = this;
      const config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'authorization': 'Bearer ' + this.props.accessToken
        },
      }

       var body = JSON.stringify({
        "userid": this.user_id,
      })

      axios.post(apiUrl,body,config)
      .then(function (response) {
        thisScope.props.fieldValues.isLoaded = true;
        const newProduct = response.data.data.map((product) => {
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
          productData: newProduct,
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

  clearMessage(){
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
            productData: newProduct,
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
        sort: 'desc'
      },
    ],
    rows: this.state.tableRows
  };

    let orderingDropDown = (
      <Dropdown isopen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav caret><p>Descending</p></DropdownToggle>
        <DropdownMenu>
            <DropdownItem href="#">Ascending</DropdownItem>
            <DropdownItem href="#">Descending</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
    return (
          <div className="animated fadeIn">
            <MDBDataTable btn searchLabel="Search Name, ID, UPC, or SKU" responsive data={data}></MDBDataTable>

            { this.state.noRecord ? <div class="row" style={{width:1030, height:105 }}>
               <div className="alert-wizard" style={{position: 'absolute', marginLeft: -82, marginTop: 37, background: '#EB5757', width: 1085 }}>
                <p className="alert-wizard-text" style={{width: 366, textAlign: 'center'}}>No result found <i class="fa fa-times" aria-hidden="true" style={{marginLeft: 691,position: 'absolute', marginTop: 12}} onClick={this.clearMessage}></i></p>
              </div>

            </div>: ""
            }
            { !this.state.isLoaded && (
              <div>
                <Loader loaded={this.state.isLoaded} lines={13} length={20} width={10} radius={30}
                      corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
                      trail={60} shadow={false} hwaccel={false} className="spinner"
                      zIndex={2e9} bottom="80px" left="460px" scale={1.00}
                      loadedClassName="loadedContent" />
              </div>
            )}
          </div>
    );
  }
}
