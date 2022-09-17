import React from 'react'
import { connect } from 'react-redux'
import NavbarView from '../components/NavbarView'
import {logout} from  '../actions/auth'
import {authErrors, isAuthenticated, getUserId, getUserName, userInfo, getNotifs} from '../reducers'
import {getUserProfile, getNotifications, clearNotifications, getCompanyList, setViewingCompanyId} from  '../actions/profile'

const Navbar = (props) => {
  return (
    <NavbarView {...props}></NavbarView>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: isAuthenticated(state),
  userId: getUserId(state),
  username: getUserName(state),
  notifs: getNotifs(state),
  userInfo: userInfo(state)
})

const mapDispatchToProps = (dispatch) => ({
  getUserInfo: () =>{
    return dispatch(getUserProfile())
  },
  getNotifs: () =>{
    dispatch(getNotifications())
  },
  getCompanyList: () => {
    return dispatch(getCompanyList())
  },
  updateCompany: (uniqueId) => {
    return dispatch(setViewingCompanyId(uniqueId))
  },
  clearNotifs: () =>{
    dispatch(clearNotifications())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
