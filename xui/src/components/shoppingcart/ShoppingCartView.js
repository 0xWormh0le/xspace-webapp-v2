import React, { Component } from 'react'
import styled from 'styled-components'
import {MDBModal, MDBModalBody, MDBModalHeader} from 'mdbreact'
import ShoppingRightSideMenu from '../menu/ShoppingRightSideMenu'
import '../managepage.css';
import { MDBDataTable, MDBInput  } from 'mdbreact';
import $ from 'jquery';
import { API_ROOT } from '../../index';
import Loader from 'react-loader';
import { StyledTable } from '../../lib/styled-table'
import 'moment-timezone';
import 'react-table/react-table.css'
import '../DataTables/css/jquery.dataTables.min.css';
import '../DataTables/css/bootstrap_3.3.6.css';
import { Wrapper } from '../../lib/wrapper'
import ContentStandard from "../orderwizard/ContentStandard";
import CaptureOnlyCheckout from './CaptureOnlyCheckoutView'

export const CartView = styled.div`
  display: flex;
  width: 1400px;
  
`

export const RightPanel = styled(Wrapper)`
  margin-left: 30px;
  // max-width: 263px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  min-height: 700px;
`

const StyledModal = styled(MDBModal)`
  min-width: 848px;
  border-radius: 15px;
  .modal-content {
    border-radius: 15px;
  }
  .modal-header {
    border-bottom: 2px solid #F4F5FA;
    background-color: #00A3FF;
    border-radius: 15px 15px 0px 0px;
    .modal-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-right: 2.5%;
      b, button {
        color: #333333;
        font-size: 16px;
        line-height: 26px;
      }
      button {
        border: 2px solid #F4F5FA;
        background-color: white;
        border-radius: 20px;
        width: 120px;
        height: 38px;
        :hover {
          background-color: #00A3FF;
          color: white;
          border: none;
        }
      }
    }
  }

  .modal-body {
    .container {
      padding: 45px 90px;
      h4 {
        font-size: 18px;
        line-height: 26px;
        color: #333330;
        font-weight: 400;
        text-align: center;
        margin-bottom: 25px;
      }
      .row {
        justify-content: space-between;
        padding-bottom: 25px;
      }
      .card-item {
        width: 133px;
        height: 133px;
        padding-top: 30px;
        border: 2px solid rgba(61, 61, 61, .2);
        border-radius: 10px;
        text-align: center;
        img {
          width: 32px;
          margin-bottom: 9px;
        }
        h6, p {
          font-size: 11px;
          line-height: 26px;
          margin: 0;
          font-weight: 400;
        }
        h6 {
          font-weight: bold;
        }
      }
      center {
        display: flex;
        align-items: center;
        justify-content: center;
        a, button {
          width: 133px;
          height: 38px;
          color: #333333;
          font-size: 14px;
          font-weight: bold;
          line-height: 20px;
          border-radius: 19px;
          border: 2px solid #F4F5FA;
          :hover {
            background-color: #00A3FF;
            color: white;
            border: none;
          }
        }
        a {
          text-decoration: none;
          color: #333333;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          margin-right: 30px;
          border: 2px solid #F4F5FA;
          :hover {
            background-color: #00A3FF;
            color: white;
            border: none;
          }
        }
      }
    }
  }
`

const StyledCheckoutModal = styled(StyledModal)`
  .modal-content {
    max-width: 1008px;
    margin: auto;
    .flex-container-row {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    .modal-body {
      width: 100%;
      .row {
        justify-content: center;
        button {
          min-width: 133px;
          height: 38px;
          background-color: #00A3FF;
          border-radius: 19px;
          color: white;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
`

