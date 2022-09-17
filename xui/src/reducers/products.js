import jwtDecode from 'jwt-decode'
import * as products from '../actions/products'

const initialState = {
    access: undefined,
    refresh: undefined,
    errors: {},
    xEditWorkload: {'originalAssets': [], 'maskAssets': []},
}

export default (state = initialState, action) => {
    switch (action.type) {
        case products.PROD_CREATE_REQUEST:
            return state
        case products.PROD_CREATE_SUCCESS:
            return {
                ...state,
                product: action.payload
            }
        case products.PROD_CREATE_FAILURE:
            return {
                ...state,
                product: action.payload
            }

        case products.CAT_FIND_REQUEST:
            return state
        case products.CAT_FIND_SUCCESS:
            return {
                ...state,
                categories: action.payload
            }
        case products.CAT_FIND_FAILURE:
            return {
                ...state
            }

        case products.PROD_UPDATE_REQUEST:
            return state
        case products.PROD_UPDATE_SUCCESS:
            return {
                ...state,
                productStatus: "success"
            }
        case products.PROD_UPDATE_FAILURE:
            return {
                ...state,
                productStatus: "failure"
            }

        case products.PROD_UPLOAD_REQUEST:
            return state
        case products.PROD_UPLOAD_SUCCESS:
            return {
                ...state,
                products: action.payload
            }
        case products.PROD_UPLOAD_FAILURE:
            return {
                ...state,
                products: action.payload
            }

        case products.MEDIA_UPLOAD_REQUEST:
            return state
        case products.MEDIA_UPLOAD_SUCCESS:
            return {
                ...state,
                proddict: action.payload
            }
        case products.MEDIA_UPLOAD_FAILURE:
            return {
                ...state,
                proddict: action.payload
            }

        case products.PROD_UPLOAD_MULT_REQUEST:
            return state
        case products.PROD_UPLOAD_MULT_SUCCESS:
            return {
                ...state,
                products: action.payload
            }
        case products.PROD_UPLOAD_MULT_FAILURE:
            return {
                ...state,
                products: action.payload
            }

        case products.EXPORT_TO_STORE_REQUEST:
            return state
        case products.EXPORT_TO_STORE_SUCCESS:
            return {
                ...state,
                products: action.payload
            }
        case products.EXPORT_TO_STORE_FAILURE:
            return {
                ...state,
                products: action.payload
            }

        case products.PROD_UPLOAD_SHOPIFY_REQUEST:
            return state
        case products.PROD_UPLOAD_SHOPIFY_SUCCESS:
            return {
                ...state,
                products: action.payload.result.product,
                product_counts: action.payload.total_counts
            }
        case products.PROD_UPLOAD_SHOPIFY_FAILURE:
            return {
                ...state,
                errors: action.payload
            }

        case products.PROD_UPLOAD_MAGENTO_REQUEST:
            return state
        case products.PROD_UPLOAD_MAGENTO_SUCCESS:
            return {
                ...state,
                products: action.payload.result.product
            }
        case products.PROD_UPLOAD_MAGENTO_FAILURE:
            return {
                ...state,
                errors: action.payload
            }

        case products.PROD_UPLOAD_WOOCOMMERCE_REQUEST:
            return state
        case products.PROD_UPLOAD_WOOCOMMERCE_SUCCESS:
            return {
                ...state,
                products: action.payload.result.product
            }
        case products.PROD_UPLOAD_WOOCOMMERCE_FAILURE:
            return {
                ...state,
                errors: action.payload
            }
        case products.PROD_IMPORT_XSPACE_REQUEST:
            return state
        case products.PROD_IMPORT_XSPACE_SUCCESS:
            return {
                ...state,
                products: action.payload
            }
        case products.PROD_IMPORT_XSPACE_FAILURE:
            return {
                ...state,
                products: action.payload
            }
        case products.PROD_ORDER_WIZARD_REQUEST:
            return state
        case products.PROD_ORDER_WIZARD_SUCCESS:
            return {
                ...state,
                products: action.payload.product
            }
        case products.PROD_ORDER_WIZARD_FAILURE:
            return {
                ...state,
                errors: action.payload
            }
        case products.PROD_GET_ORDER_WIZARD_REQUEST:
            return state
        case products.PROD_GET_ORDER_WIZARD_SUCCESS:
            return {
                ...state,
                products: action.payload.product
            }
        case products.PROD_GET_ORDER_WIZARD_FAILURE:
            return {
                ...state,
                products: action.payload.product
            }
        case products.PRODUCT_ORDER_REQUEST:
            return state
        case products.PRODUCT_ORDER_SUCCESS:
            return {
                ...state,
                products: action.payload
            }
        case products.PRODUCT_ORDER_FAILURE:
            return {
                ...state,
                products: action.payload
            }
        case products.QR_CODER_REQUEST:
            return state
        case products.QR_CODER_SUCCESS:
            return {
                ...state,
                products: action.payload
            }
        case products.QR_CODER_FAILURE:
            return {
                ...state,
                products: action.payload
            }
        case products.DOWNLOAD_PDF_REQUEST:
            return state
        case products.DOWNLOAD_PDF_SUCCESS:
            return {
                ...state,
                products: action.payload
            }
        case products.DOWNLOAD_PDF_FAILURE:
            return {
                ...state,
                products: action.payload
            }
        case products.PROD_FIND_SUCCESS:
            return {
                ...state,
                product: action.payload
            }
        case products.PROD_FIND_REQUEST:
            return {
                ...state,
            }
        case products.PROD_FIND_FAILURE:
            return {
                ...state,
            }

        case products.COMMENT_SUCCESS:
            return {
                ...state,
                response: action.payload
            }
        case products.COMMENT_REQUEST:
            return {
                ...state,
            }
        case products.COMMENT_FAILURE:
            return {
                ...state,
            }
        case products.COMMENT_THREAD_SUCCESS:
            return {
                ...state,
                response: action.payload
            }
        case products.COMMENT_THREAD_REQUEST:
            return {
                ...state,
            }
        case products.COMMENT_THREAD_FAILURE:
            return {
                ...state,
            }
        case products.CONTENTSTANDARD_SUCCESS:
            return {
                ...state,
                contentStandard: action.payload
            }
        case products.CONTENTSTANDARD_REQUEST:
            return {
                ...state,
            }
        case products.CONTENTSTANDARD_FAILURE:
            return {
                ...state,
                contentStandard: action.payload
            }
        case products.FILEUPLOAD_REQUEST:
            return {
                ...state,
                assetFiles: action.payload
            }
        case products.FILEUPLOAD_SUCCESS:
            return {
                ...state,
                newFiles: action.payload,
                assetFiles: action.payload,
                assetCounter: (state.assetCounter) ? state.assetCounter + 1 : 1
            }
        case products.FILEUPLOAD_FAILURE:
            return {
                ...state
            }
        case products.FILEUPLOAD_PROGRESS:
            return {
                ...state,
                assetFileProgress: action.payload
            }
        case products.FILEDELETE_SUCCESS:
            return {
                ...state,
                files: action.payload
            }
        case products.FILEDELETE_REQUEST:
            return {
                ...state,
            }
        case products.FILEDELETE_FAILURE:
            return {
                ...state,
            }
        case products.ASSET_CREATE_REQUEST:
            return {
                ...state,
                assetFiles: action.payload
            }
        case products.ASSET_CREATE_SUCCESS:
            return {
                ...state,
                assetFiles: action.payload,
                assetCounter: (state.assetCounter) ? state.assetCounter + 1 : 1
            }
        case products.ASSET_CREATE_FAILURE:
            return {
                ...state,
                assetFiles: action.payload
            }
        case products.ASSET_CREATE_PROGRESS:
            return {
                ...state,
                assetFileProgress: action.payload
            }
        case products.SET_COUNTER:
            return {
                ...state,
                assetTotal: action.count,
                assetCounter: 0
            }
        case products.INCREMENT_COUNTER:
            return {
                ...state,
                assetCounter: (state.assetCounter) ? state.assetCounter + 1 : 1
            }
        case products.XEDIT_WORKLOAD:
            return {
                ...state,
                xEditWorkload: action.payload
            }
        case products.XEDIT_UPDATE_ASSET_FAILURE:
            return {
                ...state,
            }
        case products.XEDIT_UPDATE_ASSET_SUCCESS:
            return {
                ...state,
            }
        case products.XEDIT_UPDATE_ASSET_REQUEST:
            return {
                ...state,
            }
        default:
            return state
    }
}

