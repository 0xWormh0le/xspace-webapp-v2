import React from 'react'
import { connect } from 'react-redux'
import AppsView from '../components/AppsView'
import {authErrors, isAuthenticated, userInfo} from '../reducers'
import {getUserProfile, updateProfile} from  '../actions/profile'
import * as reducers from '../reducers';

const Apps = (props) => {
  return (
    <AppsView {...props}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Apps);