const LeftPanel = styled(Wrapper)`
  position: relative;
  width: 100%;
  min-height: 700px;
  padding: 100;
  // .dataTables_info {
  //   font-size: 14px;
  //   color: #333330;
  //   line-height: 20px;
  // }
  // .pagination .page-item {
  //   color: #333333;
  //   font-size: 14px;
  //   line-height: 20px;
  //   font-weight: bold;
  // }
  // .pagination .page-item.active .page-link {
  //   background-color: #00A3FF;
  //   border-radius: 100%;
  // }
  // .dataTables_length {
  //   label {
  //     font-size: 14px;
  //     color: #333330;
  //     line-height: 20px;
  //   }
  //   .select-wrapper {
  //     input {
  //       height: 20px;
  //       margin-top: 9px;
  //       font-size: 14px;
  //       line-height: 20px;
  //       color: #333333;
  //       font-weight: bold;
  //     }
  //   }
  // }
  // .dataTables_filter {
  //   input {
  //     // font-size: 14px;
  //     // padding-bottom: 3px;
  //     // border: none;
  //   }
  // }
  
  .dataTables_wrapper {
    margin-top: 0px;
  }
  
  .dataTables_wrapper .dataTables_filter {
    input {
      border: 2px solid #F4F5FA !important;
      box-shadow: none !important;
      font-size: 14px;
      font-weight: bold;
      color: #3d3d3d;
      line-height: 20px;
      border-radius: 20px;
      height: 38px;
      padding: 0 15px;
      box-sizing: border-box;
      max-width: 380px;
      // margin-left: 380px;
      // left: 300px;
      ::placeholder {
        text-align: center;
      }
    }
  }
  .dataTables_filter.md-form {
      margin: 1rem 0;
      // left: 70px;
      float: right;
      width: 370px;
  }
  .dataTables_wrapper .btn-primary {
        border-radius: 2rem;
        background-color: #3eb2ff !important;
        border-color: #3eb2ff;
        font-size: 12px;
        margin-top: 10px;
        margin-right: 15px;

  }
  
  .dataTables_wrapper li.active {
    a.page-link {
      // background-color: #00A3FF;
      background-color: #3eb2ff;
      // border-radius: 16px;
      border-radius: 0px;
      // width: 5px;
      // height: 5px;
      color: white;
    }
  }
  
  .dataTables_wrapper table.dataTable thead:last-child {
    display: table-row-group;
  }
  
  // table.dataTable colgroup {
  //   display: none;
  // }
  
  .dataTables_wrapper table.dataTable tbody tr td {
    // font-size: 14px;
    // font-weight: normal;
    // color: #636363;
    
    :first-child {
      width: 8%;
      padding: 10px 32px 10px 8px;
    }
    :nth-child(2) {
      width: 23%;
    }
    :nth-child(3) {
      width: 32%;
    }
    :nth-child(4) {
      width: 23%;
    }
    :nth-child(5) {
      width: 10%;
    }
    :last-child {
      padding: 0;
      display: none;      
    }
  }
  
  .dataTables_wrapper table.dataTable thead tr th {
    font-size: 14px;
    // font-weight: normal;
    color: #636363;
    
    :first-child {
      width: 8%;
      padding: 10px 32px 10px 8px;
    }
    :nth-child(2) {
      width: 24%;
    }
    :nth-child(3) {
      width: 34%;
    }
    :nth-child(4) {
      width: 24%;
    }
    :last-child {
      width: 10%;      
    }
  }
      
  .dataTables_wrapper table.dataTable thead tr th {
    border-bottom: 3px solid #dcdcdc;
    // div {
    //     width: 0px;
    //     height: 0px;
    //     // top: 20px;
    //     bottom: 5px;
    //     margin: -1px;
    //     padding: 0px;
    //     // padding-right: 0px;
    //     // padding-left: 0px;
    // }
  }
  
  table.dataTable tbody tr:nth-child(2n+1) {
    background-color: #FFFFFF;
  }
  table.dataTable {
    margin-top: 0.90%;
  }
  table.dataTable tbody {
      div {
          width: 0px;
          height: 0px;
          bottom: 20px;
          // top: 0px;
          // margin-top: 0px;
          margin: 0px;
          padding: 0px;
          // padding-left: 0px;
      }
  }
  
  .table-responsive {
        margin-left: 1%;
        width: 98%;
        // overflow-y: auto;
        // overflow-x: auto;        
        // max-height: 500px;
        // display: none;
  }
  
  // table.table.btn-table td {
  //   max-width: 200px;
  //   white-space: nowrap;
  //   text-overflow: ellipsis;
  //   overflow: hidden;
  // }
`

