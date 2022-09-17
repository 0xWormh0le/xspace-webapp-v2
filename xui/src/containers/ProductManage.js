import React from 'react'
import {connect} from 'react-redux'
import ProductManager from '../components/ProductManageView'
import * as reducers from '../reducers'
import Navbar from './Navbar'
// import mapDispatchToProps from "react-redux/lib/connect/mapDispatchToProps";
import {
    createContentStandard,
    getContentStandard,
    getProduct,
    productCreateOrder,
    uploadEditingFile,
    categoriesFind,
    productCreate,
    productExcelUpload,
    productMultiUpload,
    productImportShopify,
    productImportMagento,
    productImportWoocommerce,
    mediaUpload
} from "../actions/products";
import {addressPost, editOrderPost, saveFullOrderPost, runAudit, getAddresses, orderProductsPost} from "../actions/orders";
import {getBillingCheck, getCreatedProduct, getExcelQueuedProducts, getImportedProducts} from "../reducers";
import {getUserProfile, runBillingCheck} from "../actions/profile";

const ProductManage = (props) => {
    return (
        <div>
            <Navbar {...props}></Navbar>
            <ProductManager {...props}/>
        </div>
    )
}

const mapStateToProps = (state) => ({
    errors: reducers.authErrors(state),
    isAuthenticated: reducers.isAuthenticated(state),
    userId: reducers.getUserId(state),
    userInfo: reducers.userInfo(state),
    userName: reducers.getUserName(state),
    accessToken: reducers.refreshToken(state),
    // accessToken: reducers.accessToken(state),
    contentStandard: reducers.getContentStandard(state),
    contentStandardCreate: reducers.getCreateContentStandard(state),
    companyName: reducers.getCompanyInfo(state),
    excelProducts: reducers.getExcelQueuedProducts(state),
    importedProducts: reducers.getImportedProducts(state),
    createdProduct: reducers.getCreatedProduct(state),
    billingCheck: getBillingCheck(state),
    product: reducers.getProductProfile(state),
    cart: reducers.getCart(state),
    mediaUploadDict: reducers.getMediaDict(state)
})

const mapDispatchToProps = (dispatch) => ({
    getContentStandard: () => {
        dispatch(getContentStandard())
    },
    createContentStandard: (payload) => {
        dispatch(createContentStandard(payload))
    },
    productCreate: (sku, name, price, height, width, length, description, category, manufacturer, upccode) => {
        dispatch(productCreate(sku, name, price, height, width, length, description, category, manufacturer, upccode))
    },
    productUpload: (file) => {
        return dispatch(productExcelUpload(file))
    },
    productUploadMulti: (productArray) => {
        return dispatch(productMultiUpload(productArray))
    },
    importShopify: () => {
        dispatch(productImportShopify())
    },
    importMagento: () => {
        dispatch(productImportMagento())
    },
    importWoocommerce: () => {
        dispatch(productImportWoocommerce())
    },
    retrieveProducts: () => {
        return dispatch(categoriesFind())
    },
    runBillingCheck: () => {
        return dispatch(runBillingCheck())
    },
    loadProfileData: () => {
        dispatch(getUserProfile())
    },
    saveEditingOrder: (payload) => {
        dispatch(editOrderPost(payload))
    },
    saveFullOrder: (payload) => {
        dispatch(saveFullOrderPost(payload))
    },
    mediaUpload: (zipfile, zip_dictionary) => {
        return dispatch(mediaUpload(zipfile, zip_dictionary))
    },
    runAudit: (payload) => {
        return dispatch(runAudit(payload))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductManage);
//export default ProductManage;
