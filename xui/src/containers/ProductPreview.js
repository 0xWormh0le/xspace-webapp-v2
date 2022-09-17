import React from 'react'
import { connect } from 'react-redux'
import {authErrors, isAuthenticated, getUserId} from '../reducers'
import ProductPreviewView from '../components/ProductPreviewView'
import {productFind} from  '../actions/products'
import Navbar from './Navbar'
const ProductPreview = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <ProductPreviewView {...props} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  getUserId: getUserId(state)
});

const mapDispatchToProps = (dispatch) => ({
  findProduct: (product_id) => {
    return dispatch(productFind(product_id))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductPreview);
