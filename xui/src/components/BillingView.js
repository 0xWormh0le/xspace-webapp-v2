import React, {Component} from 'react'
import styled from 'styled-components'
import {Link} from "react-router-dom"
import {MDBAlert, MDBBtn, MDBContainer, MDBDataTable, Progress} from 'mdbreact'
import './billing/billing.css';
import LeftSideMenu from './menu/LeftSideMenu';
import {API_ROOT} from '../index';
import axios from 'axios';
import {FlexView, LeftPanel, RightPanel} from './ecommerceapi/ApiKeyView'
import {Wrapper} from './MyAccountView'
import {StyledTable} from '../lib/styled-table'

const BillingWrapper = styled(Wrapper)`
  .billing-wrapper-body {
    display: flex;
    padding: 80px 25px;
    padding-bottom: 0;
    p, span, b {
      font-size: 14px;
      line-height: 20px;
      color: #333330;
      margin: 0;
    }
    p {
      opacity: .5;
    }
    .left-panel {
      width: 445px;
      div.details {
        padding-bottom: 32px;
      }
      h3 {
        font-size: 18px;
        font-weight: 400;
        line-height: 26px;
        color: #333330;
      }
      .progress {
        margin: 5px 0;
      }      
    }
    .right-panel {
      & > div {
        padding-left: 45px;
      }
      a {
        margin-top: 48px;
        background-color: #00A3FF;
        width: 105px;
        height: 26px;
        border-radius: 13px;
        color: white;
        font-size: 12px;
        line-height: 20px;
        font-weight: bold;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        :hover {
          box-shadow: 2px 8px 6px rgba(0, 0, 0, 0.35);
        }
      }
    }
  }
  h4 {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    font-weight: bold;
    padding-left: 25px;
  }
`

