import { API_ROOT } from '../index';

import { RSAA } from 'redux-api-middleware';

import {withAuth, withAuthPlusSubdomain} from '../reducers'

export const PROD_CREATE_REQUEST = '@@echo/PRODUCT_CREATE_REQUEST';
export const PROD_CREATE_SUCCESS = '@@echo/PRODUCT_CREATE_SUCCESS';
export const PROD_CREATE_FAILURE = '@@echo/PRODUCT_CREATE_FAILURE';

export const PROD_UPDATE_REQUEST = '@@echo/PRODUCT_UPDATE_REQUEST';
export const PROD_UPDATE_SUCCESS = '@@echo/PRODUCT_UPDATE_SUCCESS';
export const PROD_UPDATE_FAILURE = '@@echo/PRODUCT_UPDATE_FAILURE';

export const PROD_FIND_REQUEST = '@@echo/PRODUCT_FIND_REQUEST';
export const PROD_FIND_SUCCESS = '@@echo/PRODUCT_FIND_SUCCESS';
export const PROD_FIND_FAILURE = '@@echo/PRODUCT_FIND_FAILURE';

export const PROD_UPLOAD_REQUEST = '@@echo/PRODUCT_UPLOAD_REQUEST';
export const PROD_UPLOAD_SUCCESS = '@@echo/PRODUCT_UPLOAD_SUCCESS';
export const PROD_UPLOAD_FAILURE = '@@echo/PRODUCT_UPLOAD_FAILURE';

export const MEDIA_UPLOAD_REQUEST = '@@echo/MEDIA_UPLOAD_REQUEST';
export const MEDIA_UPLOAD_SUCCESS = '@@echo/MEDIA_UPLOAD_SUCCESS';
export const MEDIA_UPLOAD_FAILURE = '@@echo/MEDIA_UPLOAD_FAILURE';

export const PROD_UPLOAD_MULT_REQUEST = '@@echo/PRODUCT_UPLOAD_MULT_REQUEST';
export const PROD_UPLOAD_MULT_SUCCESS = '@@echo/PRODUCT_UPLOAD_MULT_SUCCESS';
export const PROD_UPLOAD_MULT_FAILURE = '@@echo/PRODUCT_UPLOAD_MULT_FAILURE';

export const PROD_UPLOAD_SHOPIFY_REQUEST = '@@echo/PRODUCT_UPLOAD_SHOPIFY_REQUEST';
export const PROD_UPLOAD_SHOPIFY_SUCCESS = '@@echo/PRODUCT_UPLOAD_SHOPIFY_SUCCESS';
export const PROD_UPLOAD_SHOPIFY_FAILURE = '@@echo/PRODUCT_UPLOAD_SHOPIFY_FAILURE';

export const PROD_UPLOAD_MAGENTO_REQUEST = '@@echo/PRODUCT_UPLOAD_MAGENTO_REQUEST';
export const PROD_UPLOAD_MAGENTO_SUCCESS = '@@echo/PRODUCT_UPLOAD_MAGENTO_SUCCESS';
export const PROD_UPLOAD_MAGENTO_FAILURE = '@@echo/PRODUCT_UPLOAD_MAGENTO_FAILURE';

export const PROD_UPLOAD_WOOCOMMERCE_REQUEST = '@@echo/PRODUCT_UPLOAD_WOOCOMMERCE_REQUEST';
export const PROD_UPLOAD_WOOCOMMERCE_SUCCESS = '@@echo/PRODUCT_UPLOAD_WOOCOMMERCE_SUCCESS';
export const PROD_UPLOAD_WOOCOMMERCE_FAILURE = '@@echo/PRODUCT_UPLOAD_WOOCOMMERCE_FAILURE';

export const PROD_ORDER_WIZARD_REQUEST = '@@echo/PRODUCT_ORDER_WIZARD_REQUEST';
export const PROD_ORDER_WIZARD_SUCCESS = '@@echo/PRODUCT_ORDER_WIZARD_SUCCESS';
export const PROD_ORDER_WIZARD_FAILURE = '@@echo/PRODUCT_ORDER_WIZARD_FAILURE';

export const PROD_IMPORT_XSPACE_REQUEST = '@@echo/PROD_IMPORT_XSPACE_REQUEST';
export const PROD_IMPORT_XSPACE_SUCCESS = '@@echo/PROD_IMPORT_XSPACE_SUCCESS';
export const PROD_IMPORT_XSPACE_FAILURE = '@@echo/PROD_IMPORT_XSPACE_FAILURE';

