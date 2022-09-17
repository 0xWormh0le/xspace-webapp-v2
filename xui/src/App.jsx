import React from 'react';
import ReactDOM from 'react-dom';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider, connect } from 'react-redux'
import configureStore from './configureStore'
import { ConnectedRouter } from 'react-router-redux'
import { HashRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import createHistory from 'history/createBrowserHistory'
import registerServiceWorker from './registerServiceWorker';
import {apiSetting} from  './actions/auth'
import { Route, Switch } from 'react-router'
import Login from './containers/Login';
import Register from './containers/Register';
import PWReset from './containers/PWReset';
import About from './containers/About';
import Search from './containers/Search';
import Dashboard from './containers/Dashboard';
import Uploader from './containers/Uploader';
import PrivateRoute from './containers/PrivateRoute';
import ProductUpdate from './containers/ProductUpdates';
import ProductOrder from './containers/ProductOrder'
import ProductManage from './containers/ProductManage';
import ProductPreview from './containers/ProductPreview';
import ProductProfile from './containers/ProductProfile';
import ProductCreate from './containers/ProductCreate';
import OrderWizard from './containers/OrderWizard';
import OrderCreate from './containers/OrderCreate';
import MyAccount from './containers/MyAccount';
import EditAccount from './containers/EditAccount';
import Notification from './containers/Notification';
import Marketplace from './containers/Marketplace';
import ApiSetting from './containers/AddApiKeys';
import Invitations from './containers/Invitations';
import ActivateUser from './containers/activateUser';
import ResetPassword from './containers/ResetPassword';
import Billing from './containers/Billing';
import BillingPlan from './containers/BillingPlan';
import Invite from './containers/Invitations';
import Page404 from './containers/404'
import Docs from './containers/Docs'
import Organization from './containers/Organization';
import ShoppingCart from "./containers/ShoppingCart";
import XEdit from "./containers/XEdit";
import {authErrors, isAuthenticated, getUserId, getUserName, grabAccessToken, userInfo} from './reducers';
import ReactGA from 'react-ga';
import { API_ROOT } from './index'
ReactGA.initialize('UA-90551571-4'); //Unique Google Analytics tracking number

const { store, persistor } = configureStore();


const history = createHistory()

function connectWithStore(store, WrappedComponent, ...args) {
  let ConnectedWrappedComponent = connect(...args)(WrappedComponent)
  return function (props) {
    return <ConnectedWrappedComponent {...props} store={store} />
  }
}


history.listen((location, action) => {
  window.scrollTo(0, 0);
});

function updateRouting() {
  window.scrollTo(0, 0)
  ReactGA.pageview(window.location.hash);
}
const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  userName: getUserName(state),
  userId: getUserId(state),
  userInfo: userInfo(state),
})
const mapDispatchToProps = (dispatch) => ({
  onSubmit: (username, password) => {
    dispatch(apiSetting(username, password))
  },

})





const App = () => {

let data = mapStateToProps(store.getState());
// console.log(data)

let h = "https://dev-api.xspaceapp.com/api/css/index.css?user_id=" + String(data.userId)

  return (
  <React.Fragment>
   <head>
   <link rel = "stylesheet"
         type = "text/css"
         href = {h}/>
   </head>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter onUpdate={updateRouting}>
          <Switch>
            <Route exact path="/" component={Login}/>
            <Route path="/login" component={Login} />
            <Route path="/forgot" component={PWReset} />
            <Route path="/productsother" component={ProductPreview}/>
            <Route path="/register" component={Register} />
            <Route path="/useractivate/:uid/:token" component={ActivateUser} />
            <Route path="/resetpassword/:uid/:token" component={ResetPassword} />
            <Route path="/register/:uid/:token" component={Register} />
            <PrivateRoute path="/products/manage" component={ProductManage}/>
            <PrivateRoute path="/products/orders" component={ProductOrder}/>
            <PrivateRoute path="/dashboard" component={Dashboard}/>
            <PrivateRoute path="/invitation" component={Invite}/>
            <PrivateRoute path="/marketplace" component={Marketplace}/>
            <PrivateRoute path="/myaccount/setting" component={MyAccount}/>
            <PrivateRoute path="/myaccount/invitations" component={Invitations}/>
            <PrivateRoute path="/myaccount/edit" component={EditAccount}/>
            <PrivateRoute path="/myaccount/notification" component={Notification}/>
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
        </HashRouter>
      </PersistGate>
    </Provider>
    </React.Fragment>
  );
};


const ConnectedApp = connectWithStore(store, App, mapStateToProps, mapDispatchToProps,)

export default ConnectedApp;
