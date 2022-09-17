import React, {Component} from 'react'
import styled from 'styled-components'
import { MDBPopover, MDBPopoverBody, Container, Modal, ModalHeader, ModalBody, ModalFooter, MDBDataTable} from 'mdbreact'
import  Loader from 'react-loader';
import ManageLeftSideMenu from '../menu/ManageLeftSideMenu'
import ProductUpdateTopbar from './../menu/ProductUpdateTopbar'
import QRPrintLabel from './QRPrintLabelView'
import AddTrackingNumber from './AddTrackingNumber'
import ViewOrder from './ViewOrder'
import ViewDownloads from './ViewDownloads'
import axios from 'axios';
import { API_ROOT } from '../../index';
import bagImg from '../../assets/img/bag.png'

import { ProductView, LeftPanel } from '../ProductManageView'
import { StyledTable } from '../../lib/styled-table'
// import {Button} from "reactstrap";

const StyledLeftPanel = styled(LeftPanel)`
  min-height: 600px;
`

const PopOver = styled.div`
  position: relative;
  button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .action-label {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    width: 180px;
    i {
      margin-right: 10px;
    }
    :hover {
      cursor: pointer;
    }
  }
`

const RightPanel = styled(LeftPanel)`
  position: relative;
  max-width: 100%;
  width: 100%;
  justify-content: initial;
  min-height: 600px;
  h4 {
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    line-height: 20px;
    display: flex;
    align-items: center;
    margin: 0;
    padding: 1rem 25px;
    border-bottom: 2px solid #F4F5FA;
    img {
      width: 32px;
      height: 32px;
      margin-right: 20px;
    }
  }

  // .dataTables_wrapper .dataTables_scroll {
  //   max-width: 95%;
  //   margin: auto;
  // }
  
  .dataTables_wrapper .dataTables_length {
    display: none !important;
  }
  
  .dataTables_wrapper table.dataTable thead:last-child {
    display: none;
  }
    
  // .dataTables_wrapper {
  //   max-height: 400px;
  // }
  
  .dataTables_wrapper table.dataTable {
    max-width: 95% !important;
    // overflow-y: auto !important;
    // max-height: 300px !important;
  }
  
  // .dataTables_wrapper table.dataTable tbody tr td {
  //   :last-child {
  //       position: relative;
  //       z-index: 0;
  //   }
  // }
  
  
  // .dataTables_wrapper {
  //   tbody {
  //       overflow-y: auto !important;
  //       max-height: 300px !important;
  //   }
  // }

  // .dataTables_wrapper table.dataTable thead {
  //   display: block !important;
  // }
  //
  // .dataTables_wrapper table.dataTable thead tr th {
  //   font-size: 14px;
  //   // font-weight: normal;
  //   color: #636363;
  //
  //   :first-child {
  //     width: 18%;
  //     // padding: 10px 0px 10px 8px;
  //   }
  //   :nth-child(2) {
  //     width: 20%;
  //     // padding-left: 0px;
  //     // padding-right: 0px;
  //   }
  //   :nth-child(3) {
  //     width: 37%;
  //     // padding-left: 0px;
  //     // padding-right: 0px;
  //   }
  //   :nth-child(4) {
  //     width: 33%;
  //     // padding-left: 0px;
  //     // padding-right: 0px;
  //   }
  //
  // }    

  // .dataTables_wrapper table.dataTable thead tr th {
  //   font-size: 14px;
  //   font-weight: normal;
    // color: #636363;
`


