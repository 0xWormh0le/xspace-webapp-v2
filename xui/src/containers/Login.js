import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import LoginView from '../components/LoginView'
import {login} from  '../actions/auth'
import {echo} from '../actions/echo'
import styled from 'styled-components'

import {authErrors, isAuthenticated} from '../reducers'

const L = styled.div`
  margin-top: -80px;
  margin-bottom: -80px;
`

const Login = (props) => {
  if(props.isAuthenticated) {
    return (
      <Redirect to='/dashboard' />
    )
  }
  return (
    <L><div style={{backgroundImage: `url("Prisma-Black.png")`}}>
      <LoginView {...props}/>
    </div></L>
  )
}
//**//
const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state)
})
const mapDispatchToProps = (dispatch) => ({
  onSubmit: (username, password) => {
    return dispatch(login(username, password))
  },
  statusCheck: () => {
    return dispatch(echo())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
