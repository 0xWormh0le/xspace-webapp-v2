import React from 'react'
import { Redirect } from 'react-router'
import ResetPasswordView from '../components/ResetPasswordView'

const ResetPassword = (props) => {
  if(props.isAuthenticated) {
    return (
      <Redirect to='/' />
    )
  }
  return (
    <ResetPasswordView {...props}/>
  )
}

export default ResetPassword;
