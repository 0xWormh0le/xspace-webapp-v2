import React from 'react'
import { connect } from 'react-redux'
import InvitationView from '../components/InvitationView'
import {authErrors, isAuthenticated, userInfo, getBillingCheck} from '../reducers'
import {getUserProfile, updateProfile, runBillingCheck} from  '../actions/profile'
import Navbar from './Navbar'
const Invite = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <InvitationView {...props}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  userInfo: userInfo(state),
  billingCheck: getBillingCheck(state),
})

const mapDispatchToProps = (dispatch) => ({
  getUserInfo: () =>{
    dispatch(getUserProfile())
  },
  updateUserDetails: (data) => {
    dispatch(updateProfile(data))
  },
  runBillingCheck: () => {
    return dispatch(runBillingCheck())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Invite);
