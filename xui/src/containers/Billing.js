import React from 'react'
import { connect } from 'react-redux'
import BillingSetting from '../components/BillingView'
import {authErrors, isAuthenticated, getUserId, getUserName, userInfo, getBillingInfo} from '../reducers'
import {updateEmail, updatePassword, getBillingPortal, updateBillingPortal} from  '../actions/profile'
import Navbar from './Navbar'
const Billing = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <BillingSetting {...props}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  userId: getUserId(state),
  userName: getUserName(state),
  userInfo: userInfo(state),
  billingLink: getBillingInfo(state)
})

const mapDispatchToProps = (dispatch) => ({
  updateEmail: (email) => {
    dispatch(updateEmail(email))
  },
  updatePassword: () => {
    dispatch(updatePassword())
  },
  getBillingPortalRSAA: () => {
    dispatch(getBillingPortal())
  },
  updateBillingPortalRSAA: (planType) => {
    dispatch(updateBillingPortal(planType))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Billing);