export const EXPORT_TO_STORE_REQUEST = '@@echo/EXPORT_TO_STORE_REQUEST';
export const EXPORT_TO_STORE_SUCCESS = '@@echo/EXPORT_TO_STORE_SUCCESS';
export const EXPORT_TO_STORE_FAILURE = '@@echo/EXPORT_TO_STORE_FAILURE';

export const PROD_GET_ORDER_WIZARD_REQUEST = '@@echo/PRODUCT_GET_ORDER_WIZARD_REQUEST';
export const PROD_GET_ORDER_WIZARD_SUCCESS = '@@echo/PRODUCT_GET_ORDER_WIZARD_SUCCESS';
export const PROD_GET_ORDER_WIZARD_FAILURE = '@@echo/PRODUCT_GET_ORDER_WIZARD_FAILURE';

export const PRODUCT_ORDER_REQUEST = '@@echo/PRODUCT_ORDER_REQUEST';
export const PRODUCT_ORDER_SUCCESS = '@@echo/PRODUCT_ORDER_SUCCESS';
export const PRODUCT_ORDER_FAILURE = '@@echo/PRODUCT_ORDER_FAILURE';

export const PRODUCT_ORDER_TRACK_REQUEST = '@@echo/PRODUCT_ORDER_TRACK_REQUEST';
export const PRODUCT_ORDER_TRACK_SUCCESS = '@@echo/PRODUCT_ORDER_TRACK_SUCCESS';
export const PRODUCT_ORDER_TRACK_FAILURE = '@@echo/PRODUCT_ORDER_TRACK_FAILURE';

export const DOWNLOAD_PDF_REQUEST = '@@echo/DOWNLOAD_PDF_REQUEST';
export const DOWNLOAD_PDF_SUCCESS = '@@echo/DOWNLOAD_PDF_SUCCESS';
export const DOWNLOAD_PDF_FAILURE = '@@echo/DOWNLOAD_PDF_FAILURE';

export const QR_CODER_REQUEST = '@@echo/QR_CODER_REQUEST';
export const QR_CODER_SUCCESS = '@@echo/QR_CODER_SUCCESS';
export const QR_CODER_FAILURE = '@@echo/QR_CODER_FAILURE';

export const CAT_FIND_REQUEST = '@@echo/CAT_FIND_REQUEST';
export const CAT_FIND_SUCCESS = '@@echo/CAT_FIND_SUCCESS';
export const CAT_FIND_FAILURE = '@@echo/CAT_FIND_FAILURE';

export const COMMENT_THREAD_REQUEST = '@@echo/COMMENT_THREAD_REQUEST';
export const COMMENT_THREAD_SUCCESS = '@@echo/COMMENT_THREAD_SUCCESS';
export const COMMENT_THREAD_FAILURE = '@@echo/COMMENT_THREAD_FAILURE';

export const COMMENT_REQUEST = '@@echo/COMMENT_REQUEST';
export const COMMENT_SUCCESS = '@@echo/COMMENT_SUCCESS';
export const COMMENT_FAILURE = '@@echo/COMMENT_FAILURE';

export const CONTENTSTANDARD_REQUEST = '@@echo/CONTENTSTANDARD_REQUEST';
export const CONTENTSTANDARD_SUCCESS = '@@echo/CONTENTSTANDARD_SUCCESS';
export const CONTENTSTANDARD_FAILURE = '@@echo/CONTENTSTANDARD_FAILURE';

export const FILEUPLOAD_REQUEST = '@@echo/FILEUPLOAD_REQUEST';
export const FILEUPLOAD_SUCCESS = '@@echo/FILEUPLOAD_SUCCESS';
export const FILEUPLOAD_FAILURE = '@@echo/FILEUPLOAD_FAILURE';
export const FILEUPLOAD_PROGRESS = '@@echo/FILEUPLOAD_PROGRESS';

export const EDITING_FILEUPLOAD_REQUEST = '@@echo/EDITING_FILEUPLOAD_REQUEST';
export const EDITING_FILEUPLOAD_SUCCESS = '@@echo/EDITING_FILEUPLOAD_SUCCESS';
export const EDITING_FILEUPLOAD_FAILURE = '@@echo/EDITING_FILEUPLOAD_FAILURE';
export const EDITING_FILEUPLOAD_PROGRESS = '@@echo/EDITING_FILEUPLOAD_PROGRESS';

