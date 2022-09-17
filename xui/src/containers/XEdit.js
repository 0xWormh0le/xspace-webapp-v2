import React from 'react'
import {connect} from 'react-redux'
import XeditView from "../components/xedit/xeditView";
import * as reducers from '../reducers'
import Navbar from './Navbar'
// import mapDispatchToProps from "react-redux/lib/connect/mapDispatchToProps";
import { getContentStandard, xEditSaveUpdatedAsset } from "../actions/products";
import { editOrderPost, saveFullOrderPost, getFullOrder } from "../actions/orders";
import { getBillingCheck } from "../reducers";
import { getUserProfile } from "../actions/profile";

const XEdit = (props) => {
    return (
        <div>
            <Navbar {...props}/>
            <XeditView {...props}/>
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
    companyName: reducers.getCompanyInfo(state),
    billingCheck: getBillingCheck(state),
    product: reducers.getProductProfile(state),
    cart: reducers.getCart(state),
    order: reducers.getFullOrder(state),
    getXEditWorkload: reducers.getXEditWorkload(state)
})

const mapDispatchToProps = (dispatch) => ({
    getContentStandard: () => {
        dispatch(getContentStandard())
    },
    getFullOrder: (payloadWithOrderId) => {
        dispatch(getFullOrder(payloadWithOrderId))
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
    saveAsset: (payload) => {
        dispatch(xEditSaveUpdatedAsset(payload))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(XEdit);
