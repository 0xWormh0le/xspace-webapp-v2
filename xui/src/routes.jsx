import React from 'react'
import { Route, Switch } from 'react-router'
import PrivateRoute from './containers/PrivateRoute'

import Login from './containers/Login'
import Register from './containers/Register'
import PWReset from './containers/PWReset'
import About from './containers/About'
import Search from './containers/Search'
import Dashboard from './containers/Dashboard'
import Uploader from './containers/Uploader'
import ProductUpdate from './containers/ProductUpdates'
import ProductOrder from './containers/ProductOrder'
import ProductManage from './containers/ProductManage'
import ProductPreview from './containers/ProductPreview'
import ProductProfile from './containers/ProductProfile'
import ProductCreate from './containers/ProductCreate'
import OrderWizard from './containers/OrderWizard'
import OrderCreate from './containers/OrderCreate'
import MyAccount from './containers/MyAccount'
import EditAccount from './containers/EditAccount'
import Notification from './containers/Notification'
import Marketplace from './containers/Marketplace'
import ApiSetting from './containers/AddApiKeys'
import Invitations from './containers/Invitations'
import ActivateUser from './containers/activateUser'
import ResetPassword from './containers/ResetPassword'
import Billing from './containers/Billing'
import BillingPlan from './containers/BillingPlan'
import Invite from './containers/Invitations'
import Page404 from './containers/404'
import Docs from './containers/Docs'
import Support from './containers/Support'
import Organization from './containers/Organization'
import Apps from './containers/Apps'
import Onboarding from './containers/OnBoarding'
import Navbar from './containers/Navbar'
import Footer from './containers/Footer'
import WhitelabelPreview from './containers/WhitelabelPreview'
import ShoppingCart from "./containers/ShoppingCart";
import XEdit from "./containers/XEdit";

// commit
const Routes = (
  <div>
    <Navbar />
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/login" component={Login} />
        <Route path="/forgot" component={PWReset} />
        <Route path="/productsother" component={ProductPreview}/>
        <Route path="/register" component={Register} />
        <Route path="/useractivate/:uid/:token" component={ActivateUser} />
        <Route path="/resetpassword/:uid/:token" component={ResetPassword} />
        <Route path="/register/:token" component={Register} />
        <PrivateRoute path="/products/manage" component={ProductManage}/>
        <PrivateRoute path="/products/orders" component={ProductOrder}/>
        <PrivateRoute path="/dashboard" component={Dashboard}/>
        <PrivateRoute path="/onboarding" component={Onboarding}/>
        <PrivateRoute path="/invitation" component={Invite}/>
        <PrivateRoute path="/marketplace" component={Marketplace}/>
        <PrivateRoute path="/support" component={Support}/>
        <PrivateRoute path="/support/tickets/:id" component={Support}/>
        <PrivateRoute path="/myaccount/setting" component={MyAccount}/>
        <PrivateRoute path="/myaccount/apps" component={Apps}/>
        <PrivateRoute path="/myaccount/invitations" component={Invitations}/>
        <PrivateRoute path="/myaccount/edit" component={EditAccount}/>
        <PrivateRoute path="/myaccount/notification" component={Notification}/>
        <PrivateRoute path="/myaccount/whitelabel" component={WhitelabelPreview}/>
        <PrivateRoute exact path="/myaccount/organization" component={Organization}/>
        <PrivateRoute exact path="/myaccount/billing" component={Billing}/>
        <PrivateRoute exact path="/myaccount/plans" component={BillingPlan}/>
        <PrivateRoute path="/addtocart/addapikey" component={ApiSetting}/>
        <PrivateRoute exact path="/order/wizard" component={OrderWizard}/>
        <PrivateRoute exact path="/order/wizard/confirm" component={OrderWizard}/>
        <PrivateRoute path="/product/:id" component={ProductProfile}/>
        <PrivateRoute path="/search" component={Search}/>
        <PrivateRoute exact path="/products/update" component={ProductUpdate}/>
        <PrivateRoute exact path="/products/create" component={ProductCreate}/>
        <PrivateRoute exact path="/order/create" component={OrderCreate}/>
        <PrivateRoute exact path="/docs" component={Docs}/>
        <PrivateRoute exact path="/uploader" component={Uploader}/>
        <PrivateRoute exact path="/shoppingcart" component={ShoppingCart}/>
        <PrivateRoute exact path="/product-asset/editor" component={XEdit}/>
        <Route component={Page404}/>
      </Switch>
    <Footer />
    <Uploader />
  </div>
)

export default Routes
