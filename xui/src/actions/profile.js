import { RSAA } from 'redux-api-middleware';
import { withAuth, withAuthPlusSubdomain } from '../reducers'
import { API_ROOT } from '../index'

export const ECHO_REQUEST = '@@echo/ECHO_REQUEST';
export const ECHO_SUCCESS = '@@echo/ECHO_SUCCESS';
export const ECHO_FAILURE = '@@echo/ECHO_FAILURE';

export const COMPANY_UPDATE_REQUEST = '@@echo/CU_REQUEST';
export const COMPANY_UPDATE_SUCCESS = '@@echo/CU_SUCCESS';
export const COMPANY_UPDATE_FAILURE = '@@echo/CU_FAILURE';

export const USER_UPDATE_REQUEST = '@@echo/UU_REQUEST';
export const USER_UPDATE_SUCCESS = '@@echo/UU_SUCCESS';
export const USER_UPDATE_FAILURE = '@@echo/UU_FAILURE';

export const UPDATE_EMAIL_REQUEST = '@@echo/UPDATE_EMAIL_REQUEST';
export const UPDATE_EMAIL_SUCCESS = '@@echo/UPDATE_EMAIL_SUCCESS';
export const UPDATE_EMAIL_FAILURE = '@@echo/UPDATE_EMAIL_FAILURE';

export const UPDATE_PASSWORD_REQUEST = '@@echo/UPDATE_PASSWORD_REQUEST';
export const UPDATE_PASSWORD_SUCCESS = '@@echo/UPDATE_PASSWORD_SUCCESS';
export const UPDATE_PASSWORD_FAILURE = '@@echo/UPDATE_PASSWORD_FAILURE';

export const USER_DETAILS_REQUEST = '@@echo/USER_DETAILS_REQUEST';
export const USER_DETAILS_SUCCESS = '@@echo/USER_DETAILS_SUCCESS';
export const USER_DETAILS_FAILURE = '@@echo/USER_DETAILS_FAILURE';

export const UPDATE_USER_PROFILE_REQUEST = '@@echo/UPDATE_USER_PROFILE_REQUEST';
export const UPDATE_USER_PROFILE_SUCCESS = '@@echo/UPDATE_USER_PROFILE_SUCCESS';
export const UPDATE_USER_PROFILE_FAILURE = '@@echo/UPDATE_USER_PROFILE_FAILURE'

export const UPDATE_FULLNAME_REQUEST = '@@echo/UPDATE_FULLNAME_REQUEST';
export const UPDATE_FULLNAME_SUCCESS = '@@echo/UPDATE_FULLNAME_SUCCESS';
export const UPDATE_FULLNAME_FAILURE = '@@echo/UPDATE_FULLNAME_FAILURE'

export const UPDATE_ROLE_REQUEST = '@@echo/UPDATE_ROLE_REQUEST';
export const UPDATE_ROLE_SUCCESS = '@@echo/UPDATE_ROLE_SUCCESS';
export const UPDATE_ROLE_FAILURE = '@@echo/UPDATE_ROLE_FAILURE';

export const UPDATE_PHONE_REQUEST = '@@echo/UPDATE_PHONE_REQUEST';
export const UPDATE_PHONE_SUCCESS = '@@echo/UPDATE_PHONE_SUCCESS';
export const UPDATE_PHONE_FAILURE = '@@echo/UPDATE_PHONE_FAILURE';

export const USER_PROFILE_PIC_REQUEST = '@@echo/USER_PROFILE_PIC_REQUEST'
export const USER_PROFILE_PIC_SUCCESS = '@@echo/USER_PROFILE_PIC_SUCCESS'
export const USER_PROFILE_PIC_FAILURE = '@@echo/USER_PROFILE_PIC_FAILURE'

export const UPDATE_USER_REQUEST = '@@echo/UPDATE_USER_REQUEST'
export const UPDATE_USER_SUCCESS = '@@echo/UPDATE_USER_SUCCESS'
export const UPDATE_USER_FAILURE = '@@echo/UPDATE_USER_FAILURE'

export const BILLING_PORTAL_REQUEST = '@@echo/BILLING_PORTAL_REQUEST'
export const BILLING_PORTAL_SUCCESS = '@@echo/BILLING_PORTAL_SUCCESS'
export const BILLING_PORTAL_FAILURE = '@@echo/BILLING_PORTAL_FAILURE'

export const BILLING_CHECK_REQUEST = '@@echo/BILLING_CHECK_REQUEST'
export const BILLING_CHECK_SUCCESS = '@@echo/BILLING_CHECK_SUCCESS'
export const BILLING_CHECK_FAILURE = '@@echo/BILLING_CHECK_FAILURE'

export const BILLING_SUMMARY_REQUEST = '@@echo/BILLING_SUMMARY_REQUEST'
export const BILLING_SUMMARY_SUCCESS = '@@echo/BILLING_SUMMARY_SUCCESS'
export const BILLING_SUMMARY_FAILURE = '@@echo/BILLING_SUMMARY_FAILURE'

