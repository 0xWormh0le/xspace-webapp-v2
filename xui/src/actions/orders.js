import { API_ROOT } from '../index';
import { RSAA } from 'redux-api-middleware';
import { withAuth, withAuthPlusSubdomain } from '../reducers'
export const ORDER_REQUEST = '@@order/ORDER_REQUEST';
export const ORDER_SUCCESS = '@@order/ORDER_SUCCESS';
export const ORDER_FAILURE = '@@order/ORDER_FAILURE';

export const EDITING_ORDER_REQUEST = '@@order/EDITING_ORDER_REQUEST';
export const EDITING_ORDER_SUCCESS = '@@order/EDITING_ORDER_SUCCESS';
export const EDITING_ORDER_FAILURE = '@@order/EDITING_ORDER_FAILURE';

export const FULL_ORDER_REQUEST = '@@order/FULL_ORDER_REQUEST';
export const FULL_ORDER_SUCCESS = '@@order/FULL_ORDER_SUCCESS';
export const FULL_ORDER_FAILURE = '@@order/FULL_ORDER_FAILURE';

export const GET_FULL_ORDERS_REQUEST = '@@order/GET_FULL_ORDERS_REQUEST';
export const GET_FULL_ORDERS_SUCCESS = '@@order/GET_FULL_ORDERS_SUCCESS';
export const GET_FULL_ORDERS_FAILURE = '@@order/GET_FULL_ORDERS_FAILURE';

export const UPDATE_FULL_ORDERS_REQUEST = '@@order/UPDATE_FULL_ORDERS_REQUEST';
export const UPDATE_FULL_ORDERS_SUCCESS = '@@order/UPDATE_FULL_ORDERS_SUCCESS';
export const UPDATE_FULL_ORDERS_FAILURE = '@@order/UPDATE_FULL_ORDERS_FAILURE';

export const ADDRESS_REQUEST = '@@order/ADDRESS_REQUEST';
export const ADDRESS_SUCCESS = '@@order/ADDRESS_SUCCESS';
export const ADDRESS_FAILURE = '@@order/ADDRESS_FAILURE';

export const RUN_AUDIT_REQUEST = '@@order/RUN_AUDIT_REQUEST';
export const RUN_AUDIT_SUCCESS = '@@order/RUN_AUDIT_SUCCESS';
export const RUN_AUDIT_FAILURE = '@@order/RUN_AUDIT_FAILURE';

export const ORDER_DOWNLOAD_REQUEST = '@@order/ORDER_DOWNLOAD_REQUEST';
export const ORDER_DOWNLOAD_SUCCESS = '@@order/ORDER_DOWNLOAD_SUCCESS';
export const ORDER_DOWNLOAD_FAILURE = '@@order/ORDER_DOWNLOAD_FAILURE';

export const PROCESS_EDITING_ORDER_REQUEST = '@@order/PROCESS_EDITING_ORDER_REQUEST';
export const PROCESS_EDITING_ORDER_SUCCESS = '@@order/PROCESS_EDITING_ORDER_SUCCESS';
export const PROCESS_EDITING_ORDER_FAILURE = '@@order/PROCESS_EDITING_ORDER_FAILURE';

export const orderProductsPost = (batches) => ({
  [RSAA]: {
      endpoint: API_ROOT + '/api/orders/',
      method: 'POST',
      body: JSON.stringify(batches),
      headers: withAuthPlusSubdomain({ 'Content-Type': 'application/json' }),
      types: [
        ORDER_REQUEST, ORDER_SUCCESS, ORDER_FAILURE
      ]
  }
})

export const editOrderPost = (payload) => ({
  [RSAA]: {
      endpoint: API_ROOT + '/api/editing-order/',
      method: 'POST',
      body: JSON.stringify(payload),
      headers: withAuthPlusSubdomain({ 'Content-Type': 'application/json' }),
      types: [
        EDITING_ORDER_REQUEST, EDITING_ORDER_SUCCESS, EDITING_ORDER_FAILURE
      ]
  }
})

export const saveFullOrderPost = (payload) => ({
    [RSAA]: {
        endpoint: API_ROOT + '/api/full-order/',
        method: 'POST',
        body: JSON.stringify(payload),
        headers: withAuthPlusSubdomain({ 'Content-Type': 'application/json' }),
        types: [
            FULL_ORDER_REQUEST, FULL_ORDER_SUCCESS, FULL_ORDER_FAILURE
        ]
    }
})

export const getFullOrder = (payload) => ({
  [RSAA]: {
      endpoint: API_ROOT + '/api/full-order/',
      method: 'GET',
      body: JSON.stringify(payload),
      headers: withAuthPlusSubdomain({ 'Content-Type': 'application/json' }),
      types: [
        GET_FULL_ORDERS_REQUEST, GET_FULL_ORDERS_SUCCESS, GET_FULL_ORDERS_FAILURE
      ]
  }
})

export const updateFullOrder = (payload) => ({
    [RSAA]: {
        endpoint: API_ROOT + '/api/full-order/',
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: withAuthPlusSubdomain({ 'Content-Type': 'application/json' }),
        types: [
            UPDATE_FULL_ORDERS_REQUEST, UPDATE_FULL_ORDERS_SUCCESS, UPDATE_FULL_ORDERS_FAILURE
        ]
    }
})

export const getAddresses = () => ({
  [RSAA]: {
      endpoint: API_ROOT + '/api/address/',
      method: 'GET',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        ADDRESS_REQUEST, ADDRESS_SUCCESS, ADDRESS_FAILURE
      ]
  }
})

export const processEditingOrder = (payload) => ({
    [RSAA]: {
        endpoint: API_ROOT + '/api/processEditingOrder/',
        method: 'POST',
        body: JSON.stringify(payload),
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [
            PROCESS_EDITING_ORDER_REQUEST, PROCESS_EDITING_ORDER_SUCCESS, PROCESS_EDITING_ORDER_FAILURE
        ]
    }
})

export const addressPost = (address) => ({
  [RSAA]: {
      endpoint: API_ROOT + '/api/address/',
      method: 'POST',
      body: JSON.stringify(address),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        ADDRESS_REQUEST, ADDRESS_SUCCESS, ADDRESS_FAILURE
      ]
  }
})

export const getOrderDownloadsAction = (orderID) => ({
  [RSAA]: {
      endpoint: API_ROOT + '/api/orders/download/'+orderID+'/',
      method: 'GET',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        ORDER_DOWNLOAD_REQUEST, ORDER_DOWNLOAD_SUCCESS, ORDER_DOWNLOAD_FAILURE
      ]
  }
})

export const runAudit = (payload) => ({
    [RSAA]: {
        endpoint: API_ROOT + '/api/audit/',
        method: 'POST',
        body: JSON.stringify(payload),
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [
            RUN_AUDIT_REQUEST, RUN_AUDIT_SUCCESS, RUN_AUDIT_FAILURE
        ]
    }
})
