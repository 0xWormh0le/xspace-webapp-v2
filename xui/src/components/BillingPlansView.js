import React, {Component} from 'react'
import styled, { css } from 'styled-components'
import { Link } from "react-router-dom"
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact'
import LeftSideMenu from './menu/LeftSideMenu';
import TextInput from '../lib/TextInput';
import { API_ROOT } from '../index';
import './billing/billing.css';
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from "mdbreact";
import { FlexView, LeftPanel, RightPanel } from './ecommerceapi/ApiKeyView'
import { Wrapper } from './MyAccountView'
import { BillingPlans } from '../constants'

const BillingWrapper = styled(Wrapper)`
  .billing-wrapper-body {
    padding: 80px 25px;
    padding-bottom: 50px;
    h3 {
      font-size: 18px;
      font-weight: 400;
      color: #333330;
      line-height: 26px;      
    }
    p {
      font-size: 14px;
      color: #333330;
      opacity: .5;
      line-height: 20px;
      max-width: 455px;
    }
    .flex-div {
      padding-top: 30px;
      display: flex;
    }
  }
`

const Card = styled.div`
  border-radius: 6px;
  margin-right: 7px;
  padding: 2px;
  border: ${p => p.active ? `2px solid ${p.color}` : '2px solid white'};
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  :hover {
    border: ${p => `2px solid ${p.color}`};
    .card-header {
      background-color: white;
      border-bottom: ${p => `2px solid ${p.color}`};
      color: ${p => p.color};
    }
  }
  div.card-header {
    height: 70px;
    background-color: ${p => p.color};
    border-bottom: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    i {
      position: absolute;
      right: 8px;
      top: 8px;
      font-size: 14px;
      color: white;
    }
    span {
      font-size: 14px;
      line-height: 20px;
    }
    ${p => p.active && css`
      background-color: white;
      border-bottom: ${p => `2px solid ${p.color}`};
    `}
  }
  div.card-body {
    padding: 15px;
    text-align: center;
    position: relative;
    b, p {
      font-size: 14px;
      color: #333330;
      line-height: 20px;
      display: block;
    }
    b {
      padding-bottom: 25px;
    }
    p {
      opacity: .5;
      margin: 0;
    }
    span {
      font-size: 12px;
      color: #00A3FF;
      line-height: 20px;
      bottom: 60px;
      position: absolute;
      width: 100%;
      text-align: center;
      display: block;
      padding-right: 30px;
    }
    button {
      width: 120px;
      height: 38px;
      border-radius: 19px;
      font-size: 14px;
      color: #333330;
      line-height: 20px;
      border: 2px solid #F4F5FA;
      background-color: transparent;
      margin-top: 45px;
      border-radius: 19px;
      font-weight: bold;
      :hover {
        background-color: ${p => p.color};
        color: white;
        border: none;
      }
    }
  }
`