const ShopCart = styled.div`
    position: relative;
    width: 51.057px;
    height: 47.866px;
    // left: 50%;
    // top: 35px;
    overflow: visible;
    // transform: translateX(-50%);


    .Path_963 {
        overflow: visible;
        position: absolute;
        width: 9.573px;
        height: 9.573px;
        left: 9.573px;
        top: 38.293px;
        transform: matrix(1,0,0,1,0,0);
    }
    .Path_964 {
        overflow: visible;
        position: absolute;
        width: 9.573px;
        height: 9.573px;
        left: 41.484px;
        top: 38.293px;
        transform: matrix(1,0,0,1,0,0);
    }
    .Path_965 {
        overflow: visible;
        position: absolute;
        width: 51.057px;
        height: 35.102px;
        left: 0px;
        top: 0px;
        transform: matrix(1,0,0,1,0,0);
    }

`

const CartHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 25px;
  // border-bottom: 3px solid #dcdcdc;
  i {
    font-size: 32px;
    color: #000000;
    padding-right: 20px;
  }
  span {
    color: #636363;
    color: rgba(99,99,99,1);
    font-size: 20px;
    font-weight: bold;
    line-height: 20px;
    padding-left: 20px;
  }
  // shopcart {
  //   position: relative;
    // width: 51.057px;
    // height: 47.866px;
    // // left: 50%;
    // // top: 35px;
    // overflow: visible;
    // // transform: translateX(-50%);
  //
  //
  //   .Path_963 {
  //       overflow: visible;
  //       position: absolute;
  //       width: 9.573px;
  //       height: 9.573px;
  //       left: 9.573px;
  //       top: 38.293px;
  //       transform: matrix(1,0,0,1,0,0);
  //   }
  //   .Path_964 {
  //       overflow: visible;
  //       position: absolute;
  //       width: 9.573px;
  //       height: 9.573px;
  //       left: 41.484px;
  //       top: 38.293px;
  //       transform: matrix(1,0,0,1,0,0);
  //   }
  //   .Path_965 {
  //       overflow: visible;
  //       position: absolute;
  //       width: 51.057px;
  //       height: 35.102px;
  //       left: 0px;
  //       top: 0px;
  //       transform: matrix(1,0,0,1,0,0);
  //   }
  // }
  
  #buttonleft {
    background-color: #707070;
    // color: white;
    // display: block;
    position: absolute;
    height: 23px;
    left: 380px;
    top: 35px;
    // /* line-height: 40px; */
    // /* text-decoration: none; */
    width: 50px;
    // /* text-align: center; */
    border-top-left-radius: 25% 50%;
    border-bottom-left-radius: 25% 50%;
    
  //   svg {
  //     position: absolute;
  //     width: 20px;
  //     height: 20px;
  //     top: 0px;
  //     left: 15px;
  //   }
  // }
  
  #buttonright {
    // background-color: #707070;
    background-color: white;
    // color: white;
    // display: block;
    position: absolute;
    height: 23px;
    left: 430px;
    top: 35px;
    // /* line-height: 40px; */
    // /* text-decoration: none; */
    width: 50px;
    // /* text-align: center; */
    border-top-right-radius: 25% 50%;
    border-bottom-right-radius: 25% 50%;
    
    svg {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 0px;
      left: 10px;
    }
  }
`
export const ViewFragment = styled.div`
  padding: 0px 0px 0;
`

const DeleteButton = styled.button`
  width: 180px;
  height: 50px;
  display: flex-start;
  // float: left;
  background-color: #ff2626;
  color: #ffffff;
  font-size: 15px;
  line-height: 26px;
  font-weight: normal;
  border-radius: 29px;
  border: 2px solid #F4F5FA;
  margin-left: 12px;
  
  
  :hover {
    background-color: #ff2626;
    color: white;
    border: none;
  }
  :focus {
    background-color: #ff2626;
  }
  //
  // :disabled {
  //   background-color: #c1c1c1;
  // }
  
  &.small-btn {
    width: 130px;
    height: 38px;
    border-radius: 19px;
    font-size: 14px;
  }
  &.filled-btn {
    background-color: #ff2626;
    color: #ffffff;
  }
