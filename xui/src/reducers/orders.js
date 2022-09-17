import * as orders from '../actions/orders'
const initialState = {
  message: ""
}
export default (state=initialState, action) => {
  switch(action.type) {
    case orders.ORDER_SUCCESS:
      return {
        ...state,
        message: action.payload.chargebeeURL

      }
    case orders.ORDER_FAILURE:
      return {
        message: action.payload.message
      }
    case orders.ORDER_REQUEST:
      return {
        ...state,
        message: action.payload
      }

    case orders.EDITING_ORDER_SUCCESS:
      return {
        ...state,
        cart: action.payload
      }
    case orders.EDITING_ORDER_FAILURE:
      return {
        cart: action.payload.message
      }
    case orders.EDITING_ORDER_REQUEST:
      return {
        ...state,
        cart: action.payload
      }

    case orders.FULL_ORDER_SUCCESS:
      return {
        ...state,
        cart: action.payload
      }
    case orders.FULL_ORDER_FAILURE:
      return {
        cart: action.payload.message
      }
    case orders.FULL_ORDER_REQUEST:
      return {
        ...state,
        cart: action.payload
      }

    case orders.GET_FULL_ORDERS_SUCCESS:
      return {
        ...state,
        fullOrder: action.payload
      }
    case orders.GET_FULL_ORDERS_FAILURE:
      return {
        fullOrder: action.payload.message
      }
    case orders.GET_FULL_ORDERS_REQUEST:
      return {
        ...state,
        fullOrder: action.payload
      }

    case orders.UPDATE_FULL_ORDERS_SUCCESS:
      return {
        ...state,
        fullOrder: action.payload
      }
    case orders.UPDATE_FULL_ORDERS_FAILURE:
      return {
        fullOrder: action.payload.message
      }
    case orders.UPDATE_FULL_ORDERS_REQUEST:
      return {
        ...state,
        fullOrder: action.payload
      }


    case orders.ADDRESS_SUCCESS:
      return {
        addresses: action.payload
      }
    case orders.ADDRESS_FAILURE:
      return {
        addresses: action.payload
      }
    case orders.ADDRESS_REQUEST:
      return {
        ...state
      }

    case orders.ORDER_DOWNLOAD_FAILURE:
      return {
        download: action.payload
      }
    case orders.ORDER_DOWNLOAD_REQUEST:
      return {
        ...state,
        download: action.payload
      }
    default:
      return {
        ...state
      }
  }
}

export const serverMessage = (state) => state.message

export function getURL(state) {
      return state.message
}

export function getCart(state) {
      return state.cart
}

export function getAddress(state) {
      return state.addresses
}

export function getOrderDownloads(state) {
      return state.download
}
export function getFullOrder(state) {
      return state.fullOrder
}
