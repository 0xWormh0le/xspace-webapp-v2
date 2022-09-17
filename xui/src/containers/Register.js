import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import RegisterMultiView from '../components/RegisterMultiView'
import {login, newRegister, subRegister} from  '../actions/auth' //register,
import {updateUserProfile, updateCompanyProfile} from  '../actions/profile'
import {authErrors, isAuthenticated} from '../reducers'

const Register = (props) => {
  if(props.isAuthenticated) {
    return (
      <Redirect to='/' />
    )
  }
  return (
    <div className="login-page" style={{backgroundImage: `url("/media/img/Prisma-Black.png")`}}>
      <RegisterMultiView {...props}/>
    </div>
  )
}
//----//
const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
})
const mapDispatchToProps = (dispatch) => ({
  login: (username, password) => {
    return dispatch(login(username, password))
  },
  /*
  onSubmit: (username, password) => {
    return dispatch(register(username, password))
  },*/
  onnewSubmit: (username, password, fname, lname, company, industry, companyRole, signupToken) => {
    return dispatch(newRegister(username, password, fname, lname, company, industry, companyRole, signupToken))
  },
  onSubSubmit: (email, fname, lname, password, signupToken) => {
    return dispatch(subRegister(email, fname, lname, password, signupToken))
  },
  onSubmitCompanyInfo: (id, company, industry, companyRole) => {
    return dispatch(updateCompanyProfile(id, company, industry, companyRole))
  },
  onSubmitPersonalInfo: (id, phoneNum, address1, address2, poBoxNum, cityName, state, zipCode, country) => {
    return dispatch(updateUserProfile(id, phoneNum, address1, address2, poBoxNum, cityName, state, zipCode, country))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Register);
