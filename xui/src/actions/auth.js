import { RSAA } from 'redux-api-middleware';

import { API_ROOT } from '../index'

export const LOGIN_REQUEST = '@@auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@@auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = '@@auth/LOGIN_FAILURE';
export const REGISTER_REQUEST = '@@auth/REGISTER_REQUEST';
export const REGISTER_SUCCESS = '@@auth/REGISTER_SUCCESS';
export const REGISTER_FAILURE = '@@auth/REGISTER_FAILURE';
export const LOGOUT_REQUEST = "@@auth/LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "@@auth/LOGOUT_SUCCESS";
export const TOKEN_REQUEST = '@@auth/TOKEN_REQUEST';
export const TOKEN_RECEIVED = '@@auth/TOKEN_RECEIVED';
export const TOKEN_FAILURE = '@@auth/TOKEN_FAILURE';

export const login = (email, password) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/auth/token/obtain/',
    method: 'POST',
    body: JSON.stringify({"username": email, "password": password}),
    headers: { 'Content-Type': 'application/json' },
    types: [
      LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE
    ]
  }
})

export const newRegister = (email, fname, lname, signupToken) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/user/signup/',
    method: 'POST',
    body: JSON.stringify({
      "email": email,
      "first_name": fname,
      "last_name": lname,
      "step": 1,
      "signupToken":signupToken,
    }),
    headers: { 'Content-Type': 'application/json' },
    types: [
      REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE
    ]
  }
})

export const subRegister = (email, fname, lname, password, signupToken) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/join_account_signup/'+signupToken+'/',
    method: 'POST',
    body: JSON.stringify({
      "email": email,
      "first_name": fname,
      "last_name": lname,
      "password": password,
      "signupToken":signupToken,
    }),
    headers: { 'Content-Type': 'application/json' },
    types: [
      REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE
    ]
  }
})

export const refreshAccessToken = (token) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/auth/token/refresh/',
    method: 'POST',
    body: JSON.stringify({refresh: token}),
    headers: { 'Content-Type': 'application/json' },
    types: [
      TOKEN_REQUEST, TOKEN_RECEIVED, TOKEN_FAILURE
    ]
  }
})

export const apiSetting = (cart_id, store_id, shopify_apikey, shopify_password, store_url, user_id, request_type) =>({
  [RSAA]: {
    endpoint: API_ROOT + '/api/api2CartTestConnection/',
    method: 'POST',
    body: JSON.stringify({cart_id, store_id, shopify_apikey, shopify_password, store_url, user_id, request_type}),
    headers: { 'Content-Type': 'application/json' },
    types: [
      TOKEN_REQUEST, TOKEN_RECEIVED, TOKEN_FAILURE
    ]
  }
})


// Logs the user out
export const logoutUser = () => ({

})

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  }
}

function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  }
}