export const COMPANY_REQUEST = '@@echo/COMPANY_REQUEST'
export const COMPANY_SUCCESS = '@@echo/COMPANY_SUCCESS'
export const COMPANY_FAILURE = '@@echo/COMPANY_FAILURE'

export const FILL2D_REQUEST = '@@echo/FILL2D_REQUEST'
export const FILL2D_SUCCESS = '@@echo/FILL2D_SUCCESS'
export const FILL2D_FAILURE = '@@echo/FILL2D_FAILURE'

export const FILL360_REQUEST = '@@echo/FILL360_REQUEST'
export const FILL360_SUCCESS = '@@echo/FILL360_SUCCESS'
export const FILL360_FAILURE = '@@echo/FILL360_FAILURE'

export const NOTIFICATION_REQUEST = '@@echo/NOTIFICATION_REQUEST'
export const NOTIFICATION_SUCCESS = '@@echo/NOTIFICATION_SUCCESS'
export const NOTIFICATION_FAILURE = '@@echo/NOTIFICATION_FAILURE'

export const UPDATE_NOTIFICATION_REQUEST = '@@echo/UPDATE_NOTIFICATION_REQUEST'
export const UPDATE_NOTIFICATION_SUCCESS = '@@echo/UPDATE_NOTIFICATION_SUCCESS'
export const UPDATE_NOTIFICATION_FAILURE = '@@echo/UPDATE_NOTIFICATION_FAILURE'

export const TICKET_REQUEST = '@@echo/TICKET_REQUEST'
export const TICKET_SUCCESS = '@@echo/TICKET_SUCCESS'
export const TICKET_FAILURE = '@@echo/TICKET_FAILURE'

export const TICKET_CREATE_REQUEST = '@@echo/TICKET_CREATE_REQUEST'
export const TICKET_CREATE_SUCCESS = '@@echo/TICKET_CREATE_SUCCESS'
export const TICKET_CREATE_FAILURE = '@@echo/TICKET_CREATE_FAILURE'


export const SET_COMPANY_REQUEST = '@@echo/SET_COMPANY_REQUEST'
export const SET_COMPANY_SUCCESS = '@@echo/SET_COMPANY_SUCCESS'
export const SET_COMPANY_FAILURE = '@@echo/SET_COMPANY_FAILURE'

export const COMPANY_LIST_REQUEST = '@@echo/COMPANY_LIST_REQUEST'
export const COMPANY_LIST_SUCCESS = '@@echo/COMPANY_LIST_SUCCESS'
export const COMPANY_LIST_FAILURE = '@@echo/COMPANY_LIST_FAILURE'


export const updateCompanyProfile = (id, companyName, industry, companyRole) => ({
  [RSAA]: {
      endpoint: API_ROOT + '/api/user/signup/',
      method: 'POST',
      body: JSON.stringify({"user_id": id, "companyName": companyName, "industry":industry, "companyRole":companyRole, "step": 2}),
      headers: { 'Content-Type': 'application/json' },
      types: [
        COMPANY_UPDATE_REQUEST, COMPANY_UPDATE_SUCCESS, COMPANY_UPDATE_FAILURE
      ]
  }
})
export const updateUserProfile = (id, phoneNum, address1, address2, poBoxNum, cityName, state, zipCode, country) => ({
  [RSAA]: {
      endpoint: API_ROOT + '/api/user/signup/',
      method: 'POST',
      body: JSON.stringify({"user_id":id,
              "phoneNum": phoneNum, "address1":address1,
              "address2": address2, "poBoxNum":poBoxNum, "cityName":cityName,
              "state":state, "zipCode":zipCode, "country":country, "step":3 }),
      headers: { 'Content-Type': 'application/json' },
      types: [
        USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAILURE
      ]
  }
})

export const updateEmail = (newEmail, password) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/userprofile/',
    method: 'PUT',
    headers: withAuth(),
    body: JSON.stringify({'email': newEmail, 'password': password}),
    types: [
      UPDATE_EMAIL_REQUEST, UPDATE_EMAIL_SUCCESS, UPDATE_EMAIL_FAILURE
    ]
  }
})

export const updatePassword = (newPassword, currentPassword) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/userprofile/',
    method: 'PUT',
    headers: withAuth(),
    body: JSON.stringify({'newpassord': newPassword, 'currentpassword': currentPassword}),
    types: [
      UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAILURE
    ]
  }
})

export const updateFullName = (fullname) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/userprofile/',
    method: 'PUT',
    headers: withAuth(),
    body: JSON.stringify({'fullname': fullname}),
    types: [
      UPDATE_FULLNAME_REQUEST, UPDATE_FULLNAME_SUCCESS, UPDATE_FULLNAME_FAILURE
    ]
  }
})

