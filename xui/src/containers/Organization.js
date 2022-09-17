import React from 'react'
import { connect } from 'react-redux'
import OrganizationView from '../components/OrganizationView'
import {authErrors, isAuthenticated, userInfo, getCompanyInfo} from '../reducers'
import {getUserProfile, updateProfile, retrieveCompany, updateCompany, updateProfilePic} from  '../actions/profile'
import Navbar from './Navbar'
const Organization = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <OrganizationView {...props}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  userInfo: userInfo(state),
  company: getCompanyInfo(state),
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
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Organization);
