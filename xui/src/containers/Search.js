import React from 'react'
import { connect } from 'react-redux'
import SearchView from '../components/SearchView'
import {login} from  '../actions/auth'

import {authErrors, isAuthenticated} from '../reducers'
const Search = (props) => {
  return (
    <SearchView {...props}/>
  )
}
const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state)
})
const mapDispatchToProps = (dispatch) => ({
  onSubmit: (username, password) => {
    dispatch(login(username, password))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Search);