export default class ProductUpdate extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      'productOrderList': [],
      qrPrintWindowOpen: false,
      addTrackingWindowOpen: false,
      showPDFButton: false,
      downloadOpen: false,
      userProfile: [],
      profilePic: '/icons8-customer-128.png',
      viewProduct: null,
      'page': 1,
      'totalCount': '',
      'step': '',
      'orderId': '',
      'modal': true,
      'isLoaded': false,
      'isProductLoaded': false,
      'quantity': 10,
      'pageNumbers': [],
      'productList': [],
    }
    
    this.productOrder = this.productOrder.bind(this)
    this.paginationClick = this.paginationClick.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.closeToggle = this.closeToggle.bind(this)
    this.getProduct = this.getProduct.bind(this);
    this.toggleQRPrintDialog = this.toggleQRPrintDialog.bind(this);
    this.toggleOrderDownloads = this.toggleOrderDownloads.bind(this);
    this.closeOrderDownloads = this.closeOrderDownloads.bind(this);

  }

  componentDidMount() {
    const pageCount = 1;
    this.setState({'userProfile':this.props.userInfo || '' });
    this.productOrder(pageCount);
  }

  paginationClick(event){
    this.setState({'storeProducts': [], 'isLoaded': false, page: Number(event.target.id)})
    this.props.productOrder(event.target.id)
  }

  previousPage(event){
      let { page } = this.state
      if(page > 1){
          this.setState({
            page: page - 1
          });
        this.props.productOrder(page-1)
      }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if(nextProps.ProductOrder && nextProps.ProductOrder.product_order ){
      // this.setState({'productOrderList': nextProps.ProductOrder.product_order.product_order || '',  'totalCount': nextProps.ProductOrder.product_order.totalCount || '', isLoaded: true, })
        this.setState({'productOrderList': nextProps.ProductOrder.product_order.product_order || '',
                            'totalCount': nextProps.ProductOrder.product_order.totalCount || '',
                            isLoaded: true, }, ()=> console.log("PRODUCCCCTSOIRDERLIST", this.state.productOrderList))

    }
    if(nextProps.ProductOrder && nextProps.ProductOrder.message){
      this.setState({'showPDFButton':  nextProps.ProductOrder.message == 'PDF generated' ? true : false })
    }
    if( nextProps.userInfo) {
        this.setState({'userProfile': nextProps.userInfo || ''})
    }
  }

  componentWillMount() {
    document.title = 'XSPACE | My Orders'
  }

  productOrder(pageCount){
    this.props.productOrder(pageCount)
  }


  toggleQRPrintDialog = (orderId) => {
    this.setState({ qrPrintWindowOpen: !this.state.qrPrintWindowOpen, showPDFButton: false,  orderId: orderId});
  }

  toggleOrderDownloads = (orderId) => {
    this.setState({ downloadOpen: !this.state.downloadOpen, orderId: orderId});
  }

  closeOrderDownloads = () => {
    this.setState({ downloadOpen: false});
  }

  toggleTrackingNumberDialog = (orderID) => {
    this.setState({ addTrackingWindowOpen: !this.state.addTrackingWindowOpen, orderId: orderID});
  }

  openAction(event){

  }

  getProduct(orderId, pageCount) {
    this.setState({'isProductLoaded': false})
      const thisScope = this
      const config = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'authorization': 'Bearer '+this.props.accessToken
            },
            body: JSON.stringify({ orderId: orderId })
        }

      axios.get(API_ROOT +'/api/orders/?page=1', {
        params: {
            orderId: orderId,
        },
        body: JSON.stringify({ orderId: orderId }),
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'authorization': 'Bearer '+thisScope.props.accessToken
        }
      }).then(function (response) {
        // handle success
        //response.data.product_order.product_order.length > 0
          console.log("VIEWDETAILS", response);
        thisScope.setState({'productList': response.data.product_order.product_order, 'isProductLoaded': true})
      }).catch(function (error) {
        // handle error
        console.log(error);
      }).then(function () {
        // always executed
      });
  }

  actionOpen = (product, actionName) => {
    if(actionName ==='vieworder') {
      // this.getProduct(orderId, 1)
    }

    // this.setState({'step': actionName, 'modal': true, orderId: orderId})
      this.setState({'step': actionName, 'modal': true, viewProduct: product})
  }

  closeToggle() {
    this.setState({
      modal: !this.state.modal, productList: []
    })
  }


  render() {
      let { page, quantity, totalCount, productOrderList, pageNumbers, modal, step, productList,
            showPDFButton, isProductLoaded, userProfile, viewProduct } = this.state
      console.log('YEETING', userProfile);
      let fragment = (<h2>None</h2>);
      // let viewOrder = (
      //     <Modal isOpen={this.state.vieworder} toggle={this.viewOrder} size="fluid">
      //       <ModalHeader toggle={this.toggleQRPrintDialog}>QR Print Labels</ModalHeader>
      //       <ModalBody>
      //         <ViewOrder
      //           fieldValues={this.fieldValues}
      //           processing={this.state.processing}
      //           reset={this.reset}
      //           finish={this.finish}
      //           cancel={this.toggleQRPrintDialog}
      //           minimal={true}>
      //         </ViewOrder>
      //       </ModalBody>
      //     </Modal>
      //  )
      //
      //  let viewOrderDLs = (
      //     <Modal isOpen={this.state.downloadOpen} toggle={this.toggleOrderDownloads} size="lg" centered>
      //       <ModalHeader toggle={this.closeOrderDownloads}>Downloads for Order: {this.state.orderId}</ModalHeader>
      //       <ModalBody>
      //         <ViewDownloads
      //           fieldValues={this.fieldValues}
      //           processing={this.state.processing}
      //           cancel={this.closeOrderDownloads}
      //           accessToken={this.props.accessToken}
      //           getDownloads={this.props.getOrderDLs}
      //           download={this.props.download}
      //           orderId={this.state.orderId}
      //           minimal={true}>
      //         </ViewDownloads>
      //       </ModalBody>
      //     </Modal>
      //  )
      //
      // let qrPrint = (
      //     <Modal isOpen={this.state.qrPrintWindowOpen} toggle={this.toggleQRPrintDialog} size="fluid">
      //       <ModalHeader toggle={this.toggleQRPrintDialog}>QR Print Labels</ModalHeader>
      //       <ModalBody>
      //         <QRPrintLabel
      //           fieldValues={this.fieldValues}
      //           processing={this.state.processing}
      //           reset={this.reset}
      //           finish={this.finish}
      //           cancel={this.toggleQRPrintDialog}
      //           generateQrCode={this.props.generateQrCode}
      //           showPDFButton={showPDFButton}
      //           accessToken={this.props.accessToken}
      //           userInfo={this.props.userInfo}
      //           orderId={this.state.orderId}
      //           downloadPdf={this.props.downloadPdf}
      //           minimal={true}>
      //         </QRPrintLabel>
      //       </ModalBody>
      //     </Modal>
      //  )
      //
      //  let trackingNumberApp = (
      //     <Modal isOpen={this.state.addTrackingWindowOpen} toggle={this.toggleTrackingNumberDialog} size="fluid">
      //       <ModalHeader toggle={this.toggleTrackingNumberDialog}>Add Tracking Number to Order</ModalHeader>
      //       <ModalBody>
      //         <AddTrackingNumber
      //           fieldValues={this.fieldValues}
      //           processing={this.state.processing}
      //           reset={this.reset}
      //           finish={this.finish}
      //           cancel={this.toggleTrackingNumberDialog}
      //           accessToken={this.props.accessToken}
      //           addTrackingNumber={this.props.trackingNumber}
      //           orderId={this.state.orderId}
      //           minimal={true}>
      //         </AddTrackingNumber>
      //       </ModalBody>
      //     </Modal>
      //  )

      /* Logic for calculating page numbers */
      for (let i = 1; i <= Math.ceil(totalCount / 3); i++) {
        pageNumbers.push(i);
      }

      // Logic for displaying todos
      const indexOfFirstTodo = page - 1;
      const indexOfLastTodo = indexOfFirstTodo + 3;
      const currentPageList = pageNumbers.slice(indexOfFirstTodo, indexOfLastTodo);

      /* Logic for displaying page numbers */
      const renderPageNumbers = currentPageList.map(number => {
        return (
          <li
            className={number == page ? 'active-page' : 'in-active-page'}
            key={number}
            id={number}
            onClick={this.paginationClick}>
            {number}
          </li>
        );
      });

      switch (step) {

        case 'vieworder':
         fragment =   <ViewOrder
                        edit={false}
                        modal={modal}
                        cancel={this.closeToggle}
                        step={step}
                        // productList={productList}
                        productList={viewProduct}
                        // isProductLoaded={isProductLoaded}
                        isProductLoaded={true}
                        accessToken={this.props.accessToken}
                        // orderId={this.state.orderId}>
                        >
                      </ViewOrder>
          break;
        case 'vieworderDL':

          break;
        case 'editvieworder':
          fragment =  <ViewOrder
                        edit={true}
                        modal={modal}
                        cancel={this.closeToggle}
                        orderId='e753f62d-ac0a-44db-a61a-d2f03bd1780c'>
                      </ViewOrder>
          break;
        case 'PrintOR':
          fragment =  <QRPrintLabel
                        fieldValues={this.fieldValues}
                        processing={this.state.processing}
                        reset={this.reset}
                        finish={this.finish}
                        accessToken={this.props.accessToken}
                        cancel={this.toggleQRPrintDialog}
                        minimal={true}>
                      </QRPrintLabel>
          break;
        case 'Tracking':
          fragment =  <AddTrackingNumber
                        fieldValues={this.fieldValues}
                        processing={this.state.processing}
                        reset={this.reset}
                        finish={this.finish}
                        addTrackingNumber={this.props.trackingNumber}
                        orderId={this.state.orderId}
                        cancel={this.toggleTrackingNumberDialog}
                        minimal={true}>
                      </AddTrackingNumber>
          break;
        default:
          fragment = (<h2></h2>);
          break;
      }

      let popOver = (product, idx) => {
        return (
          <PopOver>
            <i className="fa fa-ellipsis-h custom-ellipsis"/>
            <MDBPopover
              container="body"
              component={'button'}
              placement="right"
              // popover
              clickable
              id={"popper"+idx}
            >
              <MDBPopoverBody>
                <ul className="list-unstyled">
                  <li className="action-label" onClick={() => this.actionOpen(product, 'vieworder')}>
                    <i className="fa fa-eye" aria-hidden="true"/> View Details
                  </li>
                  <li className="action-label" onClick={() => this.toggleOrderDownloads(product.orderID)}>
                    <i className="fa fa-download" aria-hidden="true"/> View Downloads
                  </li>
                  <li className="action-label" onClick={() => this.toggleQRPrintDialog(product.orderID)}>
                    <i className="fa fa-qrcode" aria-hidden="true"/> Print OR Labels
                  </li>
                  <li className="action-label" onClick={() => this.toggleTrackingNumberDialog(product.orderID)}>
                    <i className="fa fa-truck" aria-hidden="true" /> Add Shipping Tracking #
                  </li>
                  <li className="action-label">
                    <a href="https://xspaceapp.com/contact-us/" target="_blank" aria-label="Next">
                      <i className="fa fa-arrow-right" aria-hidden="true"></i>Contact Xspace
                    </a>
                  </li>
                </ul>
              </MDBPopoverBody>
            </MDBPopover>
          </PopOver>
        )
      }

      console.log(productOrderList)
      let orderRows = []
      if (productOrderList && productOrderList.length) {
        for (let i=0; i< productOrderList.length; i++) {
          let orderItem = {
            orderID: productOrderList[i].order_ID.split('-')[0],
            order_date: new Intl.DateTimeFormat('en-US').format(new Date(productOrderList[i].createdDate)),
            description: <pre>{productOrderList[i].description +
              (productOrderList[i].numberOfProducts > 1 ? 'Multi Product/Asset Order' : 'Single Product/Asset Order')}</pre>,
            status: productOrderList[i].status,
            action: popOver(productOrderList[i], i)
          }
          orderRows.push(orderItem)
        }
      }      

      let data = {
        columns: [
          {
            label: 'Order Number',
            field: 'orderID',
            sort: 'asc'
          },
          {
            label: 'Order Date',
            field: 'order_date',
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
            label: '',
            field: 'action',
          },
        ],
        rows: orderRows
      }

      return (
        <Container>
          <div className="animated">
            <ProductView>
                {/*{qrPrint}*/}
                {/*{trackingNumberApp}*/}
                {/*{viewOrderDLs}*/}
              <StyledLeftPanel>
                <ManageLeftSideMenu
                    company={this.state.companyName}
                    profileURL={userProfile.profileURL}
                    profilePic={this.state.profilePic}
                    fullName={userProfile.fullName}
                    productCount={userProfile.productCount}
                    // toggle_cs={this.contentStandardToggle}
                    // toggle_pc={this.productCreateToggle}
                    // toggle_oe={this.orderEditToggle}
                    // toggle_oc={this.orderCaptureToggle}
                    active={3}/>
              </StyledLeftPanel>
              <RightPanel>
                <div id="mainPanel">
                  <h4><img src={bagImg} alt='' />My Orders ({productOrderList ? productOrderList.length : ''})</h4>
                  <StyledTable className="Tester">
                      {/*<MDBDataTable btn searchLabel="Search by order ID, date, and status" data={data}></MDBDataTable>*/}
                      <MDBDataTable btn searchLabel="Search by order ID, date, and status" entriesOptions={[5]} data={data}></MDBDataTable>
                  </StyledTable>
                  {fragment}

                  {/* <div className="row">
                    <h5 className="col-md-2">Order Number</h5>
                    <h5 className="col-md-2">Order Date</h5>
                    <h5 className="col-md-4">Description</h5>
                    <h5 className="col-md-2">Status</h5>
                    <h5 className="col-md-2">Action</h5>
                  </div>
                  { !this.state.isLoaded && (
                    <div className="myorder-loader">
                      <Loader loaded={this.state.isLoaded} lines={13} length={20} width={10} radius={30}
                            corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
                            trail={60} shadow={false} hwaccel={false} className="spinner"
                            zIndex={2e9} bottom="80px" left="460px" scale={1.00}
                            loadedClassName="loadedContent" />
                    </div>
                  )}
                  {productOrderList.map((product, index) =>(
                      <div className="row product-order-content" key={index}>
                        <div className="col-md-2">
                          {product.orderID.split('-')[0]}
                        </div>
                        <div className="col-md-2">
                        {new Intl.DateTimeFormat('en-US').format(new Date(product.order_date))}
                        </div>
                        <div className="col-md-3">
                          {product.numberOfProducts > 1 ? 'Multi Product Order' : 'Single Product Order'}
                        </div>
                        <div className="col-md-3">
                          {product.status}
                        </div>
                        <div className="col-md-2">
                          <div className="icon-popover">
                            <MDBPopover
                                component="button"
                                placement="right"
                                popoverBody=""
                                className="btn btn-default custom-popver">

                              <MDBPopoverBody>
                                <ul className="list-unstyled">
                                  <li className="action-label">
                                    <a href="javascript:void(0)"  aria-label="Next" onClick={() => this.actionOpen(product.orderID, 'vieworder')}>
                                      <i className="fa fa-eye" aria-hidden="true" ></i> View Details
                                    </a>
                                  </li>
                                  <div className="underline-div"></div>
                                  <li className="action-label">
                                    <a href="javascript:void(0)" aria-label="Next" onClick={() => this.toggleQRPrintDialog(product.orderID)}>
                                      <i className="fa fa-qrcode" aria-hidden="true"></i> Print OR Labels
                                    </a>
                                  </li>
                                  <div className="underline-div"></div>
                                  <li className="action-label">
                                    <a href="javascript:void(0)" aria-label="Next" value={product.orderID} onClick={this.toggleTrackingNumberDialog}>
                                      <i className="fa fa-truck" aria-hidden="true"></i> Add Shipping Tracking #
                                    </a>
                                  </li>
                                  <div className="underline-div"></div>
                                  <li className="action-label">
                                    <a href="https://xspaceapp.com/contact-us/" target="_blank" aria-label="Next">
                                      <i className="fa fa-arrow-right" aria-hidden="true"></i>Contact Xspace
                                    </a>
                                  </li>
                                </ul>
                              </MDBPopoverBody>
                            </MDBPopover>
                          <i className="fa fa-ellipsis-v custom-ellipsis" aria-hidden="true" style={{position: 'relative', marginLeft: 14, zIndex: 1}}></i>
                          </div>
                        </div>
                      </div>
                    ))
                  }

                  {fragment}
                  {qrPrint}
                  {trackingNumberApp}
                  <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-6">
                      {totalCount > 10 ?
                        <ul className="page-product">
                          <li className="in-active-page">
                            <a className="" aria-label="Previous" onClick={this.previousPage}>
                              <span className="sr-only">Previous</span>
                            </a>
                          </li>
                          {renderPageNumbers}
                          <li className="in-active-page">
                            <a className="" href="#" aria-label="Next" style={{pointerEvents:'none'}}>
                              <span className="sr-only">Next</span>
                            </a>
                          </li>
                        </ul>
                      : " " }
                    </div>
                    <div className="col-sm-3"></div>
                  </div>*/}

                </div> 
              </RightPanel>
            </ProductView>
          </div>
        </Container>
      )
    }
}