export const FILEDELETE_REQUEST = '@@echo/FILEDELETE_REQUEST';
export const FILEDELETE_SUCCESS = '@@echo/FILEDELETE_SUCCESS';
export const FILEDELETE_FAILURE = '@@echo/FILEDELETE_FAILURE';

export const ASSET_CREATE_REQUEST = '@@echo/ASSET_CREATE_REQUEST';
export const ASSET_CREATE_SUCCESS = '@@echo/ASSET_CREATE_SUCCESS';
export const ASSET_CREATE_FAILURE = '@@echo/ASSET_CREATE_FAILURE';
export const ASSET_CREATE_PROGRESS = '@@echo/ASSET_CREATE_PROGRESS';

export const CREATE_360_REQUEST = '@@echo/CREATE_360_REQUEST';
export const CREATE_360_SUCCESS = '@@echo/CREATE_360_SUCCESS';
export const CREATE_360_FAILURE = '@@echo/CREATE_360_FAILURE';

export const XEDIT_UPDATE_ASSET_REQUEST = '@@echo/XEDIT_UPDATE_ASSET_REQUEST';
export const XEDIT_UPDATE_ASSET_SUCCESS = '@@echo/XEDIT_UPDATE_ASSET_SUCCESS';
export const XEDIT_UPDATE_ASSET_FAILURE = '@@echo/XEDIT_UPDATE_ASSET_FAILURE';

export const SET_COUNTER = '@@asset/SET_COUNTER';
export const INCREMENT_COUNTER = '@@asset/INCREMENT_COUNTER';
export const XEDIT_WORKLOAD = '@@asset/XEDIT_WORKLOAD';

export const productCreate = (sku, name, price, height, width, length, description, category, manufacturer, upccode) => ({
  [RSAA]: {
      endpoint: API_ROOT + '/api/xspace-products/',
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({"SKU": sku, "name": name ,"price": price, "manufacturer": manufacturer, "category": category,
        "height": height, "width": width, "length": length,"description":description,"upccode":upccode}),
      types: [
        PROD_CREATE_REQUEST, PROD_CREATE_SUCCESS, PROD_CREATE_FAILURE
      ]
  }
})

export const productUpdate = (id, sku, name, price, height, width, length, description, category, manufacturer, upccode, upcType) => ({
  [RSAA]: {
      endpoint: API_ROOT + '/api/xspace-products/',
      method: 'PUT',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({"id":id, "SKU": sku, "name": name ,"price": price, "manufacturer": manufacturer, "category": category,
        "height": height, "width": width, "length": length,"description":description,"upccode":upccode, "upcType": upcType}),
      types: [
        PROD_UPDATE_REQUEST, PROD_UPDATE_SUCCESS, PROD_UPDATE_FAILURE
      ]
  }
})

export const categoriesFind = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/category/',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    types: [CAT_FIND_REQUEST, CAT_FIND_SUCCESS, CAT_FIND_FAILURE]
  }
})

export const productFind = (product_slug) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/xspace-products/?product_slug='+product_slug,
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    types: [
      PROD_FIND_REQUEST, PROD_FIND_SUCCESS, PROD_FIND_FAILURE
    ]
  }
})

export const productMultiUpload = (multi) => ({

  [RSAA]: {
      endpoint: API_ROOT + '/api/xspace-products/',
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(multi),
      types: [
        PROD_UPLOAD_REQUEST, PROD_UPLOAD_SUCCESS, PROD_UPLOAD_FAILURE
      ]
    }
})

export const productImportShopify = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/API2CartImportAPI/?cart_id=Shopify',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      PROD_UPLOAD_SHOPIFY_REQUEST, PROD_UPLOAD_SHOPIFY_SUCCESS, PROD_UPLOAD_SHOPIFY_FAILURE
    ]
  }
})

export const productImportStore = (storeType, pageCount) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/API2CartImportAPI/?cart_id='+storeType+"&pageCount="+pageCount,
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      PROD_UPLOAD_SHOPIFY_REQUEST, PROD_UPLOAD_SHOPIFY_SUCCESS, PROD_UPLOAD_SHOPIFY_FAILURE
    ]
  }
})

