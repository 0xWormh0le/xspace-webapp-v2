import React from 'react'
import { connect } from 'react-redux'
import  ApiKeyView from '../components/ecommerceapi/ApiKeyView'
import {authErrors, isAuthenticated, getUserId, userInfo} from '../reducers'
import Navbar from './Navbar'
const ApiSetting = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <ApiKeyView {...props}/>
    </div>
  )
}


const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  userId: getUserId(state),
  userInfo: userInfo(state)
})

export default connect(mapStateToProps)(ApiSetting);