export const updateRole = (role) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/userprofile/',
    method: 'PUT',
    headers: withAuth(),
    body: JSON.stringify({'role': role}),
    types: [
      UPDATE_ROLE_REQUEST, UPDATE_ROLE_SUCCESS, UPDATE_ROLE_FAILURE
    ]
  }
})

export const updatePhone = (phone) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/userprofile/',
    method: 'PUT',
    headers: withAuth(),
    body: JSON.stringify({'phone': phone}),
    types: [
      UPDATE_PHONE_REQUEST, UPDATE_PHONE_SUCCESS, UPDATE_PHONE_FAILURE
    ]
  }
})

export const updateProfilePic = (data) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/userprofile/',
    method: 'PUT',
    headers: withAuth(),
    body: data,
    types: [
      USER_PROFILE_PIC_REQUEST, USER_PROFILE_PIC_SUCCESS, USER_PROFILE_PIC_FAILURE
    ]
  }
})

export const updateProfile = (data) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/userprofile/',
    method: 'PUT',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
    types: [
      UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE
    ]
  }
})



export const getUserProfile = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/userprofile/',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAILURE
    ]
  }
})

export const getNotifications = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/notifications/all/',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      NOTIFICATION_REQUEST, NOTIFICATION_SUCCESS, NOTIFICATION_FAILURE
    ]
  }
})

export const clearNotifications = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/notifications/mark_as_read/',
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      UPDATE_NOTIFICATION_REQUEST, UPDATE_NOTIFICATION_SUCCESS, UPDATE_NOTIFICATION_FAILURE
    ]
  }
})

export const getBillingPortal = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/billing_portal/',
    method: 'GET',

    headers: withAuthPlusSubdomain({ 'Content-Type': 'application/json'}),
    types: [
      BILLING_PORTAL_REQUEST, BILLING_PORTAL_SUCCESS, BILLING_PORTAL_FAILURE
    ]
  }
})

export const updateBillingPortal = (planType) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/billing_portal/',
    method: 'PUT',
    body: JSON.stringify({'planType': planType}),
    headers: withAuthPlusSubdomain({ 'Content-Type': 'application/json'}),
    types: [
      BILLING_PORTAL_REQUEST, BILLING_PORTAL_SUCCESS, BILLING_PORTAL_FAILURE
    ]
  }
})

export const runBillingCheck = () =>
({
  [RSAA]: {
    endpoint: API_ROOT + '/api/billing_check/',
    method: 'GET',
    headers: withAuthPlusSubdomain({ 'Content-Type': 'application/json'}),
    types: [
      BILLING_CHECK_REQUEST, BILLING_CHECK_SUCCESS, BILLING_CHECK_FAILURE
    ]
  }
})

export const getBillingSummary = () =>
({
  [RSAA]: {
    endpoint: API_ROOT + '/api/billing_summary/',
    method: 'GET',
    headers: withAuthPlusSubdomain({ 'Content-Type': 'application/json'}),
    types: [
      BILLING_SUMMARY_REQUEST, BILLING_SUMMARY_SUCCESS, BILLING_SUMMARY_FAILURE
    ]
  }
})


export const retrieveCompany = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/company/',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      COMPANY_REQUEST, COMPANY_SUCCESS, COMPANY_FAILURE
    ]
  }
})

export const updateCompany = (payload) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/company/',
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      COMPANY_REQUEST, COMPANY_SUCCESS, COMPANY_FAILURE
    ]
  }
})

export const fill2DPhotosDB = (productSlug) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/get_2dfill_db/'+ productSlug + '/',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      FILL2D_REQUEST, FILL2D_SUCCESS, FILL2D_FAILURE
    ]
  }
})

export const fill360DB = (productSlug) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/get_fill_db/'+ productSlug + '/',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      FILL360_REQUEST, FILL360_SUCCESS, FILL360_FAILURE
    ]
  }
})

export const getOrganizationTickets = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/tickets/all/',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      TICKET_REQUEST, TICKET_SUCCESS, TICKET_FAILURE
    ]
  }
})

export const createZendeskTicket = (subject, type, comment) => ({
  [RSAA]: {
      endpoint: API_ROOT + '/api/tickets/',
      method: 'POST',
      body: JSON.stringify({"subject":subject, "type": type, "comment":comment}),
      headers: withAuth({ 'Content-Type': 'application/json'}),
      types: [
        TICKET_CREATE_REQUEST, TICKET_CREATE_SUCCESS, TICKET_CREATE_FAILURE
      ]
  }
})

export const getCompanyList = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/companylist/',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      COMPANY_LIST_REQUEST, COMPANY_LIST_SUCCESS, COMPANY_LIST_FAILURE
    ]
  }
})

export const setViewingCompanyId = (companyId) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/companylist/',
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    body: JSON.stringify({"companyId":companyId}),
    types: [
      SET_COMPANY_REQUEST, SET_COMPANY_SUCCESS, SET_COMPANY_FAILURE
    ]
  }
})


/* */
