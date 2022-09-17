import React from 'react'
import { connect } from 'react-redux'
import {productCreateOrder, getProduct, getContentStandard, createContentStandard, uploadEditingFile} from  '../actions/products'
import { orderProductsPost, addressPost, getAddresses, editOrderPost } from '../actions/orders'
import * as reducers from '../reducers'
import OrderWizardView from '../components/orderwizard/OrderWizardView'
import {getAddress} from '../reducers'
import Navbar from './Navbar'

const OrderCreateWizard = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <OrderWizardView {...props}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: reducers.authErrors(state),
  isAuthenticated: reducers.isAuthenticated(state),
  userId: reducers.getUserId(state),
  userInfo: reducers.userInfo(state),
  accessToken: reducers.accessToken(state),
  contentStandard: reducers.getContentStandard(state),
  addresses: getAddress(state),
  contentStandardCreate: reducers.getCreateContentStandard(state),
  url: reducers.getURL(state),
  editurl: reducers.getCart(state)
})

const mapDispatchToProps = (dispatch) => ({
  productCreateOrder: (productArray) => {
    dispatch(productCreateOrder(productArray))
  },
  getProduct: () => {
    dispatch(getProduct())
  },
  getContentStandard: () => {
    dispatch(getContentStandard())
  },
  getAddress: () => {
    dispatch(getAddresses())
  },
  createContentStandard: (payload) => {
    dispatch(createContentStandard(payload))
  },
  saveOrders: (payload) => {
    dispatch(orderProductsPost(payload))
  },
  saveEditingOrder: (payload) => {
    dispatch(editOrderPost(payload))
  },
  saveAddress: (payload) => {
    dispatch(addressPost(payload))
  },
  createFileEditUpload: (editOrderID, payload) => {
    return dispatch(uploadEditingFile(editOrderID, payload))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderCreateWizard);