export const productImportXspace = (pageCount) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/xspace-products/?page='+pageCount,
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      PROD_IMPORT_XSPACE_REQUEST, PROD_IMPORT_XSPACE_SUCCESS, PROD_IMPORT_XSPACE_FAILURE
    ]
  }
})

export const productImportMagento = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/API2CartImportAPI/?cart_id=Magento1212',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      PROD_UPLOAD_MAGENTO_REQUEST, PROD_UPLOAD_MAGENTO_SUCCESS, PROD_UPLOAD_MAGENTO_FAILURE
    ]
  }
})

export const productImportWoocommerce = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/API2CartImportAPI/?cart_id=Woocommerce',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      PROD_UPLOAD_WOOCOMMERCE_REQUEST, PROD_UPLOAD_WOOCOMMERCE_SUCCESS, PROD_UPLOAD_WOOCOMMERCE_FAILURE
    ]
  }
})

export function productExcelUpload(file) {
  const data = new FormData();
  data.append('file', file);
  return {
    [RSAA]: {
      endpoint: API_ROOT + '/api/xspace-products/',
      method: 'POST',
      headers: withAuth(),
      body: data,
      types: [
        PROD_UPLOAD_REQUEST, PROD_UPLOAD_SUCCESS, PROD_UPLOAD_FAILURE
      ]
    }
  }
}

export function mediaUpload(zipfile, zip_dictionary){
  const data = new FormData();
  data.append('file', zipfile);
  data.append('FILES', zip_dictionary)
  return {
    [RSAA]: {
      endpoint: API_ROOT + '/api/upload/',
      method: 'POST',
      headers: withAuth(),
      // body: {'file': zipfile},
      body: data,
      types: [
        MEDIA_UPLOAD_REQUEST, MEDIA_UPLOAD_SUCCESS, MEDIA_UPLOAD_FAILURE
      ]
    }
  }
}

export function assetCreate(file) {
  const data = new FormData()
  data.append('file', file)
  data.append('description','This is a description');
  return {
    [RSAA]: {
      endpoint: API_ROOT + '/api/upload-asset/',
      method: 'POST',
      headers: withAuth(),
      body: data,
      types: [
        ASSET_CREATE_REQUEST,
        ASSET_CREATE_SUCCESS,
        ASSET_CREATE_FAILURE,
        ASSET_CREATE_PROGRESS
      ]
    }
  }
}

export function xEditSaveUpdatedAsset(payload) {
  // const data = new FormData()
  // data.append('data', payload.data)
  // console.log('payload', payload.data)
  return {
    [RSAA]: {
      endpoint: API_ROOT + '/api/xedit-asset/',
      method: 'POST',
      body: payload,
      headers: withAuth({'Content-Type': 'application/json'}),
      types: [
        XEDIT_UPDATE_ASSET_REQUEST, XEDIT_UPDATE_ASSET_SUCCESS, XEDIT_UPDATE_ASSET_FAILURE
      ]
    }
  }
}

export const incrementMultifleUploadCounter = (idx) => (
  {type: INCREMENT_COUNTER, idx}
)

export const setMultifileUploadCounter = (count) => (
  {type: SET_COUNTER, count}
)

export const setXEditWorkload = (value) => ({
  type: XEDIT_WORKLOAD,
  payload: value
})

export const productCreateOrder = (productArray) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/API2CartImportAPI/?cart_id=Woocommerce',
    method: 'POST',
    headers: withAuth(),
    body: productArray,
    types: [
      PROD_ORDER_WIZARD_REQUEST, PROD_ORDER_WIZARD_SUCCESS, PROD_ORDER_WIZARD_FAILURE
    ]
  }
})

export const exportToStore = (productArray) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/API2CartImportAPI/',
    method: 'PUT',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(productArray),
    types: [
      EXPORT_TO_STORE_REQUEST, EXPORT_TO_STORE_SUCCESS, EXPORT_TO_STORE_FAILURE
    ]
  }
})

export const getProduct = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/xspace-products/?page=1',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      PROD_GET_ORDER_WIZARD_REQUEST, PROD_GET_ORDER_WIZARD_SUCCESS, PROD_GET_ORDER_WIZARD_FAILURE
    ]
  }
})

export const productOrder = (pageCount) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/orders/?page='+pageCount,
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      PRODUCT_ORDER_REQUEST, PRODUCT_ORDER_SUCCESS, PRODUCT_ORDER_FAILURE
    ]
  }
})