`
const SubTotal = styled.div`
  // display: flex;
  // flex-grow: 2;
  float: right;
  font-size: 28px;
  font-weight: bold;
  margin-right: 6%;
  margin-top: 0.4%;
  color: #ff6565
  // width: 26%;
  // padding-right: 1em;
`
const SubTitle = styled.span`
  // float: left;
  font-size: 23px;
  color: #636363;
  padding-right: 2em;
`


export default class ShoppingCarter extends Component {
    _isMounted = false;
  constructor(props, context) {
    super(props, context);

    this.state = {
      products: '',
      productimg: [],
      isSuccess: false,
      imgUrl: 'https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png',//'https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/1ff1/a35c/132c31448f51c4c3dce187d2c5362935',
      pagenumber: 1,
      pagecount: 0,
      captureIncluded: false,
      editingIncluded: false,
      totalProducts: '',
      totalServices: '',
      username: '',
      tableRows: [],
      productData: [],
      // prodRow: [],
      pageCount: 1,
      selectedProductIndex: 0,
      // isChecked: true,
      noRecord: false,
      isLoaded: false,
      isCheckAll: false,
      companyName: this.props.companyName,
      contentStandardModal: false,
      productCreateModal: false,
      thumbnailView: false,
      orderEditModal: false,
      orderCaptureModal: false,
      isMediaUpload: false,
      userProfile: [],
      profilePic: '/icons8-customer-128.png',
      productOrderList:[],
      billingCheck: null,
      chargeBeeCheckoutURL: '',
      forDelete: new Set(),
      forCheckout: new Set(),
      zeroTotal: "$ 0.00",
      Subtotal: "$ 0.00",
      deleteSelected: false,
      deleteSpinner: false,
      chargeBeeComebackRaw: '',
      chargeBeeComebackDict: null,
      captureCheckoutToggle: false
    };
    this.clearMessage = this.clearMessage.bind(this)
    this.updateCart = this.updateCart.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.deleteSelected = this.deleteSelected.bind(this)
    this.handleProceedToCheckout = this.handleProceedToCheckout.bind(this)
    this.checkoutPhotography = this.checkoutPhotography.bind(this)

    this.userData = JSON.parse(localStorage.getItem('persist:root'))
    var data = JSON.parse(this.userData['auth'])
    this.user_id = this.props.userId;//data['access']['user_id']
    this.flag = 0
    this.row = ''

    localStorage.removeItem('pageNum')
    // this.get_userdetail()

    this.tableRowLabels =
        [
          {
            // label: "select",
            // label: <MDBInput className="tabcheck" label="All" type="checkbox" id="checkbox5" style={{width:10, height:10}}/>,
            // label: "" //<MDBInput label=" " key="H" type="checkbox" id="checkbox_all" filled  onClick={this.checkAll}/>,
            label: "Select",
            field: 'ischecked',
            sort: 'disabled',
            searchable: false,
            // width: 10,
          },
          {
            label: 'Service',
            // label: <MDBInput label="Product Name" type="checkbox" id="checkbox5"/>,
            field: 'productname',
            sort: 'desc'
          },
          {
            label: 'Description',
            field: 'slug',
            sort: 'desc'
          },
          {
            label: 'Products',
            field: 'upc',
            sort: 'desc'
          },
          {
            label: 'Price',
            field: 'sku',
            sort: 'desc'
          },

        ];

  }

  componentDidMount() {
    this._isMounted = true;
    document.title = 'XSPACE | Shopping Cart'

    console.log('this.state.companyName', this.state.companyName)

    this.props.loadProfileData()
    console.log( "componentdidmount this.props.cartAllOrders", this.props.cartAllOrders )

    this.props.getFullOrder()

    // console.log("SHOPPINGPRODUCTS", this.props.ProductOrder);
    this.setState({'userProfile':this.props.userInfo || '' }); //, ()=>this.getProduct());
    this.setState( {deleteSpinner: false})
    // console.log("SHOPPINGPRODUCTSStore", localStorage.getItem("dingo"));

    // this.props.runBillingCheck();
    // this.props.getBillingSummary();

    if (this.props.location.search !== this.state.chargeBeeComebackRaw) {
      const query = new URLSearchParams(
          this.props.location.search
      );
      let data= {};

      for (let params of query.entries()) {
        data[params[0]] = params[1]
      }
      this.setState( {chargeBeeComebackDict: data}, () => {
        if (this.state.chargeBeeComebackDict.state === "succeeded") {
          console.log("this.state.chargeBeeComebackDict.id", this.state.chargeBeeComebackDict.id);
          this.props.updateFullOrder( { paid: this.state.chargeBeeComebackDict.id}).then((res) => {
            console.log('updateFullOrder sent back', res)
            if (res.payload.editingWorkList !== 'nothing') {
              this.props.processEditingOrder(res.payload.editingWorkList)
            }
          })
        }
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  //   document.title = 'XSPACE | Shopping Cart'
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log( "componentdidupdate this.props.cartAllOrders", this.props.cartAllOrders )
    if (  this.props.userInfo !== prevProps.userInfo ) {
          this.setState({'userProfile': this.props.userInfo || ''} )
    }
    if (this.props.location.search !== "") {
      console.log("this.props.location.search", this.props.location.search)
    }

    if (this.props.cartAllOrders && (this.props.cartAllOrders.status === "PAID" || this.props.cartAllOrders.status === "BAD")){
      console.log("this.props.cartAllOrders.status", this.props.cartAllOrders.status)
      this.props.getFullOrder()
    } else
    {
      if (this.props.cartAllOrders && this.props.cartAllOrders !== prevProps.cartAllOrders) {
        this.updateCart()
        this.setState({isLoaded: true})
      }
    }
  }

  updateCart() {
    console.log("cartAllOrders", this.props.cartAllOrders)

    if (this.props.cartAllOrders.status === "Empty") {
      this.setState({ noRecord: true,
                           tableRows: [],
                           Subtotal: this.state.zeroTotal,
                           deleteSelected: false})

      console.log('cart is empty', this.props.cartAllOrders)
    } else if (this.props.cartAllOrders.result) {
      this.setState({
        noRecord: false,
        deleteSelected: true,
      })
      console.log('this.props.cartAllOrders', this.props.cartAllOrders)
      const cart = this.props.cartAllOrders.result

      this.setState({chargeBeeCheckoutURL: cart.checkoutURL})

      console.log('cart.editing.combined', cart.editing.combined)
      if (typeof(cart.editing.combined) !== "undefined") {
        // get the amount of stuff that we can charge for at this time, since we use providers for the capture services,
        // we exclude them from the subtotal
        this.setState({Subtotal: "$ " + (cart.editing.combined.invoice_estimate.amount_due / 100).toFixed(2)})
      } else {
        this.setState({
          Subtotal: this.state.zeroTotal,
        })
      }
      console.log("cart checkoutURL", cart.checkoutURL)


      const tableRows = []
      let i = 0
      let j = 0
      let orderTypeList = []
      let uniqueProductList = []
      // iterate through both types of orders and put them in the same table
      console.log('cart.editing', cart.editing)
      console.log('cart.capture', cart.capture)
      if (cart.editing) {
        if (cart.editing.combined) {
          if (cart.editing.combined.invoice_estimate) {
            if (cart.editing.combined.invoice_estimate.amount_due) {
              if (cart.editing.combined.invoice_estimate.amount_due > 0) {
                this.setState({editingIncluded: true})
              } else {
                this.setState({editingIncluded: false})
              }
            }
          }
        }
      }
      for (let ordertype of [cart.editing, cart.capture]) {
        for (let order in ordertype) {
          console.log('order', order, 'ordertype', ordertype)
          if (order !== 'combined') {
            i++;
            console.log("order count", i, order)

            const estimate = ordertype[order].invoice_estimate
            if (new Set(orderTypeList).has(estimate.line_items[0].entity_id)) {
              console.log('service already exists')
            } else {
              console.log('service doesnt already exist')
              orderTypeList.push(estimate.line_items[0].entity_id)
            }
            const fileList = ordertype[order].fileList

            console.log("fileList", fileList)

            const productFileList = fileList.reduce((b, x) => {
              if (new Set(uniqueProductList).has(x[0])) {
                console.log('product already exists in list')
              } else {
                uniqueProductList.push(x[0])
              }
              if (!(x[2] in b[1])) {
                b[1][x[2]] = [x[0]];
                b = [b[0] + x[2] + "\n" + "   " + x[0] + "\n", b[1]];
              } else {
                b[1][x[2]] = b[1][x[2]].concat([x[0]]);
                b = [b[0] + "   " + x[0] + "\n", b[1]];
              }
              return b;
            }, ['', {}])[0].slice(0, -1);

            console.log("productFileList", productFileList);

            const row =
                {
                  select: <MDBInput containerClass="form-check checkbox-red"
                                    key={i.toString()}
                                    label=" "
                                    type="checkbox"
                                    id={i.toString()}
                                    checked={false}
                                    onChange={this.handleClick}/>,

                  service: estimate.line_items[0].entity_id,
                  description: estimate.line_items[0].description,
                  products: <pre className="indAmounts">{productFileList}</pre>,
                  price: "$" + (estimate.amount_due / 100).toFixed(2),
                  orderID: <div style={{display: "none"}} id={order}/>
                }
            if (j === 1) {
              row.price = <pre>{'Awaiting Provider Contact\nInitial Estimate:\n' + row.price}</pre>
            }
            tableRows.push(row)
          }
        }
        j++
      }
      console.log("tableRows", tableRows)

      let ccc = this.state.captureIncluded
      try{
        if (cart.capture.combined) {
          ccc = !!cart.capture.combined
        }
      } catch (e) {
        console.log('caught combined error')
      }

      this.setState({
        tableRows: tableRows,
        totalProducts: uniqueProductList.length,
        captureIncluded: ccc,
        totalServices: orderTypeList.length
      })
    }
  }

  handleProceedToCheckout(e) {
    console.log('handleProceedtocheckoutfired with', e.target, e.target.id, e.type)
    // remove the capture items from the cart
    if (this.state.captureCheckoutToggle === false) {
      let deleteList = new Set(this.state.forDelete)
      for (let i=0; i < this.state.tableRows.length; i++) {
        if (this.state.tableRows[i].service === "360-photo-pack") {
          console.log('wanting to checkout:', this.state.tableRows[i])
          let eid = i+1
          deleteList.add(eid.toString())
        }
      }
      this.setState({forCheckout: deleteList})
    } else if(this.state.captureCheckoutToggle === true) {
      this.setState({isLoaded: false})
      this.checkoutPhotography()
    }
    this.setState({captureCheckoutToggle: !this.state.captureCheckoutToggle})
  }

  handleClick(e) {
    // console.log('handleclick', e);
    const eid = e.target.id
    const echecked = e.target.checked
    console.log('handleclick', eid, echecked)
    if (echecked) {
      this.setState(({ forDelete }) => ({
        forDelete: new Set(forDelete).add(eid)
      }))
    } else {
      this.setState(({forDelete}) => {
        const newset = new Set(forDelete);
        newset.delete(eid);

        return {forDelete: newset};
      });
    }
    let newTable = this.state.tableRows.slice(0);
    console.log("handleClick newTable", newTable);
    console.log("handleClick newTable", newTable[eid*1-1].select.props.checked, eid*1-1, echecked);
    newTable[eid*1-1].select = <MDBInput containerClass="form-check checkbox-red"
                                         key={newTable[eid*1-1].select.key}
                                         label=" "
                                         type="checkbox"
                                         id={newTable[eid*1-1].select.key}
                                         checked={echecked}
                                         onChange={this.handleClick}/>

    console.log("handleClick newTable", newTable[eid*1-1].select.props, eid*1-1, echecked);
    this.setState( { tableRows: newTable} );
  }

  checkoutPhotography() {
    console.log()
    if (this.state.forCheckout.size > 0) {
      const newTable = this.state.tableRows
          .map((entry) => [entry.select.props.id.toString(), entry.orderID.props.id])
          .filter(entry => this.state.forCheckout.has(entry[0]))
          .map(entry => entry[1]);

      console.log('delete selected newTable', newTable);

      const payload = {
        "Complete": true,
        "orderIDs": newTable
      }

      this.props.updateFullOrder(payload);
      this.setState( { isLoaded: false, deleteSpinner: true});
      this.props.getFullOrder()
    }
  }

  deleteSelected() {
    if (this.state.forDelete.size > 0) {
      const newTable = this.state.tableRows
          .map((entry) => [entry.select.props.id.toString(), entry.orderID.props.id])
          .filter(entry => this.state.forDelete.has(entry[0]))
          .map(entry => entry[1]);

      console.log('delete selected newTable', newTable);

      const payload = {
        "isActive": false,
        "orderIDs": newTable
      }

      this.props.updateFullOrder(payload);
      this.setState( { isLoaded: false, deleteSpinner: true});
    }
  }

  get_userdetail() {
    fetch(API_ROOT + '/api/user_email/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.accessToken,
      },
      body:JSON.stringify({
        'userId':this.user_id,
        'type':'get'
      })

    }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        try {
          this.setState({
            username: response['username'],
          });
        } catch (err) { }
      });
  }

  clearMessage(){
    this.setState({
        noRecord: false
    });
  }

  render() {

    const { userProfile, tableRows } = this.state
    let cartView
    const data = { columns: this.tableRowLabels, rows: tableRows}

    if (this.state.isLoaded === false) {
      // show the loading icon because we are not loaded
      cartView = <div style={ {paddingTop: this.state.deleteSpinner ? '0%': '20%'}}>
        <Loader loaded={this.state.isLoaded} lines={13} length={20} width={10} radius={30}
                corners={1} rotate={0} direction={1} color="#6FCF97" speed={1}
                trail={60} shadow={false} hwaccel={false} className="spinner"
                top="50%" left="50%" scale={0.70}
                loadedClassName="loadedContent" />
      </div>
    } else {
      if (this.state.tableRows.length === 0) {
        // we are loaded, but there is nothing in the cart, so show a helpful hint
        cartView =
              <div className="row" style={{width:1030, height:105,}}>
                {/*<div className="alert-wizard" style={{position: 'absolute', marginLeft: -82, marginTop: 37, background: '#EB5757', width: 1085 }}>*/}
                <div className="alert-wizard" style={{position: 'relative', margin: 'auto', background: '#bdb5b5', width: '50%' }}>
                  <p className="alert-wizard-text" style={{width: '55%', textAlign: 'center'}}>Your Shopping Cart is Empty! Visit 'My Orders' to view past orders, or to your product library to order capture and editing services for your products.
                    <i className="fa fa-times" aria-hidden="true" style={{position: 'absolute', marginTop: 12, right: 10}} onClick={this.clearMessage}/>
                  </p>
                </div>
              </div>
      } else {
        // we are loaded, and there is stuff in the cart, so show it
        cartView = <div/>
      }
    }

    let captureOnlyModal = (
        <StyledCheckoutModal isOpen={this.state.captureCheckoutToggle} toggle={this.handleProceedToCheckout} centered>
          <MDBModalHeader style={{borderRadius: '15px 15px 0px 0px',  display: 'flex', flexDirection: 'row', justifyContent:'space-between', width: '100%'}}>
            <p style={{order: 0, fontSize: 24, fontWeight: 600, color: '#ffffff', marginBottom:0}}>Order Successfully Submitted!</p>
            <button onClick={this.handleProceedToCheckout} style={{order: 1, fontSize: 18, fontWeight: 500, color: 'rgb(90,90,90)'}}>Close</button>
          </MDBModalHeader>
          <MDBModalBody>
            <CaptureOnlyCheckout/>
          </MDBModalBody>
        </StyledCheckoutModal>
    )

    return (
        <div className="container">
        {captureOnlyModal}
        <CartView>
          <LeftPanel id="mainPanel">
            <CartHeader>
              {/*<i className="fa fa-inbox"></i>*/}
              <ShopCart>
                  {/*<div class="cart_bk">*/}
                  <svg className="Path_963" viewBox="6 26 9.573 9.573">
                    <path fill="rgba(135,135,135,1)" id="Path_963"
                          d="M 15.57321834564209 30.78660583496094 C 15.57321834564209 33.4304084777832 13.43041229248047 35.57321929931641 10.78660869598389 35.57321929931641 C 8.142807006835938 35.57321929931641 5.999999523162842 33.4304084777832 5.999999523162842 30.78660583496094 C 5.999999523162842 28.14280128479004 8.142806053161621 25.99999618530273 10.78660869598389 25.99999618530273 C 13.43041229248047 25.99999618530273 15.57321834564209 28.14280128479004 15.57321834564209 30.78660583496094 Z">
                    </path>
                  </svg>
                  <svg className="Path_964" viewBox="26 26 9.573 9.573">
                    <path fill="rgba(135,135,135,1)" id="Path_964"
                          d="M 35.57321929931641 30.78660583496094 C 35.57321929931641 33.4304084777832 33.4304084777832 35.57321929931641 30.78660583496094 35.57321929931641 C 28.14280128479004 35.57321929931641 25.99999618530273 33.4304084777832 25.99999618530273 30.78660583496094 C 25.99999618530273 28.14280128479004 28.14280128479004 25.99999618530273 30.78660583496094 25.99999618530273 C 33.4304084777832 25.99999618530273 35.57321929931641 28.14280128479004 35.57321929931641 30.78660583496094 Z">
                    </path>
                  </svg>
                  <svg className="Path_965" viewBox="0 2 51.057 35.102">
                    <path fill="rgba(135,135,135,1)" id="Path_965"
                          d="M 51.05716705322266 24.33751106262207 L 51.05716705322266 5.191072463989258 L 12.76429176330566 5.191072463989258 C 12.76429176330566 3.42800498008728 11.33628749847412 2 9.57321834564209 2 L 0 2 L 0 5.191072463989258 L 6.382145881652832 5.191072463989258 L 8.778641700744629 25.73679351806641 C 7.318725109100342 26.90632438659668 6.382145881652832 28.70289611816406 6.382145881652832 30.71965408325195 C 6.382145881652832 34.24419403076172 9.239751815795898 37.1017951965332 12.76429176330566 37.1017951965332 L 51.05716705322266 37.1017951965332 L 51.05716705322266 33.91072463989258 L 12.76429176330566 33.91072463989258 C 11.00122356414795 33.91072463989258 9.57321834564209 32.48271942138672 9.57321834564209 30.71965408325195 C 9.57321834564209 30.70848655700684 9.57321834564209 30.69731903076172 9.57321834564209 30.687744140625 L 51.05716705322266 24.3375072479248 Z">
                    </path>
                  </svg>
                  {/*</div>*/}
              </ShopCart>
              <span style={{paddingBottom: "15px", fontSize: "24px"}}>Order Checkout</span>
              {/*</button>*/}
            </CartHeader >
            <div>
              <StyledTable>
                <MDBDataTable
                    responsive
                    striped={false}
                    maxHeight="460px"
                    searching={false}
                    scrollY
                    scrollX
                    paging={false}
                    data={data}/>
              </StyledTable>
            </div>
            {cartView}

            {/*<DeleteButton onClick={this.deleteSelected}>Delete Selected</DeleteButton>*/}
            <div className="row mt-3 justify-content-between">
              <DeleteButton  style={{ opacity: this.state.deleteSelected ? 100:0 }} onClick={this.deleteSelected}>Delete Selected</DeleteButton>
              <SubTotal><SubTitle>Subtotal:</SubTitle>{this.state.Subtotal}</SubTotal>
              {/*<SubTitle style={{display: "flex-end"}}>Subtotal:</SubTitle>*/}
            </div>
          </LeftPanel>
          <RightPanel>
            <ShoppingRightSideMenu active={1}
                                   company={this.state.companyName}
                                   profileURL={userProfile.profileURL}
                                   profilePic={this.state.profilePic}
                                   fullName={userProfile.fullName}
                                   subTotal={this.state.Subtotal}
                                   checkoutURL={this.state.chargeBeeCheckoutURL}
                                   captureIncluded={this.state.captureIncluded}
                                   totalProducts={this.state.totalProducts}
                                   totalServices={this.state.totalServices}
                                   handleProceedToCheckout={this.handleProceedToCheckout}
                                   editingIncluded={this.state.editingIncluded}
            />
          </RightPanel>
        </CartView>
      </div>
    );
  }
}
