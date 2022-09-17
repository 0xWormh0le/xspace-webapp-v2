import React, { Component } from 'react'
import ProductThumbnailCard from "./productlibrary/productThumbnailCard";
import ProductThumbnailLibrary from "./productlibrary/productThumbnailLibrary";
import styled from 'styled-components'
import Svg, { Defs, G, Rect, Path } from "react-native-svg";
import Tooltip from 'react-tooltip-lite'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import { faTrashAlt } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PageLink,
  PageItem,
  Alert,
  Button,
  Jumbotron,
  Form,
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarToggler,
  Collapse,
  NavItem,
  NavLink,
  Pagination,
  MDBModalHeader, MDBModalBody, MDBModal, MDBModalFooter
} from 'mdbreact'
import UserEmailEditFormView from './UserEmailEditFormView';
import UserNameEditFormView from './UserNameEditFormView';
import UserPasswordEditFormView from './UserPasswordEditFormView';
import TwoFactorAuthEditFormView from './TwoFactorAuthEditFormView';
import TimeZoneEditFormView from './TimeZoneEditFormView';
import LanguageEditFormView from './LanguageEditFormView';
import ManageLeftSideMenu from './menu/ManageLeftSideMenu';
import RunAuditView from "./audit/auditModal";
import TextInput from '../lib/TextInput'
import './managepage.css';
import ProductLibraryTopbar from './menu/ProductLibraryTopbar'
import { MDBTable, MDBTableBody, MDBTableHead, MDBDataTable, MDBBtn, MDBInput  } from 'mdbreact';
import $ from 'jquery';
import { truncateChar } from '../util/RegexTest'
import { API_ROOT } from '../index';
import axios from 'axios';
import * as qs from 'query-string';
import { Input, Label, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import ReactQuill from 'react-quill'
import Loader from 'react-loader';
import {StyledTable} from '../lib/styled-table'
import Moment from 'react-moment';
import 'moment-timezone';

import 'react-table/react-table.css'
import './DataTables/css/jquery.dataTables.min.css';
import './DataTables/css/bootstrap_3.3.6.css';
//import './DataTables/js/bootstrap.min.js';
import { Wrapper } from '../lib/wrapper'

import ContentStandard from "./orderwizard/ContentStandard";
import ProductCreateView from "./ProductCreateView";
import OrderEditSelectedView from "./OrderEditSelectedView";
import OrderCaptureSelectedView from "./OrderCaptureSelectedView";
import MediaUploadView from "./MediaUploadView";
import ShoppingRightSideMenu from "./menu/ShoppingRightSideMenu";


export const ProductView = styled.div`
  display: flex;
  width: 1300px;
  
`

export const LeftPanel = styled(Wrapper)`
  margin-right: 30px;
  // max-width: 263px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  min-height: 700px;
`

const RightPanel = styled(Wrapper)`
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
  
  table.dataTable thead {
        div {
            width: 0px;
            height: 0px;
            // top: 20px;
            bottom: 5px;
            margin: -1px;
            padding: 0px;
            // padding-right: 0px;
            // padding-left: 0px;
        }
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
        overflow-y: auto;
        overflow-x: auto;        
        max-height: 550px;
        // display: none;
  }
  
  // table.table.btn-table td {
  //   max-width: 200px;
  //   white-space: nowrap;
  //   text-overflow: ellipsis;
  //   overflow: hidden;
  // }
`

const Products = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 25px;
  border-bottom: 2px solid #F4F5FA;
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
  // DashCam {
  //   .camera {
  //       overflow: visible;
  //       // width: 78.474px;
  //       width: 35px;
  //       // height: 62.779px;
  //       // left: 279.806px;
  //       // width: 78.474px;
  //       // height: 62.779px;
  //       // left: 279.806px;
  //       // top: 58.125px;
  //       // top: 0px;
  //       transform: matrix(1,0,0,1,0,0);
  //   }
  }
  
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

