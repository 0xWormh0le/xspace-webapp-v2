import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth, * as fromAuth from './auth.js'
import profile, * as fromProfile from './profile.js'
import echo, * as fromEcho from './echo.js'
import products, * as fromProducts from './products.js'
import orders, * as fromOrders from './orders.js'

export default combineReducers({
  auth: auth,
  echo: echo,
  products: products,
  orders: orders,
  profile: profile,
  router: routerReducer,
})

// export const clearAccessToken = state => fromAuth.clearAccessToken(state.auth)
// export const clearIdToken = state => fromAuth.clearAccessToken(state.auth)
export const getUserId = state => fromAuth.getUserId(state.auth)
export const getUserName = state => fromAuth.getUserName(state.auth)
export const getBillingInfo = state => fromProfile.getBillingInfo(state.profile)
export const getBillingCheck = state => fromProfile.getBillingCheck(state.profile)
export const loadBillingSummary = state => fromProfile.loadBillingSummary(state.profile)
export const getCompanyInfo = state => fromProfile.getCompanyInfo(state.profile)
export const getDeleteFiles = state => fromProducts.getDeleteFiles(state.products)
export const isAuthenticated = state => fromAuth.isAuthenticated(state.auth)
export const accessToken = state => fromAuth.accessToken(state.auth)
export const isAccessTokenExpired = state => fromAuth.isAccessTokenExpired(state.auth)
export const refreshToken = state => fromAuth.refreshToken(state.auth)
export const isRefreshTokenExpired = state => fromAuth.isRefreshTokenExpired(state.auth)
export const authErrors = state => fromAuth.errors(state.auth)
export const serverMessage = state => fromEcho.serverMessage(state.echo)
export const getCreatedProduct = state => fromProducts.createdProduct(state.products)
export const getExcelQueuedProducts = state => fromProducts.excelQueuedProducts(state.products)
export const getImportedProducts = state => fromProducts.importQueuedProducts(state.products)
export const userInfo = state => fromProfile.getUserDetails(state.profile)
export const getXspaceProducts = state =>  fromProducts.importXspaceProducts(state.products)
export const getStoreProductCount = state => fromProducts.getProductCount(state.products)
export const getProductOrder = state => fromProducts.productOrder(state.products)
export const getMediaDict = state => fromProducts.getMediaDict(state.products)
export const getProductProfile = state => fromProducts.getProductProfile(state.products)
export const getProductUpdateStatus = state => fromProducts.getProductUpdateStatus(state.products)
export const getProductThread = state => fromProducts.commentProductThread(state.products)
export const getMessageCreationStatus = state => fromProducts.messageCreationStatus(state.products)
export const getContentStandard = state => fromProducts.getContentStandard(state.products)
export const getUploadFiles = state => fromProducts.uploadNewFile(state.products)
export const getCreateContentStandard = state => fromProducts.getCreateContentStandard(state.products)
export const getXEditWorkload = state => fromProducts.getXEditWorkload(state.products)
export const getAddress = state => fromOrders.getAddress(state.orders)
export const getURL = state => fromOrders.getURL(state.orders)
export const getCart = state => fromOrders.getCart(state.orders)
export const getFullOrder = state => fromOrders.getFullOrder(state.orders)
export const getOrderDownloads = state => fromOrders.getOrderDownloads(state.orders)
export const getAssetMultiUpload = state => fromProducts.getAssetMultiUpload(state.products)
export const getAssetMultiUploadProgress = state => fromProducts.getAssetMultiUploadProgress(state.products)
export const getAssetMultiUploadCounter = state => fromProducts.getAssetMultiUploadCounter(state.products)
export const getAssetMultiUploadTotal = state => fromProducts.getAssetMultiUploadTotal(state.products)
export const get2DFill = state => fromProfile.get2DFill(state.profile)
export const get360Fill = state => fromProfile.get360Fill(state.profile)
export const getNotifs = state => fromProfile.getNotifs(state.profile)
export const getOrgTicket = state => fromProfile.getOrgTicket(state.profile)

export function withAuth(headers={}) {
  // return (state) => ({
  //   ...headers,
  //   'Authorization': `Bearer ${accessToken(state)}`
  // })
  return (state) =>  {
    return {
      ...headers,
      'Authorization': `Bearer ${accessToken(state)}`
    }
  }
}

export function withSubdomain(headers={}) {
  return (state) => {
    let location = window.location.hostname
    let sub = location.split('.')[0];
    if (sub.includes("localhost"))
      sub = "localhost:3000"
    return {
      ...headers,
      'x-api-subdomain': sub
    }
  }
}

export function withAuthPlusSubdomain(headers={}) {
  return (state) => {
    let location = window.location.hostname
    let sub = location.split('.')[0];
    if (sub.includes("localhost"))
      sub = "localhost:3000"
    return {
      ...headers,
      'Authorization': `Bearer ${accessToken(state)}`,
      'x-api-subdomain': sub
    }
  }
}
