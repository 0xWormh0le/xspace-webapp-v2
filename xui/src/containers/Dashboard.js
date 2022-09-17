import React from 'react'
import { connect } from 'react-redux'
import DashboardView from '../components/DashboardView'
import Navbar from './Navbar';
import {authErrors, isAuthenticated, getUserId, getUserName, userInfo} from '../reducers'
import {apiSetting} from  '../actions/auth'
import {fill2DPhotosDB, fill360DB, getUserProfile, updateProfile } from  '../actions/profile'
import { Alert, Button, Jumbotron,  Form } from 'mdbreact'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Dashboard = (props) => {
  return (
    <div>
    <Navbar {...props}></Navbar>
    <DashboardView {...props}/>
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
  },
  loadProfileData: () => {
    dispatch(getUserProfile())
  },
  updateUserDetails: (data) => {
    dispatch(updateProfile(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
