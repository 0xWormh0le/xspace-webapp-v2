import React from 'react'
import { connect } from 'react-redux'
import SupportView from '../components/SupportView'
import {authErrors, isAuthenticated, userInfo, getCompanyInfo, getOrgTicket} from '../reducers'
import {getUserProfile, updateProfile, updateProfilePic, retrieveCompany, updateCompany, getOrganizationTickets, createZendeskTicket} from  '../actions/profile'

const Support = (props) => {
  return (
    <SupportView {...props}/>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  userInfo: userInfo(state),
  company: getCompanyInfo(state),
  tickets: getOrgTicket(state),
})

const mapDispatchToProps = (dispatch) => ({
  getUserInfo: () =>{
    dispatch(getUserProfile())
  },
  updateUserDetails: (data) => {
    dispatch(updateProfile(data))
  },
  updateUserProfilePicture: (data) => {
    dispatch(updateProfilePic(data))
  },
  retrieveCompany: () => {
    return dispatch(retrieveCompany())
  },
  updateCompany: (payload) => {
    return dispatch(updateCompany(payload))
  },
  getOrganizationTicket: () => {
    return dispatch(getOrganizationTickets())
  },
  createTicket: (subject, type, comment) => {
    return dispatch(createZendeskTicket(subject, type, comment))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Support);
