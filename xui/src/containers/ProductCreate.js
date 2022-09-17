import React from 'react'
import { connect } from 'react-redux'
import {categoriesFind, productCreate, productExcelUpload, productMultiUpload, productImportShopify, productImportMagento, productImportWoocommerce} from  '../actions/products'
import {authErrors, isAuthenticated, accessToken, getExcelQueuedProducts, getImportedProducts, getCreatedProduct, getBillingCheck, userInfo} from '../reducers'
import {runBillingCheck} from  '../actions/profile'
import Navbar from './Navbar'
import ProductCreateView from '../components/ProductCreateView'

const ProductCreate = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <ProductCreateView {...props}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  accessToken: accessToken(state),
  excelProducts: getExcelQueuedProducts(state),
  importedProducts: getImportedProducts(state),
  createdProduct: getCreatedProduct(state),
  billingCheck: getBillingCheck(state),
  userInfo: userInfo(state),

})
const mapDispatchToProps = (dispatch) => ({
  productCreate: (sku, name, price, height, width, length, description, category, manufacturer, upccode) => {
    dispatch(productCreate(sku, name, price, height, width, length, description, category, manufacturer, upccode))
  },
  productUpload: (file) => {
    return dispatch(productExcelUpload(file))
  },
  productUploadMulti: (productArray) => {
    return dispatch(productMultiUpload(productArray))
  },
  importShopify: () => {
    dispatch(productImportShopify())
  },
  importMagento: () => {
    dispatch(productImportMagento())
  },
  importWoocommerce: () => {
    dispatch(productImportWoocommerce())
  },
  retrieveProducts: () => {
    return dispatch(categoriesFind())
  },
  runBillingCheck: () => {
    return dispatch(runBillingCheck())
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(ProductCreate);
