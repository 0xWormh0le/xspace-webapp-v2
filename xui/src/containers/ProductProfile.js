import React from 'react'
import { connect } from 'react-redux'
import ProductProfileView from '../components/ProductProfileView'

import {authErrors, isAuthenticated, getProductProfile, getProductUpdateStatus, getProductThread,
  getUploadFiles, getDeleteFiles, getBillingCheck, userInfo, accessToken, getXEditWorkload} from '../reducers'
import {productFind, findMessageThread, createMessage, productUpdate, uploadNewFile, deleteFiles,
  setXEditWorkload, create360} from  '../actions/products'
import {runBillingCheck, getUserProfile, fill360DB, fill2DPhotosDB} from  '../actions/profile'
import Navbar from './Navbar'
// import * as reducers from "../reducers";
const ProductProfile = (props) => {
        // <Uploader />
  return (
  <div>
  <Navbar {...props}/>
    <ProductProfileView {...props}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  product: getProductProfile(state),
  productStatus: getProductUpdateStatus(state),
  productThread: getProductThread(state),
  fileUpload: getUploadFiles(state),
  deleteFileObjs: getDeleteFiles(state),
  billingCheck: getBillingCheck(state),
  userInfo: userInfo(state),
  accessToken: accessToken(state),
  xEditWorkload: getXEditWorkload(state),
});

const mapDispatchToProps = (dispatch) => ({
  findProduct: (product_slug) => {
    return dispatch(productFind(product_slug))
  },
  updateProduct: (product_id, SKU, name, price, height, width, length,
    description, selectedCategory, manufacturer, upccode, upcType) => {
    return dispatch(productUpdate(product_id, SKU, name, price, height, width, length,
      description, selectedCategory, manufacturer, upccode, upcType))
  },
  getUserInfo: () => {
    dispatch(getUserProfile())
  },
  findMessageThread: (slug, itype, filename) => {
    return dispatch(findMessageThread(slug, itype, filename))
  },
  createMessage: (threadId, payload) => {
    return dispatch(createMessage(threadId, payload))
  },
  createFileUploadRSAA: (product_slug, payload) => {
    return dispatch(uploadNewFile(product_slug,payload))
  },
  deleteFilesRSAA: (product_slug, file, createdDateList) => {
    let payload = [file, createdDateList]
    // console.log('payload at delete file', payload)
    // console.log('payload at file', file)
    // console.log('payload at cdList', createdDateList)
    return dispatch(deleteFiles(product_slug, payload, createdDateList))
  },
  create360RSAA: (product_slug, urlList, createdDateList) => {
    return dispatch(create360(product_slug, urlList, createdDateList))

  },
  runBillingCheck: () => {
    return dispatch(runBillingCheck())
  },
  fill2DScript: (product_slug) => {
    dispatch(fill2DPhotosDB(product_slug))
  },
  fill360Script: (product_slug) => {
    dispatch(fill360DB(product_slug))
  },
  setXEditWorkload: (value) => {
    // console.log('container received:', value)
    dispatch(setXEditWorkload(value))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductProfile);
