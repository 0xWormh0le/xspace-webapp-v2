import React from 'react'
import { connect } from 'react-redux'
import ProductManageUpdater from '../components/productupdate/ProductUpdateView'
import {productImportStore, productImportMagento, productImportWoocommerce, productImportXspace, productMultiUpload, exportToStore} from  '../actions/products'
import * as reducers from '../reducers'

const ProductUpdates = (props) => {
  return (
    <ProductManageUpdater {...props}/>
  )
}

const mapStateToProps = (state) => ({
  errors: reducers.authErrors(state),
  isAuthenticated: reducers.isAuthenticated(state),
  userId: reducers.getUserId(state),
  importedProducts: reducers.getImportedProducts(state),
  importedXspaceProducts: reducers.getXspaceProducts(state),
  productCount: reducers.getStoreProductCount(state)
})

const mapDispatchToProps = (dispatch) => ({
  
  productImportStore: (storeType, pageCount) => {
    return dispatch(productImportStore(storeType, pageCount))
  },
  importMagento: () => {
    dispatch(productImportMagento())
  },
  importWoocommerce: () => {
    dispatch(productImportWoocommerce())
  },
  createProducts: (productArray) => {
    dispatch(productMultiUpload(productArray))
  },
  exportToStore: (productArray) => {
    dispatch(exportToStore(productArray))
  },
  importFromXspace: (pageCount) => {
    dispatch(productImportXspace(pageCount))
  }

})

export default connect(mapStateToProps, mapDispatchToProps)(ProductUpdates);