const StyledModal = styled(MDBModal)`
  min-width: 848px;
  .modal-content {
    border-radius: 10px;
  }
  .modal-header {
    border-bottom: 2px solid #F4F5FA;
    .modal-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 90%;
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

const StyledContentStandardModal = styled(StyledModal)`
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
const StyledProductModal = styled(StyledModal)`
  // .modal-header {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   .modal-title {
  //     font-size: 18px;
  //     button {
  //       right: 16px;
  //       position: absolute;
  //       top: 16px;
  //       border: 2px solid #F4F5FA;
  //       font-weight: bold;
  //       border-radius: 15px;
  //       padding: 0 10px;
  //       :hover {
  //         background-color: #00A3FF;
  //         color: white;
  //         border: none;
  //       }
  //     }
  //   }
  //
  // }
  .modal-content {
    max-width: 1200px;
    margin: auto;
    border-radius: 20px;
    // .flex-container-row {
    //   display: flex;
    //   justify-content: space-evenly;
    //   align-items: center;
    // }
    .modal-body {
      width: 100%;
      padding: 0;
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

const StyledEditSelectedModal = styled(StyledModal)`
  .modal-content {
    max-width: 1200px;
    margin: auto;
    border-radius: 20px;
    // .flex-container-row {
    //   display: flex;
    //   justify-content: space-evenly;
    //   align-items: center;
    // }
    .modal-body {
      width: 100%;
      padding: 0;
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
const StyledCaptureSelectedModal = styled(StyledModal)`
  .modal-content {
    max-width: 1200px;
    margin: auto;
    border-radius: 20px;
    // .flex-container-row {
    //   display: flex;
    //   justify-content: space-evenly;
    //   align-items: center;
    // }
    .modal-body {
      width: 100%;
      padding: 0;
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

const StyledMediaUploadModal = styled(StyledModal)`
  .modal-content {
    max-width: 1200px;
    margin: auto;
    border-radius: 20px;
    // .flex-container-row {
    //   display: flex;
    //   justify-content: space-evenly;
    //   align-items: center;
    // }
    .modal-body {
      width: 100%;
      padding: 0;
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

const StyledRunAuditModal = styled(StyledModal)`
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

const DashCam = styled.div`
  .camera {
        overflow: visible;
        // width: 78.474px;
        width: 35px;
        // height: 62.779px;
        // left: 279.806px;
        // width: 78.474px;
        // height: 62.779px;
        // left: 279.806px;
        // top: 58.125px;
        // top: 0px;
        transform: matrix(1,0,0,1,0,0);
  }
`

 // const buttonleft = styled.button`
 //    background-color: #707070;
 //    color: white;
 //    // display: block;
 //    height: 50px;
 //    // left: 370px;
 //    // /* line-height: 40px; */
 //    // /* text-decoration: none; */
 //    width: 100px;
 //    // /* text-align: center; */
 //    border-top-left-radius: 25% 50%;
 //    border-bottom-left-radius: 25% 50%;
 //
 //    svg {
 //      width: 40px;
 //      height: 40px;
 //    }
 //

    // viewbutton {
    //
    // position: absolute;
    // width: 51.057px;
    // height: 47.866px;
    // left: 370px;
    // top: 0px;
    // overflow: visible;
    // // transform: translateX(-50%);
    //
    //
    //   .Rectangle_16 {
    //       overflow: visible;
    //       position: absolute;
    //       width: 50px;
    //       // height: 9.573px;
    //       left: 0px;
    //       top: 35px;
    //       // transform: matrix(1,0,0,1,0,0);
    //   }
    //   .Rectangle_17 {
    //       overflow: visible;
    //       position: absolute;
    //       width: 50px;
    //       // height: 9.573px;
    //       left: 50px;
    //       top: 35px;
    //       // transform: matrix(1,0,0,1,0,0);
    //   }
    //   .list {
    //       overflow: visible;
    //       position: absolute;
    //       width: 25px;
    //       height: 14px;
    //       left: 12px;
    //       top: 40px;
    //       // transform: matrix(1,0,0,1,0,0);
    //   }
    //   .picture {
    //       overflow: visible;
    //       position: absolute;
    //       width: 25px;
    //       height: 14px;
    //       left: 65px;
    //       top: 40px;
    //       // transform: matrix(1,0,0,1,0,0);
    //   }
    // }


// const Table = styled(MDBDataTable)`
//   tr {
//     th, td {
//       font-size: 12px;
//       color: #333330;
//       line-height: 20px;
//       padding: 6px 3px !important;
//       font-weight: 400;
//       .checkmark {
//         top: 7px;
//         left: -16px;
//         height: 12px;
//         width: 12px;
//         border: 1px solid #3D3D3D;
//         border-radius: 3px;
//         background-color: transparent;
//       }
//     }
//   }
//   thead {
//     tr {
//       th {
//         font-weight: bold;
//         padding-left: 0;
//         i {
//           display: none;
//         }
//       }
//     }
//   }
//   thead:last-child {
//     display: none;
//   }  
// `

export default class ProductManager extends Component {
    _isMounted = false;
  constructor(props, context) {
    super(props, context);

    this.state = {
      xAxisTableStart: null,
      products: '',
      productimg: [],
      isSuccess: false,
      imgUrl: 'https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png',//'https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/1ff1/a35c/132c31448f51c4c3dce187d2c5362935',
      pagenumber: 1,
      pagecount: 0,
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
      mediaUploadModal: false,
      orderEditModal: false,
      runAuditModal: false,
      thumbnailView: false,
      orderCaptureModal: false,
      userProfile: [],
      profilePic: '/icons8-customer-128.png',
      editurl: null,
      deletePermission: false,
      successfullyDeleted: 0,
    };


    // this.handleClick = this.handleClick.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.changeRadioButton = this.changeRadioButton.bind(this);
    this.truncate = this.truncate.bind(this);
    this.checkAll =  this.checkAll.bind(this);
    this.createData = this.createData.bind(this);
    this.handleTableRowClick = this.handleTableRowClick.bind(this)
    this.handleClick = this.handleClick.bind(this);

    //this.getImage = this.getImage.bind(this);
    this.userData = JSON.parse(localStorage.getItem('persist:root'));
    const data = JSON.parse(this.userData['auth']);
    this.assembleProducts = this.assembleProducts.bind(this);
    this.user_id = this.props.userId;//data['access']['user_id'];
    this.flag = 0;
    this.row = '';
    this.scripttag = '';

    this.rowcount = 15;
    localStorage.removeItem('pageNum');
    // this.get_userdetail();

    //this.get_products();

    this.contentStandardToggle = this.contentStandardToggle.bind(this);
    this.productCreateToggle = this.productCreateToggle.bind(this);
    this.orderEditToggle = this.orderEditToggle.bind(this);
    this.orderCaptureToggle = this.orderCaptureToggle.bind(this);
    this.mediaUploadToggle = this.mediaUploadToggle.bind(this);
    this.runAuditToggle = this.runAuditToggle.bind(this);
    this.submitFullOrder = this.submitFullOrder.bind(this);
    this.deleteDialog = this.deleteDialog.bind(this);
    this.bulkOperation = this.bulkOperation.bind(this);
    this.runAudit = this.runAudit.bind(this);
    this.parseSelected = this.parseSelected.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    // console.log('COMPANY', this.state.companyName)
    /*Get All Product Data*/
    this.getAllProducts()
    // d.classList.add("fadeIn");
    this.setState({'userProfile':this.props.userInfo || '' })
    this.props.loadProfileData()
  }
  componentWillUnmount() {
    this._isMounted = false;
    document.title = 'XSPACE | Product Management'

  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (this.props.contentStandard != prevProps.contentStandard) {
  //     this.props.getContentStandard();
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    if( nextProps.userInfo) {
      this.setState({'userProfile': nextProps.userInfo || ''})
    }
    if (nextProps.cart && typeof nextProps.cart.chargebeeURL !== "undefined") {
      // this code will add a new tab
      this.setState( {editurl: nextProps.cart.chargebeeURL});
      // this.props.editurl =  nextProps.editurl;
    }
  }

  deleteDialog(event) {
    if (event.target.id === 'no') {
      this.setState({
        deletePermission: !this.state.deletePermission,
        message: ''
      })
    } else {
      this.setState({
        deletePermission: !this.state.deletePermission,
        message: 'Do you really want to delete these products?'
      })
    }
  }

  bulkOperation(event) {
    if (event.target.id === 'deleteOption') {
      let checkedList = []
      // get the checked objects
      for (let i = 0; i < this.state.tableRows.length; i++) {
        let product = this.state.tableRows[i]
        if (product.ischecked.props.checked) {
          // get the corresponding full product info
          for (let j = 0; j < this.state.productData.length; j++) {
            let productdata = this.state.productData[j]
            if (product.productname.valueOf() === productdata.name.valueOf()) {
              if (product.xspaceid.valueOf() === productdata.slug.valueOf())
                checkedList.push({'tableRowsInfo': product, 'uniqueID': productdata.uniqueID})
            }
          }
        }
      }
      // got the checkedList, let's make sure they actually checked products
      if (checkedList.length <= 0) {
        this.setState({message: 'No File Selected for operation.'});
        return false;
      } else {
        this.setState({message: ''});
        this.setState({deletePermission: !this.state.deletePermission});

        // set up api call
        let apiUrl = API_ROOT + '/api/xspace-products/'
        const config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'authorization': 'Bearer ' + this.props.accessToken
          },
        }

        // let's start sending stuff back to the backend to get deleted
        this.state.successfullyDeleted = 0
        for (let i = 0; i < checkedList.length; i++) {
          console.log('checkList', checkedList)
          // we now have the info to send back to the delete function

          axios({
            method: 'delete',
            url: apiUrl,
            data: {
              "userid": this.user_id,
              "data": checkedList[i]
            },
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'authorization': 'Bearer ' + this.props.accessToken
            }
          }).then((response) => {
                console.log('response', response)
                if (response.status.valueOf() === 200) {
                  console.log('successful delete')
                  this.state.successfullyDeleted += 1
                  // instead of reloading all of the product data from the backend, let's just remove it from out list
                  for (let j = 0; j < this.state.tableRows.length; j++) {
                    console.log('comparing', this.state.tableRows[j].createddate.valueOf(),
                        checkedList[i].tableRowsInfo.createddate.valueOf())
                    if (this.state.tableRows[j].createddate.valueOf() === checkedList[i].tableRowsInfo.createddate.valueOf()) {
                      console.log('found match')
                      const updatedTableRows = this.state.tableRows.filter(el => el.createddate.valueOf() !== this.state.tableRows[j].createddate.valueOf())
                      this.setState({'tableRows': updatedTableRows})
                    }
                  }
                } else {
                  console.log('did not delete')
                }
              }
          ).then(() => console.log('finished deleting', this.state.successfullyDeleted, 'out of', checkedList.length))
        }
      }
    }
    }

  submitFullOrder(payload) {
    console.log('submitting editing order as:', payload)
    this.props.saveFullOrder(payload)
    return this.props.cart
  }

  contentStandardToggle = () => {
    this.setState({
      contentStandardModal: !this.state.contentStandardModal
    });
  }

  productCreateToggle = (num) => {
    // console.log('productCreatetoggle11', num);
    if (num === 0) {
      this.getAllProducts();
    } else {
      this.setState({productCreateModal: !this.state.productCreateModal});
    }
  }

  orderEditToggle = () => {
    this.setState( {orderEditModal: !this.state.orderEditModal});
  }

  orderCaptureToggle = () => {
    this.setState( {orderCaptureModal: !this.state.orderCaptureModal });
  }

  parseSelected = async(plist) => {
    return plist.filter(product => product.ischecked.props.checked)
  }

  runAuditToggle = () => {
    this.setState( {runAuditModal: !this.state.runAuditModal });
  }

  runAudit = (contentStandards) => {
    this.setState({runAuditModal: false})
    if (this.state.isCheckAll === true) {

    } else {
      this.parseSelected(this.state.tableRows).then(data => {
        this.props.runAudit({'products': data, 'Content Standard': contentStandards})
      })
    }
  }

  mediaUploadToggle = () => {
    this.setState( {mediaUploadModal: !this.state.mediaUploadModal});
  }

  // get_products() {
  // if (this._isMounted) {
  //   fetch(API_ROOT + '/api/products_list/' + this.rowcount + '/' + this.state.pagenumber + '/', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       "userid": this.user_id
  //     })
  //   }).then(res => res.json())
  //     .catch(error => console.error('Error:', error))
  //     .then(response => {
  //       try {
  //         //console.log(response[response.length-1]['pagecount']);
  //         this.setState({ pagecount: response[response.length - 1]['pagecount'] });
  //         response.pop();
  //         this.setState({
  //           products: response,
  //           isSuccess: true
  //         });
  //       } catch (err) { }
  //       }
  //
  //     )};
  // }

  handleInputChange = (event) => {
      const target = event.target,
          value = target.type ===
          'checkbox' ? target.checked : target.value,
        name = target.name
      this.setState({
          [name]: value
      });
  }

  checkAll = (event) => {

    // console.log('all', event.target.checked);
    // console.log(this.state.tableRows);
    // console.log("statecheckall", this.state.isCheckAll);
    this.setState( {isCheckAll : event.target.checked}, function () {
      // console.log(this.state);
      // console.log("state ischeckall", this.state.isCheckAll);
      // console.log('here');
      const newrows = this.state.tableRows.map( (obj, index) => {
        obj['ischecked'] = <MDBInput key={obj.ischecked.key} label=" " type="checkbox" id={obj.ischecked.props.id} checked={this.state.isCheckAll}
                                     onChange={this.handleClick}/>;
        return obj;
      });

      this.setState( {tableRows: newrows}, () => {console.log(this.state.tableRows);});
    } );
    // let newrows = this.state.tableRows.map( (obj, index) => {
    //   obj['ischecked'] = <MDBInput label=" " type="checkbox" id={"checkbox" + index} onChange={this.handleClick}/>;
    //   return obj;
    // });
    //
    // this.setState( {tableRows: newrows}, () => {console.log(this.state.tableRows);});

  }

  handleClick(event) {
    // console.log('clicked');
    // console.log('c',event.type, event.target);
    // console.log('checked', event.target.checked);
    // console.log('ischeckall', this.state.isCheckAll);
    // event.target.checked = !event.target.checked;
    // console.log('checked', event.target.checked);
    // console.log('target id', event.target.id*1);
    // this.state.tableRows[event.target.id*1]['ischecked'] = <MDBInput label=" " type="checkbox" id={index.toString()} checked={event.target.checked} onChange={this.handleClick} />;
    // console.log('checkprops', this.state.tableRows[event.target.id*1]['ischecked'].props.checked);

    const newrows = this.state.tableRows.slice(0)
    // console.log(event.target.id*1)
    // console.log(newrows.findIndex( p => p.ischecked.props.id === event.target.id ))
    // this.state.tableRows[event.target.id*1]['ischecked'].props.checked = event.target.checked;
    // newrows[event.target.id*1]['ischecked'] = <MDBInput label=" " type="checkbox" id={event.target.id} checked={event.target.checked} onChange={this.handleClick} />
    const rowindex = newrows.findIndex( p => p.ischecked.props.id === event.target.id );
    newrows[rowindex]['ischecked'] = <MDBInput key={newrows[rowindex].ischecked.key} label=" " type="checkbox" id={newrows[rowindex].ischecked.props.id} checked={event.target.checked} onChange={this.handleClick} />
    // console.log('newrows', newrows);
    this.setState( { tableRows: newrows}, () => {console.log(this.state.tableRows);});

  }

  handleTableRowClick(event, slug) {
    // this is the function that controls the safety box around the check marks on the left side of the product list
    // table
    if (event.pageX > (this.state.xAxisTableStart + 50)) {
      console.log('handleTableRowClick fired and is wanting to redirect to:', "/#/product/"+slug+"/")
      window.location.assign("/#/product/"+slug+"/")
    } else {
      console.log('handleTableRowClick did not fire')
    }
  }

  // previousPage = () => {
  //   this.state.pageCount = this.state.pageCount-1
  //   if(this.state.pageCount != 0){
  //     this.getAllProducts()
  //   }else{
  //     this.state.pageCount = this.state.pageCount+1
  //   }
  // }

  // nextPage = () => {
  //   this.state.isLoaded = false
  //   this.state.pageCount = this.state.pageCount+1
  //   this.getAllProducts()
  // }

  // sortProduct(evt) {
  //   this.state.isLoaded = false
  //   this.setState({
  //     'sort': evt.target.value
  //   });
  //   this.getAllProducts(evt.target.value, true)
  // }

  truncate(charString, productName) {

    if(productName){
      return charString.length>=10 ? charString.substring(0, 10)+"...": charString
    }else{
      return charString.length>=6 ? charString.substring(0, 8)+"...": charString
    }
  }

  // returnProducts = () => {
  //   let products = []
  //   let keys = Object.keys(this.state.selectedProductList)
  //   keys.map((key) => {
  //     products.push(this.state.selectedProductList[key])
  //   })
  //   return this.props.returnProducts(products)
  // }

  assembleProducts = (productData) => {
    console.log('assembling', productData);
    let defaultValue = "No Content Standard Applied To This Product"
    let productsRow =productData.map((product, index) => {
      if (defaultValue.valueOf() === `${product.compliance_message}`.valueOf()) {
        product.compliance = true
      }
      return (
        {
          // ischecked: <MDBInput className="tabchek" label=" " type="checkbox" id={"checkbox"+index} style={{width:10, height:10}}/>,
          ischecked: <MDBInput label=" " type="checkbox" id={index.toString()} checked={this.state.isCheckAll} onChange={this.handleClick} />,
          // ischecked: <i className="fa fa-check-square-o fa-2x" aria-hidden="true"/>,
          // ischecked: <input type="checkbox" />,
          productname: product.name,
          // productname: <MDBInput label={product.name} type="checkbox" id={"checkbox"+index} />,
          xspaceid: product.slug,
          upc: product.upccode,
          sku: product.SKU,
          createddate: <Moment fromNow>{product.createdDate}</Moment>,
          // edit: <a href={"/#/product/"+product.slug+"/"}><i className="fa fa-pencil pr-2" aria-hidden="true"/></a>,
          compliance: {'compliance': product.compliance, 'compliance_message': product.compliance_message},
          clickEvent: (e) => this.handleTableRowClick(e, product.slug),
          conditionalRowBackgroundColor: product.compliance ? {'resultOfcondition': true, 'color':'#ffffff'} : {'resultOfcondition': false, 'color':'rgba(255,153,148,0.34)'}
        }
      )
    });
    // this.setState( {prodRow: productsRow})
    // return this.state.prodRow;
    return productsRow;
  }

  /*get product data */
  getAllProducts = () => {
    console.log('GETTING ALL PRODUCTS')
    let apiUrl = API_ROOT + '/api/xspace-products2/?format=datatables'

    let thisScope = this;
    const config = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'authorization': 'Bearer ' + this.props.accessToken
      },
    }

    const body = JSON.stringify({
      "userid": this.user_id,
    });

    // const result1 = axios.post(apiUrl,body,config);

    axios.post(apiUrl, body, config)
        .then(function (response) {
          const newProduct = response.data.data.map((product) => {
            product['is360viewrequired'] = false
            product['is2drequired'] = false
            product['is3dmodelrequired'] = false
            product['isvideorequired'] = false
            product['notes2d'] = ""
            product['notes360view'] = ""
            product['notes3dmodel'] = ""
            product['notesvideo'] = ""
            return product;
          });
          thisScope.setState({
            productData: newProduct,
            isLoaded: true,
            tableRows: thisScope.assembleProducts(newProduct)
          }, () => {
            let rowsData = []
            for (let index = 0; index < thisScope.state.tableRows.length; index++) {
              let rowItem = thisScope.state.tableRows[index]
              // rowItem["compliance"] = thisScope.state.tableRows[index].compliance
              // console.log('compliance', rowItem["compliance"])
              // console.log('compliance_message', rowItem['compliance']['compliance_message'])
              // rowItem['slug'] = <div id={thisScope.state.tableRows[index].slug} style={{display: "none"}} />
              if (!rowItem["compliance"]["compliance"]) {
                // console.log('compliance is false')
                rowItem["compliance"] = <Tooltip content={`${rowItem["compliance"]["compliance_message"]}`}
                                                 direction="right"
                                                 tagName="span"
                                                 background='#333'
                                                 color='white'
                                                 forceDirection><span>Action Required</span></Tooltip>

              } else {
                // console.log('compliance is true')
                if (rowItem["compliance"]["compliance_message"] === 'No Content Standard Applied To This Product') {
                  rowItem["compliance"] = <Tooltip content={`${rowItem["compliance"]["compliance_message"]}`}
                                                   direction="right"
                                                   tagName="span"
                                                   background='#333'
                                                   color='white'
                                                   forceDirection><span>Action Required</span></Tooltip>
                } else {
                  rowItem["compliance"] = <span title={rowItem["compliance"]}>Product is compliant!</span>
                }
              }
              rowsData.push(rowItem)
            }
            thisScope.setState({
              tableRows: rowsData,
            });
          });
        })
        .catch(function (error) {
          console.error('products2 error', error);
        });
  }

  // handleCheckboxChange(event) {
  //   this.setState({isChecked: event.target.checked});
  // }

  // changeCheckbox = (product, event) => {
  //
  //   let arr = this.state.selectedProductList.slice();
  //
  //   if(arr.indexOf(product) >= 0) {
  //     product['isChecked'] = false
  //     arr.splice(arr.indexOf(product), 1);
  //   } else {
  //     product['isChecked'] = true
  //     arr.push(product);
  //   }
  //   this.state.selectedProductList = arr
  //   return this.state.selectedProductList
  // }


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

  // getImage(pid, slug) {
  //   try {
  //     var user = this.state.username;
  //     var product = 'product'
  //     var pid = pid;
  //     var slug = slug;
  //
  //     fetch(API_ROOT + '/api/get_product_thumbnail/', {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body:JSON.stringify({
  //         'location':user,
  //         'product':product,
  //         'pid':pid,
  //         'slug':slug,
  //         'itype':'2D'
  //       })
  //     }).then(res => res.json())
  //       .catch(error => console.error('Error:', error))
  //       .then(productupload => {
  //
  //         //console.log(productupload['success'].length);
  //         if (productupload['success'].length > 4) {
  //           //console.log(productupload['success'][0]['url']);
  //           this.setState({
  //             productimg: { 'id': pid, 'img': productupload['success'] }
  //           });
  //           // state.productimg.push({'id':pid,'img':productupload['success'][0]['url']});
  //           //console.log(this.state.productimg[0]);
  //         }
  //         else {
  //           this.setState({
  //             productimg: { 'id': pid, 'img': this.state.imgUrl }
  //           });
  //           //this.state.productimg.push({'id':pid,'img':this.state.imgUrl});
  //         }
  //
  //       });
  //     //console.log(this.state.productupload);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // displayImg() {
  //   var _ = this;
  //   if (_.state.productimg.length != 0) {
  //     var check = '';
  //     for (var i = 0; i < 5; i++) {
  //       check += _.state.productimg.img[i];
  //     }
  //     if (check == 'https') {
  //       $("#img_" + _.state.productimg.id).attr('src', _.state.productimg.img);
  //     } else {
  //       $("#img_" + _.state.productimg.id).attr('src', 'https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png');
  //     }
  //     //console.log(_.state.productimg.img[i]);
  //
  //     //console.log(this.state.productimg.img);
  //   }
  // }

  // displayrec() {
  //
  //   var mainPanel = document.getElementById("display");
  //   //console.log("check");
  //   try {
  //     if (this.state.products.length > 0) {
  //       this.row = this.state.products.map((data) => {
  //         let validStyle={ padding: '5px 0px', border: '1px solid grey' }
  //         let productId = data.productid
  //         let imgid = "img_" + data.productid
  //         let slug = data.slug
  //         let upcNum = data.upccode
  //         let skuNum = data.SKU
  //         let compliance = data.compliance
  //         if (compliance == []){
  //         let validStyle={ padding: '5px 0px', border: '1px solid grey' }
  //         }
  //         else{
  //         let validStyle={ padding: '5px 0px', border: '1px solid grey',background: '#ff9994' }
  //         }
  //
  //
  //
  //
  //         if (this.flag == 0) {
  //           this.getImage(productId, slug);
  //         }
  //
  //         let link = "/#/product/"+ data.slug
  //
  //         if (upcNum && skuNum) {
  //           return (
  //             <tr key={data.productid} style={validStyle}>
  //               <td>
  //                 <div className="row">
  //                   <div style={{ margin: '0px 0px', paddingLeft: '10px' }}><img id={imgid} style={{ width: '40px', height: '40px' }} /></div>
  //                   <div className="col-md-3 " style={{ textAlign: 'left' }}>
  //                     <div className="prodname-bg"><a href={link} style={{ textDecoration: 'none', }}><p className="prodlink"><u>{data.name}</u></p></a></div>
  //                   </div>
  //                   <div className="col-md-2" style={{ textAlign: 'left', fontWeight: 'bold' }}>
  //                     <div>{data.upccode}</div></div>
  //                   <div className="col-md-2" style={{ textAlign: 'left', fontWeight: 'bold' }}><div>{data.SKU}</div></div>
  //                   <div className="col-md-3" style={{ textAlign: 'left' }}><div className="info-bg"><center><i>{data.category}</i></center></div></div>
  //                 </div>
  //               </td>
  //             </tr>)
  //         }
  //         else if (!skuNum) {
  //           return (
  //             <tr key={data.productid} style={validStyle}>
  //               <td>
  //                 <div className="row">
  //                   <div style={{ margin: '0px 0px', paddingLeft: '10px' }}><img id={imgid} style={{ width: '40px', height: '40px' }} /></div>
  //                   <div className="col-md-3 " style={{ textAlign: 'left' }}>
  //                     <div className="prodname-bg"><a href={link} style={{ textDecoration: 'none', }}><p className="prodlink"><u>{data.name}</u></p></a></div>
  //                   </div>
  //                   <div className="col-md-2" style={{ textAlign: 'left', fontWeight: 'bold' }}>
  //                     <div>{data.upccode}</div></div>
  //                   <div className="col-md-2" style={{ textAlign: 'left', fontWeight: 'bold' }}><div>-</div></div>
  //                   <div className="col-md-3" style={{ textAlign: 'left' }}><div className="info-bg"><center><i>{data.category}</i></center></div></div>
  //                 </div>
  //               </td>
  //             </tr>)
  //         }
  //         else if (!upcNum) {
  //           return (
  //             <tr key={data.productid} style={validStyle}>
  //               <td>
  //                 <div className="row">
  //                   <div style={{ margin: '0px 0px', paddingLeft: '10px' }}><img id={imgid} style={{ width: '40px', height: '40px' }} /></div>
  //                   <div className="col-md-3 " style={{ textAlign: 'left' }}>
  //                     <div className="prodname-bg"><a href={link} style={{ textDecoration: 'none', }}><p className="prodlink"><u>{data.name}</u></p></a></div>
  //                   </div>
  //                   <div className="col-md-2" style={{ textAlign: 'left', fontWeight: 'bold' }}>
  //                     <div>-</div></div>
  //                   <div className="col-md-2" style={{ textAlign: 'left', fontWeight: 'bold' }}><div>{data.SKU}</div></div>
  //                   <div className="col-md-3" style={{ textAlign: 'left' }}><div className="info-bg"><center><i>{data.category}</i></center></div></div>
  //                 </div>
  //               </td>
  //             </tr>)
  //         }
  //         else {
  //           return (
  //             <tr key={data.productid} style={validStyle}>
  //               <td>
  //                 <div className="row">
  //                   <div style={{ margin: '0px 0px', paddingLeft: '10px' }}><img id={imgid} style={{ width: '40px', height: '40px' }} /></div>
  //                   <div className="col-md-3 " style={{ textAlign: 'left' }}>
  //                     <div className="prodname-bg"><a href={link} style={{ textDecoration: 'none', }}><p className="prodlink"><u>{data.name}</u></p></a></div>
  //                   </div>
  //                   <div className="col-md-2" style={{ textAlign: 'left', fontWeight: 'bold' }}>
  //                     <div>-</div></div>
  //                   <div className="col-md-2" style={{ textAlign: 'left', fontWeight: 'bold' }}><div>-</div></div>
  //                   <div className="col-md-3" style={{ textAlign: 'left' }}><div className="info-bg"><center><i>{data.category}</i></center></div></div>
  //                 </div>
  //               </td>
  //             </tr>)
  //         }
  //
  //       });
  //
  //       this.flag++;
  //       this.tablePaging();
  //     } else { }
  //   } catch (err) {
  //
  //   }
  // }

  clearMessage(){
  this.setState({
      noRecord: false
  });
  }

  // tablePaging = (event) => {
  //   var _ = this;
  //   var table = '#display';
  //   var maxval = document.getElementById('maxRows');
  //
  //   $('.pagination').html('')
  //   var trnum = 0
  //   var maxRows = this.rowcount
  //   var totalRows = this.state.pagecount
  //
  //   if (totalRows > maxRows) {
  //     var pagenum = Math.ceil(totalRows / maxRows)
  //     for (var i = 1; i <= pagenum;) {
  //       $('.pagination').append('<li className="page-item" id="litag' + i + '" data-page="' + i + '">\<a className="page-link page-link">' + (i++) + '<span className="sr-only">(current)</span></a>\</li>').show()
  //     }
  //   }
  //   if (localStorage.getItem('pageNum') == null) {
  //     $('.pagination li:first-child').addClass('active')
  //   }
  //   else {
  //     // $('.pagination li').removeClass('active')
  //     //$(this).addClass('active')
  //     var pgno = localStorage.getItem('pageNum');
  //     var litag = document.getElementById("litag" + pgno)
  //     //console.log(litag)
  //     litag.setAttribute("class", "page-item active")
  //     //_.displayImg()
  //   }
  //
  //   $('.pagination li').on('click', function () {
  //     var pageNum = $(this).attr('data-page')
  //
  //     _.setState({ productimg: [], products: '' })
  //     //console.log(_.state.productimg)
  //
  //     _.setState({ pagenumber: pageNum, isSuccess: false })
  //     //_.get_products()
  //     localStorage.setItem('pageNum', pageNum);
  //     _.flag = 0
  //   })
  // }

  createData() {

    const data = {
      columns: [
        {
          // label: "select",
          // label: <MDBInput className="tabcheck" label="All" type="checkbox" id="checkbox5" style={{width:10, height:10}}/>,
          label: <MDBInput label=" " key="H" type="checkbox" id="checkbox_all" filled onClick={this.checkAll}/>,
          field: 'ischecked',
          sort: 'disabled',
          searchable: false,
          // width: 10,
        },
        {
          label: 'Product Name',
          // label: <MDBInput label="Product Name" type="checkbox" id="checkbox5"/>,
          field: 'productname',
          sort: 'desc'
        },
        {
          label: 'XSPACE ID',
          field: 'slug',
          sort: 'desc'
        },
        {
          label: 'UPC',
          field: 'upc',
          sort: 'desc'
        },
        {
          label: 'SKU',
          field: 'sku',
          sort: 'desc'
        },
        {
          label: 'Date Created',
          field: 'createddate',
          sort: 'desc'
        },

        {
          label: 'Notes',
          field: 'compliance',
          sort: 'desc'
        }
        // {
        //   label: 'Edit',
        //   field: 'edit',
        //   sort: 'asc'
        // },
        // {
        //   label: 'compliance',
        //   field: 'compliance',
        //   sort: 'asc',
        //
        //         getProps: (state, rowInfo) => {
        //           if (rowInfo && rowInfo.row) {
        //             return {
        //               style: {
        //                 background:
        //                   rowInfo.row.compliance !== "" ? "red" : null
        //               }
        //             };
        //           } else {
        //             return {};
        //           }
        //         },
        //
        //       },

      ],
      // rows: this.state.tableRows.map( ({xspaceidfull, ...others}) => others)
      rows: this.state.tableRows,
    }
    return data;
  }

  handleThumbnailView () {
    this.setState({thumbnailView: true})
  }

  handleListView () {
    this.setState({thumbnailView: false})
  }

  handleLibraryView () {
    this.setState(prevState => ({
      thumbnailView: !prevState.thumbnailView
    }))
  }

  render() {
    //this.displayrec();
    //this.displayImg();

    // const errors = this.props.errors || {}

    // const { step, collapseID, batchData, batches, videoModal, orderStartModal, addressErrorModal, batchErrorModal, contentStandardModal, processing, batchModalOpen,
    //   selectedBatch, productModalOpen, accessToken, notSelected } = this.state
    const { contentStandardModal, productCreateModal, orderEditModal, orderCaptureModal, processing, userProfile, mediaUploadModal } = this.state
    let viewFragment = (<h2>None</h2>)
    let viewIconFragment = (<h2>None</h2>)
    // let thumbnailViewSearchBarFragment = (<h2>None</h2>)

    let deleteModal = (
      <MDBModal isOpen={this.state.deletePermission} centered>
        <MDBModalHeader toggle={this.deleteDialog}><div className="row" style={{ marginLeft: '120px' }}>Action Permission</div></MDBModalHeader>
        <MDBModalBody>
          <div className="container" style={{width: '100%'}}>
            <div className="row">
              <b>{this.state.message}</b>
            </div>
          </div>
        </MDBModalBody>
        <MDBModalFooter style={{margin: 'auto', width: '100%'}}>
          <Button color="green" id="deleteOption" onClick={this.bulkOperation} style={{position: 'relative', right: '43%'}}>Yes</Button>
          <Button color="red" id="no" onClick={this.deleteDialog} style={{position: 'relative', right: '38%'}}>No</Button>
        </MDBModalFooter>
      </MDBModal>
    )

    let ContentStandardModal = (
        <StyledContentStandardModal className="content-standard-modal" isOpen={contentStandardModal} toggle={this.contentStandardToggle} centered>
          <MDBModalHeader><b>Create A Content Standard</b><button onClick={this.contentStandardToggle}>Close</button></MDBModalHeader>
          <MDBModalBody>
            <ContentStandard
                fieldValues={this.fieldValues}
                processing={processing}
                reset={this.reset}
                finish={this.finish}
                cancel={this.contentStandardToggle}
                submit={this.submit}
                standardSubmit={this.props.createContentStandard}
                minimal={true}
                userInfo={this.props.userInfo}
                accessToken={this.props.accessToken}/>
          </MDBModalBody>
        </StyledContentStandardModal>
    );

    let ProductCreateModal = (
        // <StyledContentStandardModal className="content-standard-modal" isOpen={productCreateModal} toggle={this.productCreateToggle} centered>
        <StyledProductModal className="product-create-modal" isOpen={productCreateModal} toggle={this.productCreateToggle} centered>
        {/*<MDBModal className="content-standard-modal" isOpen={productCreateModal} toggle={this.productCreateToggle} centered>*/}
        {/*<MDBModalHeader><b>Create A Content Standard</b><button onClick={this.productCreateToggle}>Close</button></MDBModalHeader>*/}
        {/*<MDBModalHeader></MDBModalHeader>*/}
          <MDBModalBody>
            <ProductCreateView
                // fieldValues={this.fieldValues}
                // processing={processing}
                // reset={this.reset}
                // finish={this.finish}
                cancel={this.productCreateToggle}
                // submit={this.submit}
                // standardSubmit={this.props.createContentStandard}
                // productCreate={this.props.productCreate}
                minimal={true}
                {...this.props}
                // userInfo={this.props.userInfo}
                // accessToken={this.props.accessToken}
                // retrieveProducts={this.props.retrieveProducts}
            />
          </MDBModalBody>
        </StyledProductModal>
    );

    let OrderEditSelectedModal = (
        <StyledEditSelectedModal className="order-edit-modal" isOpen={orderEditModal} toggle={this.orderEditToggle} centered>
          {/*<MDBModal className="content-standard-modal" isOpen={productCreateModal} toggle={this.productCreateToggle} centered>*/}
          {/*<MDBModalHeader><b>Create A Content Standard</b><button onClick={this.productCreateToggle}>Close</button></MDBModalHeader>*/}
          {/*<MDBModalHeader></MDBModalHeader>*/}
          <MDBModalBody>
            <OrderEditSelectedView
                // fieldValues={this.fieldValues}
                // processing={processing}
                // reset={this.reset}
                // finish={this.finish}
                cancel={this.orderEditToggle}
                // submit={this.submit}
                // standardSubmit={this.props.createContentStandard}
                contentStandard={this.props.contentStandard}
                getContentStandard={this.props.getContentStandard}
                history={this.props.history}
                minimal={true}
                userId={this.user_id}
                productList={this.state.tableRows}
                userInfo={this.props.userInfo}
                accessToken={this.props.accessToken}
                submitEditOrder={this.submitFullOrder}
                // submitEditOrder={this.props.saveEditingOrder}
                retrieveProducts={this.props.retrieveProducts}
                editurl={this.props.cart}
                userProfile={userProfile}
            />
          </MDBModalBody>
        </StyledEditSelectedModal>

    );

    let OrderCaptureSelectedModal = (
        <StyledCaptureSelectedModal className="order-capture-modal" isOpen={orderCaptureModal} toggle={this.orderCaptureToggle} centered>
          {/*<MDBModal className="content-standard-modal" isOpen={productCreateModal} toggle={this.productCreateToggle} centered>*/}
          {/*<MDBModalHeader><b>Create A Content Standard</b><button onClick={this.productCreateToggle}>Close</button></MDBModalHeader>*/}
          {/*<MDBModalHeader></MDBModalHeader>*/}
          <MDBModalBody>
            <OrderCaptureSelectedView
                cancel={this.orderCaptureToggle}
                contentStandard={this.props.contentStandard}
                getContentStandard={this.props.getContentStandard}
                history={this.props.history}
                minimal={true}
                userId={this.user_id}
                productList={this.state.tableRows}
                userInfo={this.props.userInfo}
                accessToken={this.props.accessToken}
                submitCaptureOrder={this.submitFullOrder}
                retrieveProducts={this.props.retrieveProducts}
                editurl={this.props.cart}
                userProfile={userProfile}
            />
          </MDBModalBody>
        </StyledCaptureSelectedModal>

    );

    let MediaUploadModal = (
        <StyledMediaUploadModal className="media-upload-modal" isOpen={mediaUploadModal} toggle={this.mediaUploadToggle} centered>
          {/*<MDBModal className="content-standard-modal" isOpen={productCreateModal} toggle={this.productCreateToggle} centered>*/}
          {/*<MDBModalHeader><b>Create A Content Standard</b><button onClick={this.productCreateToggle}>Close</button></MDBModalHeader>*/}
          {/*<MDBModalHeader></MDBModalHeader>*/}
          <MDBModalBody>
            <MediaUploadView
                // fieldValues={this.fieldValues}
                // processing={processing}
                // reset={this.reset}
                // finish={this.finish}
                cancel={this.mediaUploadToggle}
                // submit={this.submit}
                // standardSubmit={this.props.createContentStandard}
                history={this.props.history}
                // minimal={true}
                productList={this.state.tableRows}
                userInfo={this.props.userInfo}
                accessToken={this.props.accessToken}
                mediaUpload={this.props.mediaUpload}
                mediaUploadDict={this.props.mediaUploadDict}
                // retrieveProducts={this.props.retrieveProducts}
            />
          </MDBModalBody>
        </StyledMediaUploadModal>

    );

    let RunAuditModal = (
        <StyledRunAuditModal isOpen={this.state.runAuditModal} toggle={this.runAuditToggle} centered style={{border: 15}}>
          <MDBModalHeader style={{borderRadius: '10px 10px 0px 0px',  display: 'flex', flexDirection: 'row', justifyContent:'space-between', width: '100%', backgroundColor: '#00A3FF'}}>
            <p style={{order: 0, fontSize: 24, fontWeight: 600, color: '#ffffff', marginBottom:0}}>Audit Selected Products</p>
            <button onClick={this.runAuditToggle} style={{order: 1, right:10, fontSize: 18, fontWeight: 500, color: 'rgb(90,90,90)'}}>Close</button>
          </MDBModalHeader>
          <MDBModalBody style={{borderRadius: '15px'}}>
            <RunAuditView
                cancel={this.runAuditToggle}
                productList={this.state.tableRows}
                userInfo={this.props.userInfo}
                runAudit={this.runAudit}
                contentStandard={this.props.contentStandard}
                getContentStandard={this.props.getContentStandard}
            />
          </MDBModalBody>
        </StyledRunAuditModal>
        );

    if (this.state.thumbnailView) {
      viewIconFragment = (
          <Svg width={106} height={24} viewBox="0 0 105 24">
            <Defs />
            <G transform="translate(-991 -230)">
              <G class="thumbnail-view-toggle-active-cls-1" transform="translate(1043 230)">
                <Path
                  class="thumbnail-view-toggle-active-cls-5"
                  d="M0,0H43A10,10,0,0,1,53,10v4A10,10,0,0,1,43,24H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z"
                />
                <Path
                  class="thumbnail-view-toggle-active-cls-6"
                  d="M1,.5H43A9.5,9.5,0,0,1,52.5,10v4A9.5,9.5,0,0,1,43,23.5H1A.5.5,0,0,1,.5,23V1A.5.5,0,0,1,1,.5Z"
                />
              </G>
              <G class="thumbnail-view-toggle-active-cls-2" transform="translate(1044 254) rotate(180)">
                <Path
                  class="e"
                  d="M0,0H43A10,10,0,0,1,53,10v4A10,10,0,0,1,43,24H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z"
                />
                <Path
                  class="thumbnail-view-toggle-active-cls-6"
                  d="M1,.5H43A9.5,9.5,0,0,1,52.5,10v4A9.5,9.5,0,0,1,43,23.5H1A.5.5,0,0,1,.5,23V1A.5.5,0,0,1,1,.5Z"
                />
              </G>
              <Path
                class="thumbnail-view-toggle-active-cls-3"
                d="M11.707,7.854,8.2,13.707l-2.324-1.7-.018-.061L5.716,11.9l.108.079-3.482,2.9v1.171H16.39V14.878L14.634,9.61Zm-6.439.585A1.756,1.756,0,1,0,3.512,6.683,1.756,1.756,0,0,0,5.268,8.439ZM18.146,2H.585A.586.586,0,0,0,0,2.585V17.8a.585.585,0,0,0,.585.585H18.146a.585.585,0,0,0,.585-.585V2.585A.585.585,0,0,0,18.146,2Zm-.585,14.634a.585.585,0,0,1-.585.585H1.756a.585.585,0,0,1-.585-.585V3.756a.586.586,0,0,1,.585-.585h15.22a.585.585,0,0,1,.585.585Z"
                transform="translate(1058.488 231.512)"
              />
              <Path
                class="thumbnail-view-toggle-active-cls-4"
                d="M0,1A1,1,0,1,1,1,2,1,1,0,0,1,0,1ZM0,5A1,1,0,1,1,1,6,1,1,0,0,1,0,5Zm0,4a1,1,0,1,1,1,1A1,1,0,0,1,0,9.005Zm0,4a1,1,0,1,1,1,1A1,1,0,0,1,0,13.008ZM4,0H21.866V2H4ZM4,4H21.866V6H4ZM4,8H21.866v2H4Zm0,4H21.866v2H4Z"
                transform="translate(1007.878 234.512)"
              />
            </G>
          </Svg>
      )
      viewFragment = (

              <ProductThumbnailCard data={this.state.productData}
                                    handleClick={this.handleClick}
                                    listViewTableData={this.state.tableRows}
                                    history={this.props.history}
              />
      )
      // thumbnailViewSearchBarFragment = (
      //     <SearchBar
      //         onChange={(e) => console.log(e)}
      //         onRequestSearch={(e) => console.log(e)}
      //         style={{
      //           margin: '0 auto',
      //           maxWidth: 800
      //         }}
      // />
      // )
    } else {
      viewIconFragment = (
          <Svg width={106} height={24} viewBox="0 0 106 24">
            <Defs />
            <G transform="translate(-991 -230)">
              <G class="list-view-toggle-active-cls-1" transform="translate(991 230)">
                <Rect class="list-view-toggle-active-cls-5" width={106} height={24} rx={10} />
                <Rect class="list-view-toggle-active-cls-6" x={0.5} y={0.5} width={105} height={23} rx={9.5} />
              </G>
              <G class="list-view-toggle-active-cls-2" transform="translate(1044 230)">
                <Path
                  class="list-view-toggle-active-cls-5"
                  d="M0,0H43A10,10,0,0,1,53,10v4A10,10,0,0,1,43,24H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z"
                />
                <Path
                  class="list-view-toggle-active-cls-6"
                  d="M1,.5H43A9.5,9.5,0,0,1,52.5,10v4A9.5,9.5,0,0,1,43,23.5H1A.5.5,0,0,1,.5,23V1A.5.5,0,0,1,1,.5Z"
                />
              </G>
              <Path
                class="list-view-toggle-active-cls-3"
                d="M0,1A1,1,0,1,1,1,2,1,1,0,0,1,0,1ZM0,5A1,1,0,1,1,1,6,1,1,0,0,1,0,5Zm0,4a1,1,0,1,1,1,1A1,1,0,0,1,0,9.005Zm0,4a1,1,0,1,1,1,1A1,1,0,0,1,0,13.008ZM4,0H21.866V2H4ZM4,4H21.866V6H4ZM4,8H21.866v2H4Zm0,4H21.866v2H4Z"
                transform="translate(1007.878 234.512)"
              />
              <Path
                class="list-view-toggle-active-cls-4"
                d="M11.707,7.854,8.2,13.707l-2.324-1.7-.018-.061L5.716,11.9l.108.079-3.482,2.9v1.171H16.39V14.878L14.634,9.61Zm-6.439.585A1.756,1.756,0,1,0,3.512,6.683,1.756,1.756,0,0,0,5.268,8.439ZM18.146,2H.585A.586.586,0,0,0,0,2.585V17.8a.585.585,0,0,0,.585.585H18.146a.585.585,0,0,0,.585-.585V2.585A.585.585,0,0,0,18.146,2Zm-.585,14.634a.585.585,0,0,1-.585.585H1.756a.585.585,0,0,1-.585-.585V3.756a.586.586,0,0,1,.585-.585h15.22a.585.585,0,0,1,.585.585Z"
                transform="translate(1059.488 231.512)"
              />
            </G>
          </Svg>
      )
      viewFragment = (
          <StyledTable ref={el => {
            if (!el) return;
            // console.log("initial x-left", el.getBoundingClientRect());
            let prevValue = JSON.stringify(el.getBoundingClientRect());
            const start = Date.now();
            const handle = setInterval(() => {
              let nextValue = JSON.stringify(el.getBoundingClientRect());
              if (nextValue === prevValue) {
                clearInterval(handle);
                // console.log(
                //     `width stopped changing in ${Date.now() - start}ms. x-left:`,
                //     el.getBoundingClientRect()
                // );
                this.state.xAxisTableStart = el.getBoundingClientRect().left
              } else {
                prevValue = nextValue;
              }
            }, 100);
          }}>
            <MDBDataTable
              // btn
              striped={false}
              searchLabel="Search by Name, ID, UPC, or SKU"
//              search="Fred"
              // searchValue="TestB"
              responsive
              // small
              // scrollY
              // multipleCheckboxes
              // autoWidth
              // fixed
              // scrollX
              maxHeight="500px"
              hover
              searching={true}
              // scrollY
              // scrollX
              paging={false}
              // pagination="false"
              exportToCSV={true}
              data={this.createData()}
            />
          </StyledTable>
      )
      // thumbnailViewSearchBarFragment = (<div/>)
    }

    return (
      <div className="container">
        {/* <ProductLibraryTopbar /> */}
        {ContentStandardModal}
        {ProductCreateModal}
        {OrderEditSelectedModal}
        {OrderCaptureSelectedModal}
        {MediaUploadModal}
        {RunAuditModal}
        {deleteModal}
        <ProductView>
          <LeftPanel>
            <ManageLeftSideMenu active={1}
                                company={this.state.companyName}
                                profileURL={userProfile.profileURL}
                                profilePic={this.state.profilePic}
                                fullName={userProfile.fullName}
                                productCount={userProfile.productCount}
                                toggle_cs={this.contentStandardToggle}
                                toggle_pc={this.productCreateToggle}
                                toggle_oe={this.orderEditToggle}
                                toggle_oc={this.orderCaptureToggle}
                                toggle_mu={this.mediaUploadToggle}
                                toggle_ra={this.runAuditToggle}/>
          </LeftPanel>
          <RightPanel id="mainPanel">
            <Products>
              {/*<i className="fa fa-inbox"></i>*/}
              <DashCam>
                <svg className="camera" viewBox="0.001 3.2 78.474 62.779">
                  <path fill="rgba(135,135,135,1)" id="camera"
                        d="M 39.23569107055664 26.74228286743164 C 32.73458862304688 26.74228286743164 27.46454620361328 32.01477813720703 27.46454620361328 38.51342391967773 C 27.46454620361328 45.01207733154297 32.73458862304688 50.28457641601563 39.23569107055664 50.28457641601563 C 45.73434448242188 50.28457641601563 51.00683212280273 45.0120849609375 51.00683212280273 38.51343154907227 C 51.00683212280273 32.01477813720703 45.73434448242188 26.74228858947754 39.23568725585938 26.74228858947754 Z M 70.62540435791016 14.97114276885986 L 61.20848846435547 14.97114276885986 C 59.91366577148438 14.97114276885986 58.51584625244141 13.96569061279297 58.11366271972656 12.7346248626709 L 55.67605590820313 5.431611061096191 C 55.26406860351563 4.202998161315918 53.87605285644531 3.19999885559082 52.57632064819336 3.19999885559082 L 25.89506149291992 3.19999885559082 C 24.6002368927002 3.19999885559082 23.20241165161133 4.205451011657715 22.80023002624512 5.429159164428711 L 20.36017227172852 12.7346248626709 C 19.95308876037598 13.96569061279297 18.5601692199707 14.97114276885986 17.26534461975098 14.97114276885986 L 7.848428249359131 14.97114276885986 C 3.53234338760376 14.97114276885986 0.001000404357910156 18.50248718261719 0.001000404357910156 22.81857109069824 L 0.001000404357910156 58.13199234008789 C 0.001000404357910156 62.44808578491211 3.53234338760376 65.97943115234375 7.848428249359131 65.97943115234375 L 70.62786102294922 65.97943115234375 C 74.94394683837891 65.97943115234375 78.47528076171875 62.44808578491211 78.47528076171875 58.13199234008789 L 78.47528076171875 22.81856727600098 C 78.47528076171875 18.50248146057129 74.94394683837891 14.97114086151123 70.62785339355469 14.97114086151123 Z M 39.23569107055664 58.13199234008789 C 28.39887809753418 58.13199234008789 19.61712074279785 49.35023498535156 19.61712074279785 38.51342391967773 C 19.61712074279785 27.67662048339844 28.39888000488281 18.89485740661621 39.23569107055664 18.89485740661621 C 50.07004547119141 18.89485740661621 58.85426330566406 27.67662048339844 58.85426330566406 38.51342391967773 C 58.85426330566406 49.35023498535156 50.07004547119141 58.13199234008789 39.23569107055664 58.13199234008789 Z M 68.66355133056641 27.52702903747559 C 67.14556121826172 27.52702903747559 65.91694641113281 26.29596138000488 65.91694641113281 24.7755241394043 C 65.91694641113281 23.264892578125 67.14556121826172 22.02892112731934 68.66355133056641 22.02892112731934 C 70.18154144287109 22.02892112731934 71.41015625 23.25998878479004 71.41015625 24.7755241394043 C 71.41015625 26.29351234436035 70.18154144287109 27.52702903747559 68.66355133056641 27.52702903747559 Z">
                  </path>
                </svg>
              </DashCam>
              <span>Product Library</span>
              {/*</button>*/}
            </Products >
            {/*<ProductLibrary />*/}
            <ViewFragment style={{
              maxHeight: 'inherit',
            }}>{viewFragment}</ViewFragment>
            <div id="view-selector-icon"
                   style={{paddingLeft: '12.5%', position: 'absolute', align: 'center', top: '5%', left: '25%'}}
                   onClick={(e) => this.handleLibraryView(e)}>
                <ViewFragment>{viewIconFragment}</ViewFragment>
                {/*<ViewFragment>{thumbnailViewSearchBarFragment}</ViewFragment>*/}
              </div>
            { this.state.noRecord &&
                  <div className="row" style={{width:1030, height:105 }}>
                    <div className="alert-wizard" style={{position: 'absolute', marginLeft: -82, marginTop: 37, background: '#EB5757', width: 1085 }}>
                      <p className="alert-wizard-text" style={{width: 366, textAlign: 'center'}}>No result found
                        <i className="fa fa-times" aria-hidden="true" style={{ marginLeft: 691, position: 'absolute',
                          marginTop: 12 }} onClick={this.clearMessage}/>
                      </p>
                    </div>
                  </div>
            }
            { !this.state.isLoaded &&
              <div style={{paddingTop: '20%'}}>
                  <Loader loaded={this.state.isLoaded} lines={13} length={20} width={10} radius={30}
                        corners={1} rotate={0} direction={1} color="#6FCF97" speed={1}
                  trail={60} shadow={false} hwaccel={false} className="spinner"
                  top="50%" left="50%" scale={0.70}
                  loadedClassName="loadedContent" />
              </div>
            }
            <div style={{position: 'absolute', bottom: '2.5%', zIndex: 998}} title={'Delete selected products'} onClick={this.deleteDialog}>
              <FontAwesomeIcon icon={faTrashAlt} style={{ color: 'rgba(52,52,52,0.5)'}} size="1x" />
              <a href={"/#/product-asset/editor"}><i className="fa fa-pencil pr-2" aria-hidden="true"/></a>
            </div>

          </RightPanel>
        </ProductView>
      </div>
    )
  }
}