export default class BillingPlansView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      username:'',
      email:'',
      mode: 0,
      checkoutPlanURL: '',
      billingPortalURL:'',

    };
    this.handleClick = this.handleClick.bind(this);
    this.getCheckoutURL = this.getCheckoutURL.bind(this);

    try{
      this.userData = JSON.parse(localStorage.getItem('persist:root'));
        const data = JSON.parse(this.userData['auth']);
        this.user_id = data['access']['user_id'];
    }catch(err){}
  }

  componentWillMount() {
    document.title = 'XSPACE | Billing'
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(this.props.billingLink !== nextProps.billingLink){
        if (nextProps.billingLink && nextProps.billingLink.checkoutPlanURL) {
          this.setState({ checkoutPlanURL: nextProps.billingLink.checkoutPlanURL }, () => {
            //window.open(this.state.checkoutPlanURL, '_blank')
            window.location.href = this.state.checkoutPlanURL
          })
        }
        if (nextProps.billingLink && nextProps.billingLink.billingPortalURL) {
          this.setState({ billingPortalURL: nextProps.billingLink.billingPortalURL })
        }
    }

  }

  componentDidUpdate(previousProps, prevState, snapshot){
    //console.log(previousProps);
    //console.log(this.props);

    if(this.props.billingLink !== previousProps.billingLink){
        //console.log(this.state.checkoutPlanURL);

        this.setState({ checkoutPlanURL: this.props.billingLink["checkoutPlanURL"] });
    }


    //this.setCheckoutURL(this.props);
    //get_billing_portal();

  }

  componentDidMount(){
    this.props.getBillingPortalRSAA();
  }

  getCheckoutURL(newProps){
       return newProps.billingLink["checkoutPlanURL"];
  }

  upgrade_billing_plan = (sub_btn) => {
  //this.props.getBillingPortalRSAA();
  console.log('sub_btn', sub_btn)
  let data = ''
    switch (sub_btn) {
        case 0:
            data = 'free-plan';
            this.props.updateBillingPortalRSAA(data);
            break;
        case 1:
            data = 'base-plan';
            //this.setState({ mode: sub_btn });
            this.props.updateBillingPortalRSAA(data);
            //var url = this.state.checkoutPlanURL;
            //console.log(url);
            //var win = window.open(url, '_blank');
            //win.focus();
            break;
        case 2:
            data = 'base-plus-plan';
            this.props.updateBillingPortalRSAA(data);
            //var url = this.state.checkoutPlanURL;
            //console.log(url);
            //var win = window.open(url, '_blank');
            //win.focus();
            break;
        case 3:
            data = 'brand-manager-plan';
            this.props.updateBillingPortalRSAA(data);
            //var url = this.props.billingLink["checkoutPlanURL"]
            //console.log(url);
            //var win = window.open(url, '_blank');
            //win.focus();
            break;
        case 4:
            data = 'brand-manager-plus-plan';
            this.props.updateBillingPortalRSAA(data);
            //var url = this.props.billingLink["checkoutPlanURL"]
            //console.log(url);
            //var win = window.open(url, '_blank');
            //win.focus();
            break;
        case 5:
            data = 'enterprise-plan';
            //this.props.updateBillingPortalRSAA(data);
            //var url = this.props.billingLink["checkoutPlanURL"]
            //console.log(url);
            const win = window.open("https://xspaceapp.com/contact-us/", '_blank');
            win.focus();
            break;
        case 6:
            data = 'additional-user-plan';
            //this.props.updateBillingPortalRSAA(data);
            //var url = this.props.billingLink["checkoutPlanURL"]
            //console.log(url);
            this.props.updateBillingPortalRSAA(data);
            //win.focus();
            break;
        default:
            return null;
    }


  }

  handleClick(e) {
    e.preventDefault();

    if(e.currentTarget.getAttribute('name')==="logout"){
      localStorage.clear();
      window.location.reload();
    }
  }

  render() {
    if(!this.user_id){
	    window.location.reload();
    }
    
    return (
      <div className="container">
        <FlexView>
          <LeftPanel>
            <LeftSideMenu key={5} data={this.props}/>
          </LeftPanel>
          <RightPanel>
            <BillingWrapper>
              <div className='wrapper-header'>
                <div>
                  <Link className="nav-link" to="/myaccount/billing">Summary</Link>
                  <Link className="nav-link active" to="/myaccount/plans">Plans</Link>
                  <Link className="nav-link" to={this.state.billingPortalURL}>Settings</Link>
                </div>
              </div>
              <div className='billing-wrapper-body'>
                <h3>Subscription Plans</h3>
                <p>
                  XSPACE offers flexible subscription plans for businesses of all sizes,
                  whether you are an individual, small business, or large enterprise.
                  Choose from six different plans to jump start your online product content.
                </p>
                <div className='flex-div'>
                  {BillingPlans.map((item) => 
                    <Card color={item.color} key={item.id}>
                      <div className='card-header'>
                        <span>{item.title}</span>
                        {item.id === 4 && <i className="fa fa-star" />}
                      </div>
                      <div className='card-body'>
                        <b>{item.price}</b>
                        <p>{item.products} Products</p>
                        <p>{item.storage} {item.id !==5 && 'GB Storage'}</p>
                        <p>{item.users} {item.users === 1 ? 'User' : 'Users'}</p>
                        <p>{item.access}</p>
                        {item.id === 4 && <span>Best Value</span>}
                        <button onClick={() => this.upgrade_billing_plan(item.id)}>Subscribe</button>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </BillingWrapper>
          </RightPanel>          
        </FlexView>
      </div>
  )
  }
}