export function errors(state) {
    return state.errors
}

export function importQueuedProducts(state) {
    return state.products
}

export function importXspaceProducts(state) {
    return state.products
}

export function excelQueuedProducts(state) {
    return state.products
}

export function getProductCount(state) {
    return state.product_counts
}

export function productOrder(state) {
    return state.products
}

export function createdProduct(state) {
    if (state['product']) {
        return state.product
    }
}

export function getProductProfile(state) {
    if (state['product']) {
        return state.product
    }
}

export function importOrderProducts(state) {
    return state.products
}

export function getProductUpdateStatus(state) {
    return state.productStatus
}

export function commentProductThread(state) {
//  if (state['message']) {
    return state.response
//}
}

export function messageCreationStatus(state) {
    if (state['response']) {
        return state.response
    }
}

export function getContentStandard(state) {
    return state.contentStandard
}

export function getCreateContentStandard(state) {
    return state.contentStandard
}

export function uploadNewFile(state) {
    return state.newFiles
}

export function getDeleteFiles(state) {
    return state.files
}

export function getAssetMultiUpload(state) {
    return state.assetFiles
}

export function getAssetMultiUploadProgress(state) {
    return state.assetFileProgress
}

export function getAssetMultiUploadTotal(state) {
    return state.assetTotal
}

export function getAssetMultiUploadCounter(state) {
    return state.assetCounter
}

export function getMediaDict(state) {
    return state.proddict
}

export function getXEditWorkload(state) {
    return state.xEditWorkload
}

// export function xEditSaveUpdatedAsset(state) {
//     return state
// }