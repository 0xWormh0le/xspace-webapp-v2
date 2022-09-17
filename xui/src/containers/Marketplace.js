import React from 'react'
import { connect } from 'react-redux'
import  ApiKeys  from '../components/MarketplaceView'
import {apiSetting} from  '../actions/auth'
import Navbar from './Navbar'
import {authErrors, isAuthenticated} from '../reducers'

const ApiSetting = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <ApiKeys {...props}/>
    </div>
  )
}
const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state)
})
const mapDispatchToProps = (dispatch) => ({
  onSubmit: (cart_id, store_id, shopify_apikey, shopify_password, store_url) => {
    dispatch(apiSetting(cart_id, store_id, shopify_apikey, shopify_password, store_url))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ApiSetting);