export default class Billing extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
    user:'',
      username:'',
      email:'',
      billingPortalURL:'',
      nextInvoiceDate: '',
      maxNumberOfUsers:'',
      storageMax:'',
      currentStorage:'',
      subscriptionPlanDataLimit:'',
      subscriptionType:'',
      invoiceList:[],
      progressNum:0,
      invoiceListRows:[],

    };
    this.handleClick = this.handleClick.bind(this);
    this.get_userdetail = this.get_userdetail.bind(this);
    this.get_billing_portal = this.get_billing_portal.bind(this);
    this.getProgressPercentage = this.getProgressPercentage.bind(this);
    this.renderInvoices = this.renderInvoices.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
    this.downloadInvoicePDF = this.downloadInvoicePDF.bind(this);

    try{
      this.userData = JSON.parse(localStorage.getItem('persist:root'));
      var data = JSON.parse(this.userData['auth']);
      this.user_id = data['access']['user_id'];

    }catch(err){}

     //this.get_userdetail();
     //this.get_billing_portal(this.state.user);


  }

  componentWillMount() {
    document.title = 'XSPACE | Billing';


  }

  componentDidMount(){
     this.get_billing_portal();

  }


   componentWillReceiveProps(nextProps, nextContext){
      if(nextProps.billingLink !== this.props.billingLink){
        //Perform some operation

        //this.setState({ billingPortalURL: nextProps.billingLink["billingPortalURL"] });
        //this.setState({ invoiceList: nextProps.billingLink["invoiceList"] });

        this.setState({ billingPortalURL: nextProps.billingLink["billingPortalURL"] }, () => {
            const url = this.state.billingPortalURL;
            //console.log(url);
        });
        this.setState({ invoiceList: nextProps.billingLink["invoiceList"] }, () => {
            const url = this.state.invoiceList;
        });

        this.setState({ subscriptionType: nextProps.billingLink["subscriptionType"] }, () => {
            const url = this.state.subscriptionType;
        });
        this.setState({ maxNumberOfUsers: nextProps.billingLink["maxNumberOfUsers"] }, () => {
            const url = this.state.maxNumberOfUsers;
        });
        this.setState({ storageMax: nextProps.billingLink["storageMax"] }, () => {
          const url = this.state.storageMax;

        });
        this.setState({ subscriptionPlanDataLimit: nextProps.billingLink["subscriptionPlanDataLimit"] }, () => {
            const url = this.state.subscriptionPlanDataLimit;

        });
        this.setState({ nextInvoiceDate: nextProps.billingLink["nextInvoiceDate"] }, () => {
            const url = this.state.nextInvoiceDate;

        });
        this.setState({ subscriptionPlanDataLimit: nextProps.billingLink["subscriptionPlanDataLimit"] }, () => {
          const url = this.state.subscriptionPlanDataLimit;

        });
        this.setState({ currentStorage: nextProps.billingLink["currentStorage"] }, () => {
          const url = this.state.currentStorage;

        });

        this.setState({ invoiceListRows: this.renderInvoices(nextProps.billingLink["invoiceList"])});


        var percentage = this.getProgressPercentage();

        //this.renderAlert();

        this.setState({ progressNum: percentage });

        //this.fieldValues.contentstandardsList = nextProps.contentStandard["contentStandard"]
        //this.setState({contentstandardsList: nextProps.contentStandard["contentStandard"] });

  }
  }

  renderAlert = () => {
    const data = {
      columns: [
        {
          label: 'Invoice #',
          field: 'invoiceid',
          sort: 'asc'
        },
        {
          label: 'Date',
          field: 'date',
          sort: 'asc'
        },
        {
          label: 'Amount',
          field: 'amount',
          sort: 'asc'
        },
        {
          label: 'Description',
          field: 'description',
          sort: 'asc'
        },
        {
          label: 'Status',
          field: 'status',
          sort: 'asc'
        },
        {
          label: 'Actions',
          field: 'action',
        },
      ],
      rows: this.state.invoiceListRows
    };

    if (!this.state.invoiceList) {
      return (
        <MDBContainer>
          <MDBAlert color="info">
              No Billing Invoices Found
          </MDBAlert>
        </MDBContainer>
      );
    }
    else{
      return (
        <StyledTable>
          <MDBDataTable btn searchLabel="Search..." width="100%" data={data}/>
        </StyledTable>
      );
    }
}

  downloadInvoicePDF = (invoiceID) =>{
    //console.log(invoiceID);
    axios.get(API_ROOT + '/api/download_invoicepdf?query_string='+invoiceID)
    .then(function (response) {
        if(response.data.length !== 0){
            var url = response.data.downloadURL;
            var win = window.open(url, '_blank');
            win.focus();

          }
      })
      .catch(function (error) {
        console.error(error);
      });

  }

  renderInvoices = (invoiceList) => {
    let renderObj = null;
    let noRowsFound = (<h4>No Invoices Found</h4>)

    if (invoiceList) {
    // not empty
      renderObj = invoiceList.map((invoice, index) => {
          return (
              {
                invoiceid: invoice.invoiceid,
                date: invoice.date,
                amount: '$' + invoice.amount,
                description: invoice.description,
                status: invoice.status,
                action: (
                    <MDBBtn rounded gradient="aqua" onClick={this.downloadInvoicePDF.bind(this, invoice.invoiceid)}>
                      <i className="fa fa-download"/>
                    </MDBBtn>),
              }
          )
        });
    } else {
       // empty
          let lists = [{invoiceid: '-', date: '-', amount: '-', description: '-', status: '-', action: '-'}];
          return(lists);
    }

    return renderObj;
  }


  handleClick(e) {
    e.preventDefault();

    if(e.currentTarget.getAttribute('name')==="logout"){
      localStorage.clear();
      window.location.reload();
    }
  }

  get_userdetail(){
    fetch(API_ROOT + '/api/user_email/'+this.user_id+'/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        try{
          localStorage.setItem("username", response['username']);
          this.setState({
            username:response['username'],
            email:response['email']
          });
        }catch(err){}

    });
  }

  get_billing_portal(){
    this.props.getBillingPortalRSAA();

    }

  getProgressPercentage(){
    var percentNum = (this.state.currentStorage/this.state.storageMax)*100;
    //console.log(percentNum);
    return percentNum
    //this.props.billingLink["currentStorage"]
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
                  <Link className="nav-link active" to="/myaccount/billing">Summary</Link>
                  <Link className="nav-link" to="/myaccount/plans">Plans</Link>
                  <a className="nav-link" href={this.state.billingPortalURL}>Settings</a>
                </div>
              </div>
              <div className='billing-wrapper-body'>
                <div className='left-panel'>
                  <div className='details'>
                    <h3>My Usage</h3>
                    <Progress value={this.state.progressNum} color="success" striped animated/>
                    <p>Actual Usage: <span>{this.state.currentStorage} GB / {this.state.subscriptionPlanDataLimit} GB</span></p>
                  </div>
                  <div className='details'>
                    <h3>Current Subscription</h3>
                    <p>Your next payment will be due on:</p>
                    <b>{this.state.nextInvoiceDate}</b>
                  </div>
                </div>
                <div className='right-panel'>
                  <div>
                    <p>Your subscription plan allows for:</p>
                    <b>{this.state.maxNumberOfUsers} Users</b>
                    <p>You have used:</p>
                    <b>{this.state.currentStorage} GBs</b>
                  </div>
                  <a href="/#/myaccount/plans">Upgrade Plan</a>
                </div>
              </div>
              {/* <p>You are currently subscribed to the <b>{this.state.subscriptionType}</b>. Max Users: <b>{this.state.maxNumberOfUsers}</b> </p> */}
              <h4>Billing History</h4>
              {this.renderAlert()}
            </BillingWrapper>
          </RightPanel>
        </FlexView>
      </div>
  )
  }
}
