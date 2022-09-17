import jwtDecode from 'jwt-decode'
import * as profile from '../actions/profile'

const initialState = {
  access: undefined,
  refresh: undefined,
  errors: {},
}

export default (state=initialState, action) => {
  switch(action.type) {
    case profile.USER_DETAILS_REQUEST:
      return state
    case profile.USER_DETAILS_SUCCESS:
      return {
        ...state,
        userinfo: action.payload.result
      }
    case profile.USER_DETAILS_FAILURE:
      return{
        ...state,
        userinfo: action.payload
      }
    case profile.UPDATE_ROLE_REQUEST:
      return state
    case profile.UPDATE_ROLE_SUCCESS:
      return {
        ...state,
        userinfo: action.payload.result
      }
    case profile.UPDATE_ROLE_FAILURE:
      return{
        ...state,
        userinfo: action.payload
      }
    case profile.UPDATE_USER_REQUEST:
      return state
    case profile.UPDATE_USER_SUCCESS:
      return{
        ...state,
        userinfo: action.payload.result
      }
    case profile.UPDATE_USER_FAILURE:
      return{
        ...state,
        userinfo: action.payload
      }
    case profile.BILLING_PORTAL_REQUEST:
      return{
        ...state
      }
    case profile.BILLING_PORTAL_SUCCESS:
      return{
        ...state,
        billingLink: action.payload
      }
    case profile.BILLING_PORTAL_FAILURE:
      return{
        ...state,
        billingLink: action.payload
      }
    case profile.BILLING_CHECK_REQUEST:
      return{
        ...state
      }
    case profile.BILLING_CHECK_SUCCESS:
      return{
        ...state,
        billingCheck: action.payload
      }
    case profile.BILLING_CHECK_FAILURE:
      return{
        ...state,
        billingCheck: action.payload
      }

    case profile.BILLING_SUMMARY_REQUEST:
      return{
        ...state
      }
    case profile.BILLING_SUMMARY_SUCCESS:
      return{
        ...state,
        billingSummary: action.payload
      }
    case profile.BILLING_SUMMARY_FAILURE:
      return{
        ...state,
        billingSummary: action.payload
      }

    case profile.COMPANY_REQUEST:
      return{
        ...state
      }
    case profile.COMPANY_SUCCESS:
      return{
        ...state,
        company: action.payload
      }
    case profile.COMPANY_FAILURE:
      return{
        ...state,
        company: action.payload
      }
    case profile.FILL2D_REQUEST:
      return{
        ...state
      }
    case profile.FILL2D_SUCCESS:
      return{
        ...state,
        fill2D: action.payload
      }
    case profile.FILL2D_FAILURE:
      return{
        ...state,
        fill2D: action.payload
      }
    case profile.FILL360_REQUEST:
      return{
        ...state
      }
    case profile.FILL360_SUCCESS:
      return{
        ...state,
        fill360: action.payload
      }
    case profile.FILL360_FAILURE:
      return{
        ...state,
        fill360: action.payload
      }
    case profile.NOTIFICATION_REQUEST:
      return{
        ...state
      }
    case profile.NOTIFICATION_SUCCESS:
      return{
        ...state,
        notifs: action.payload
      }
    case profile.NOTIFICATION_FAILURE:
      return{
        ...state,
        notifs: action.payload
      }
    case profile.TICKET_REQUEST:
      return{
        ...state
      }
    case profile.TICKET_SUCCESS:
      return{
        ...state,
        tickets: action.payload
      }
    case profile.TICKET_FAILURE:
      return{
        ...state,
        tickets: action.payload
      }

    default:
      return state
  }
}

export function errors(state) {
  return state.errors
}

export function getUserDetails(state){
  return state.userinfo
}

export function getBillingInfo(state){
  return state.billingLink
}

export function getBillingCheck(state){
  return state.billingCheck
}

export function loadBillingSummary(state){
  return state.billingSummary
}

export function getCompanyInfo(state){
  return state.company
}

export function get2DFill(state){
  return state.fill2D
}

export function get360Fill(state){
  return state.fill360
}

export function getNotifs(state){
  return state.notifs
}

export function getOrgTicket(state){
  return state.tickets
}