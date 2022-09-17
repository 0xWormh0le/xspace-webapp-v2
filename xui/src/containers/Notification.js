import React from 'react'
import { connect } from 'react-redux'
import  Notification  from '../components/NotificationView'
import {authErrors, isAuthenticated, getUserId, getUserName, userInfo, refreshToken} from '../reducers'
import {getUserProfile, updateProfile} from  '../actions/profile'
import {apiSetting} from  '../actions/auth'
import { Alert, Button, Jumbotron,  Form } from 'mdbreact'

import Navbar from './Navbar';
import Footer from './Footer'

import {login} from  '../actions/auth'

const Notifications = (props) => {
  return (
  <div>
  <Navbar {...props} />
    <Notification {...props} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  userId: getUserId(state),
  username: getUserName(state),
  userInfo: userInfo(state)
})

const mapDispatchToProps = (dispatch) => ({
  getUserInfo: () =>{
    dispatch(getUserProfile())
  },
  updateUserDetails: (data) => {
    dispatch(updateProfile(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
