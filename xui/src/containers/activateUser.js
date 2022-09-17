import React from 'react'
import { Redirect } from 'react-router'
import ActivateUserView from '../components/activateUserView'

const ActivateUser = (props) => {
  if(props.isAuthenticated) {
    return (
      <Redirect to='/' />
    )
  }
  return (
    <ActivateUserView {...props}/>
  )
}

export default ActivateUser;
