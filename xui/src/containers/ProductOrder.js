import React from 'react'
import { connect } from 'react-redux'
import ProductOrderView from '../components/productorder/ProductOrderView'
import {productOrder, addTrackingNumber, generateOrderQrCode, generatePdf} from  '../actions/products'
import {getOrderDownloadsAction} from  '../actions/orders'
import * as reducers from '../reducers'
import '../components/productorder/ProductOrderCss.css';
import Navbar from './Navbar'

const ProductOrders = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <ProductOrderView {...props}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: reducers.authErrors(state),
  ProductOrder: reducers.getProductOrder(state),
  accessToken: reducers.accessToken(state),
  userInfo:reducers.userInfo(state),
  download: reducers.getOrderDownloads(state),
})

const mapDispatchToProps = (dispatch) => ({
  
  productOrder: (pageCount) => {
    dispatch(productOrder(pageCount))
  },
  trackingNumber:(orderTrack) => {
    dispatch(addTrackingNumber(orderTrack))
  },
  generateQrCode:(orderTrack) => {
    dispatch(generateOrderQrCode(orderTrack))
  },
  downloadPdf: (orderId) => {
    dispatch(generatePdf(orderId))
  },
  getOrderDLs: (orderId) => {
    return dispatch(getOrderDownloadsAction(orderId))
  },

})

export default connect(mapStateToProps, mapDispatchToProps)(ProductOrders);