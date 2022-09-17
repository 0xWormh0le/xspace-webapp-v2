import React from 'react'
import { connect } from 'react-redux'
import EditProfile from '../components/EditAccountView'
import {authErrors, isAuthenticated, userInfo, } from '../reducers'
import Navbar from './Navbar'
import {apiSetting} from  '../actions/auth'
import {getUserProfile, updateProfile} from  '../actions/profile'
import * as reducers from '../reducers';
const EditProfileSetting = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <EditProfile {...props}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  userInfo: userInfo(state),
  accessToken:reducers.accessToken(state)
})
const mapDispatchToProps = (dispatch) => ({
  onSubmit: (username, password) => {
    dispatch(apiSetting(username, password))
  },
  getUserInfo: () => {
    dispatch(getUserProfile())
  },
  updateUserDetails: (data) => {
    dispatch(updateProfile(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileSetting);
