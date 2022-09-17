import React from 'react'
import { connect } from 'react-redux'
import ShoppingCarter from '../components/shoppingcart/ShoppingCartView'
import * as reducers from '../reducers'
import Navbar from './Navbar'
// import mapDispatchToProps from "react-redux/lib/connect/mapDispatchToProps";
import {
    createContentStandard,
    getContentStandard,
    categoriesFind,
    productCreate,
    productExcelUpload,
    productMultiUpload,
    productImportShopify,
    productImportMagento,
    productImportWoocommerce
} from "../actions/products";
import {getFullOrder, updateFullOrder, processEditingOrder} from "../actions/orders";
import {getBillingCheck, loadBillingSummary} from "../reducers";
import {runBillingCheck, getUserProfile, getBillingSummary} from "../actions/profile";
const ShoppingCart = (props) => {
    return (
        <div>
            <Navbar {...props}></Navbar>
            <ShoppingCarter {...props}/>
        </div>
    )
}

const mapStateToProps = (state) => ({
    errors: reducers.authErrors(state),
    accessToken: reducers.refreshToken(state),
    // accessToken: reducers.accessToken(state),
    isAuthenticated: reducers.isAuthenticated(state),
    userName: reducers.getUserName(state),
    userId: reducers.getUserId(state),
    userInfo: reducers.userInfo(state),
    contentStandard: reducers.getContentStandard(state),
    contentStandardCreate: reducers.getCreateContentStandard(state),
    companyName: reducers.getCompanyInfo(state),
    excelProducts: reducers.getExcelQueuedProducts(state),
    importedProducts: reducers.getImportedProducts(state),
    createdProduct: reducers.getCreatedProduct(state),
    billingCheck: getBillingCheck(state),
    // ProductOrder: reducers.getProductOrder(state),
    cart: reducers.getCart(state),
    billingSummary: loadBillingSummary(state),
    cartAllOrders: reducers.getFullOrder(state),

})

const mapDispatchToProps = (dispatch) => ({

    updateFullOrder: (payload) => {
        return dispatch(updateFullOrder(payload))
    },

    processEditingOrder: (payload) => {
        dispatch(processEditingOrder(payload))
    },

    getFullOrder: (payload) => {
        dispatch(getFullOrder(payload))
    },

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
    getBillingSummary: () => {
        return dispatch(getBillingSummary())
    },
    loadProfileData: () => {
        dispatch(getUserProfile())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
//export default ProductManage;
