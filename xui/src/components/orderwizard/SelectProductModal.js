import React, { Component } from 'react';
import styled from 'styled-components'
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import ReactQuill from 'react-quill'
import axios from 'axios';
import * as qs from 'query-string';
import  Loader from 'react-loader';
import { API_ROOT } from '../../index';
import { MDBTable, MDBBtn, MDBTableBody, MDBTableHead, MDBDataTable, MDBInput, MDBSwitch } from 'mdbreact';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
// import moment from 'moment'
import Moment from 'react-moment';
import 'moment-timezone';
import { StyledBootstrapTable } from '../../lib/styled-bootstrap-table'

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  button {
    background-color: white !important;
      border: 2px solid #f4f5fa;
      box-shadow: none;
      border-radius: 20px;
      font-size: 14px;
      line-height: 20px;
      color: #333330 !important;
      :hover {
        border: none;
        background-color: #00A3FF !important;
        color: white !important;
        box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
      }
  }
`

export default class SelectProductModal extends Component {

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
        filteredView: [],
        pageCount: 1,
        selectedProductIndex: 0,
        selectedProductList: {},
        tableRows: [],
        selected: []
    };
    this.sortProduct = this.sortProduct.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.returnProducts = this.returnProducts.bind(this);
    this.changeRadioButton = this.changeRadioButton.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
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

  componentDidMount() {
    /*Get All Product Data*/
    this.getAllProducts()
  }

  previousPage = () => {
    this.state.pageCount = this.state.pageCount-1
    if(this.state.pageCount != 0){
      this.getAllProducts()
    }else{
      this.state.pageCount = this.state.pageCount+1
    }
  }

  nextPage = () => {
    this.state.isLoaded = false
    this.state.pageCount = this.state.pageCount+1
    this.getAllProducts()
  }

  sortProduct(evt) {
    this.state.isLoaded = false
    this.setState({
      'sort': evt.target.value
    });
    this.getAllProducts(evt.target.value, true)
  }

  truncate(charString, productName) {
    if(productName){
      return charString.length>=10 ? charString.substring(0, 10)+"...": charString
    }else{
      return charString.length>=6 ? charString.substring(0, 8)+"...": charString
    }
  }

  updateFilter = (event) => {
    let { productData, filteredView } = this.state
    let rows = []
    for (var i = 0; i < productData.length; i++) {
      if (productData[i].name.includes(event.target.value)) {
        rows.push(productData[i])
      }
    }
    this.setState({filteredView :rows})
  }

  parseProducts = (fixedData) => {
      //filter
      let productsRow = fixedData.map((product, index) => {
        //non blank label for datatable, component will detect label
        let idc = "#"+(index + 1)
        let idcId = "cbox"+index
        // if (product.name.includes("AAA")) {
          return (
            {
              id: index + 1,
              productname: product.name,
              xspaceid: this.truncate(product.uniqueID),
              upc: product.upccode,
              sku: product.SKU,
              createddate: <Moment fromNow>{product.created}</Moment>
            }
          )
        // }
      });
      return productsRow;
  }

  returnProducts = () => {
    let products = []
    console.log(this.state.selected)
    let keys = this.state.selected
    keys.map((key) => {
      products.push(this.state.productData[key])
    })
    console.log("RETURN PRODUCTS")
    console.log(products)
    return this.props.returnProducts(products)
  }

  /*get product data */
  getAllProducts = (sort,flag) => {
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
        'authorization': 'Bearer ' + this.props.fieldValues.accessToken
      },
    }

    var body = JSON.stringify({
        "userid": this.user_id,
    })

    axios.post(apiUrl,body,config).then(function (response) {
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
      //console.log(response)
      thisScope.setState({
        productData: newProduct,
        filteredView: newProduct,
        isLoaded: true
      },()=> {
        //completion block
      });
    })
    .catch(function (error) {
      console.error(error);
    });
  }

  handleCheckboxChange(event) {
    this.setState({isChecked: event.target.checked});
  }

  changeRadioButton = (product,idx,idcId) => {
    let prList = this.state.selectedProductList
    document.getElementById(idcId).style.display = "none"
    if (!prList.hasOwnProperty(idx)) {
      prList[idx] = product;
    } else {
      delete prList[idx]
    }
    this.setState({"selectedProductList": prList})
  }

  clearMessage(){
    this.setState({
        noRecord: false
    });
  }

  handleOnSelect = (row, isSelect) => {
    //NOTE: Subtract 1 for index starts at 0
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.id - 1]
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.id - 1)
      }));
    }
  }

  handleOnSelectAll = (isSelect, rows) => {
    console.log("SA", rows)
    const ids = rows.map(r => r.id - 1);
    if (isSelect) {
      this.setState(() => ({
        selected: ids
      }));
    } else {
      this.setState(() => ({
        selected: []
      }));
    }
  }

  render() {

    const { filteredView } = this.state
    const columns = [
      {
        dataField: 'id',
        text: 'id',
        sort: true
      },
      {
        text: 'Product Name',
        dataField: 'productname',
        sort: true
      },
      {
        text: 'XSPACE ID',
        dataField: 'xspaceid',
        sort: true
      },
      {
        text: 'UPC',
        dataField: 'upc',
        sort: true
      },
      {
        text: 'SKU',
        dataField: 'sku',
        sort: true
      },
      {
        text: 'Created',
        dataField: 'createddate',
        sort: true
      },
    ]

    const rowStyle = { margin: 0, padding: 0 };

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      style: { backgroundColor: '#c8e6c9' },
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll,
      selectionHeaderRenderer: () => 'All',
      selectionRenderer: ({ mode, ...rest }) => {
        return (rest.checked) ? (<span class="strongCheck"><strong>X</strong></span>) : (<span class="strongCheck"><strong>+</strong></span>)
      }
    }

    const defaultSorted = [{
      dataField: 'id',
      order: 'asc'
    }];

    const sizePerPageRenderer = ({
      options,
      currSizePerPage,
      onSizePerPageChange
    }) => {
      let bestOptions = [{"text": "10 per page", "page": 10}]
      return (

        <div className="btn-group" role="group">
          {
            bestOptions.map((option) => {
              const isSelect = currSizePerPage === `${option.page}`;
              return (
                <button
                  key={ option.text }
                  type="button"
                  onClick={ () => onSizePerPageChange(option.page) }
                  className={ `btn ${isSelect ? 'btn-secondary' : 'btn-warning'}` }
                >
                  { option.text }
                </button>
              );
            })
          }
        </div>
      )
    };

  const options = {
     sizePerPageRenderer
  };


  let cancelButton = (
    <Button color="elegant" onClick={()=>{this.props.toggleModal()}}>Cancel</Button>
  )

  let addButton = (
    <Button color="get-started" onClick={()=>{this.returnProducts()}}>Add Products to Batch</Button>
  )

  let searchBar = (
    <MDBInput type="text" placeholder="Type product name here..." onChange={this.updateFilter}></MDBInput>
  )

  return (
    <div className="animated fadeIn">
      <StyledBootstrapTable>
        <BootstrapTable
          keyField='id'
          data={ this.parseProducts(filteredView) }
          columns={ columns }
          selectRow={ selectRow }
          defaultSorted = { defaultSorted }
          pagination={ paginationFactory(options) }
        />
      </StyledBootstrapTable>
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
      <ButtonWrapper>
        {cancelButton}
        {searchBar}
        {addButton}
      </ButtonWrapper>
    </div>
  );
  }
}
