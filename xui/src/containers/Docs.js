import React from 'react'
import { connect } from 'react-redux'
import DocsView from '../components/DocsView'
import {authErrors, isAuthenticated, getUserId, getUserName, userInfo} from '../reducers'
import {apiSetting} from  '../actions/auth'
import Navbar from './Navbar'
const Docs = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <DocsView {...props}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  userName: getUserName(state),
  userId: getUserId(state),
  userInfo: userInfo(state)
})
const mapDispatchToProps = (dispatch) => ({
  onSubmit: (username, password) => {
    dispatch(apiSetting(username, password))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Docs);
