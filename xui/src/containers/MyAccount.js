import React from 'react'
import { connect } from 'react-redux'
import AccountSetting from '../components/MyAccountView'
import {authErrors, isAuthenticated, userInfo} from '../reducers'
import {getUserProfile, updateProfile} from  '../actions/profile'
import * as reducers from '../reducers';
import Navbar from './Navbar'
const Setting = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <AccountSetting {...props}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  userInfo: userInfo(state),
  userId: reducers.getUserId(state),
  accessToken: reducers.refreshToken(state)
})

const mapDispatchToProps = (dispatch) => ({
  getUserInfo: () =>{
    dispatch(getUserProfile())
  },
  updateUserDetails: (data) => {
    dispatch(updateProfile(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