export const addTrackingNumber = (orderTrack) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/order-track/',
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    body: JSON.stringify({'orderTrack': orderTrack}),
    types: [
      PRODUCT_ORDER_TRACK_REQUEST, PRODUCT_ORDER_TRACK_SUCCESS, PRODUCT_ORDER_TRACK_FAILURE
    ]
  }
})

export const generateOrderQrCode = (orderQr) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/order-qrcode/',
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    body: JSON.stringify({'orderQr': orderQr}),
    types: [
      QR_CODER_REQUEST, QR_CODER_SUCCESS, QR_CODER_FAILURE
    ]
  }
})

export const generatePdf = (orderId) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/order-qrcode/?orderId='+orderId,
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      DOWNLOAD_PDF_REQUEST, DOWNLOAD_PDF_SUCCESS, DOWNLOAD_PDF_FAILURE
    ]
  }
})

export const findMessageThread = (slug, itype, filename) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/product_message_thread' +'/product/' + slug + '/'+ itype + '/' + filename + '/',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      COMMENT_THREAD_REQUEST, COMMENT_THREAD_SUCCESS, COMMENT_THREAD_FAILURE
    ]
  }
})

export const createMessage = (threadId, payload) => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/product_message_thread/'+threadId +'/messages/',
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    body: JSON.stringify(payload),
    types: [
      COMMENT_REQUEST, COMMENT_SUCCESS, COMMENT_FAILURE
    ]
  }
})

export const createContentStandard = (payload) => ({

  [RSAA]: {
    endpoint: API_ROOT + '/api/content_standard/',
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    body: JSON.stringify(payload),
    types: [
      CONTENTSTANDARD_REQUEST, CONTENTSTANDARD_SUCCESS, CONTENTSTANDARD_FAILURE
    ]
  }
})

export const getContentStandard = () => ({
  [RSAA]: {
    endpoint: API_ROOT + '/api/content_standard/',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json'}),
    types: [
      CONTENTSTANDARD_REQUEST, CONTENTSTANDARD_SUCCESS, CONTENTSTANDARD_FAILURE
    ]
  }
})

export function uploadNewFile(product_slug, payload){
  const data2 = new FormData();
  data2.append('file', payload);
  return {
    [RSAA]: {
        endpoint: API_ROOT + '/api/upload/?product_slug='+product_slug,
        method: 'POST',
        body: data2,
        headers: withAuth(),
        types: [
          FILEUPLOAD_REQUEST, FILEUPLOAD_SUCCESS, FILEUPLOAD_FAILURE, FILEUPLOAD_PROGRESS
        ]
    },
  }
}

export function uploadEditingFile(editOrderID, payload){
  const data2 = new FormData();
  data2.append('file', payload);
  return {
    [RSAA]: {
        endpoint: API_ROOT + '/api/editing-upload/?orderID='+editOrderID,
        method: 'POST',
        body: data2,
        headers: withAuth(),
        types: [
          EDITING_FILEUPLOAD_REQUEST, EDITING_FILEUPLOAD_SUCCESS, EDITING_FILEUPLOAD_FAILURE, EDITING_FILEUPLOAD_PROGRESS
        ]
    },
  }
}

export function deleteFiles(product_slug, payload){
  const data2 = new FormData();
  data2.append('file', payload[0])
  data2.append('lastModified', payload[1]);
  return {
    [RSAA]: {
        endpoint: API_ROOT + '/api/delete_s3_file/?product_slug='+product_slug,
        method: 'POST',
        body: data2,
        headers: withAuth(),
        types: [
          FILEDELETE_REQUEST, FILEDELETE_SUCCESS, FILEDELETE_FAILURE
            ]
    },
  }
}

export function create360(product_slug, urlList, createdDateList){
  const data = {
    'slug': product_slug,
    'urlList': urlList,
    'lastModifiedList': createdDateList,
    'type': '1'
  }
  return {
    [RSAA]: {
      endpoint: API_ROOT + '/api/generate360/',
      method: 'POST',
      body: JSON.stringify(data),
      headers: withAuth({'Content-Type': 'application/json'}),
      types: [
        CREATE_360_REQUEST, CREATE_360_SUCCESS, CREATE_360_FAILURE
      ]
    },
  }
}
