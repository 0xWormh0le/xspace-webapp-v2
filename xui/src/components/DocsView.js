import React from 'react';
import styled from 'styled-components'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCardBody, MDBCardTitle, MDBCardText, MDBTabPane, MDBTabContent,
MDBNav, MDBNavItem, MDBNavLink, MDBIcon, MDBMask, MDBView, } from "mdbreact";
import { API_ROOT } from '../index';
import { Wrapper } from '../lib/wrapper'

const StyledMDBContainer = styled(MDBContainer)`
  padding: 0;
  .classic-tabs .nav {
    justify-content: center;
    background: white;
    margin: 0 1rem;
    margin-bottom: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
  }
  .classic-tabs .nav li a {
    font-size: 16px;
    color: #333330;
    line-height: 26px;
    font-weight: bold;
    text-transform: capitalize;
    padding: 15px;
    &.active {
      color: #00A3FF;
      border-bottom: none;
    }
  }
  .tab-pane.active {
    display: flex;
  }
`

const LeftPanel = styled(Wrapper)`
  min-width: 263px;
  min-height: 470px;
  margin-right: 30px;
  position: relative;
  padding: 0;
  .nav-item {
    .nav-link {
      font-size: 16px;
      color: #333333;
      font-weight: bold;
      line-height: 26px;
      padding: 17px 0;
      padding-left: 25px;
      border-bottom: 2px solid #F4F5FA;
      &.active {
        color: #00A3FF;
      }
    }
  }
`
const RightPanel = styled(Wrapper)`
  width: 100%;
  min-height: 470px;
  .card-title {
    font-size: 18px;
    font-weight: 400;
    line-height: 26px;
    color: #333330;
  }
  .card-text {
    font-size: 14px;
    line-height: 20px;
    color: #333330;
    opacity: .5;
    font-weight: 400;
  }
`

const HelpButton = styled.a`
  width: 213px;
  height: 38px;
  background-color: #00A3FF;
  font-size: 14px;
  line-height: 20px;
  font-weight: bold;
  color: #ffffff;
  border-radius: 19px;
  position: absolute;
  bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: calc((100% - 213px) / 2);
  :hover {
    text-decoration: none;
  }  
`

export default class DashboardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userId: props.userId,
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        'userProfile': [],
        profilePic: '/icons8-customer-128.png',
        activeItemClassicTabs: "1",
        activeItemVerticalPills1: "1",
        activeItemVerticalPills2: "4",
        activeItemVerticalPills3: "7",
        activeItemVerticalPills4: "10",
        activeItemVerticalPills5: "13",
        activeItemVerticalPills6: "15",
    }
    this.handleError = this.handleError.bind(this);
    this.fill_db = this.fill_db.bind(this);
    this.fill_2d_db = this.fill_2d_db.bind(this);

    this.fill_db();
    this.fill_2d_db();
  }

  componentWillMount() {
    document.title = 'XSPACE | Docs'
  }

  componentDidMount() {
    //console.log(this.props.userInfo);
    this.setState({'userProfile':this.props.userInfo || '' })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({'userProfile':nextProps.userInfo || '' })
  }

  toggleClassicTabs = tab => () => {
  if (this.state.activeItemClassicTabs !== tab) {
  this.setState({
    activeItemClassicTabs: tab
  });
  }
    }
  toggleVerticalPills = tab => () => {
  console.log(this.state.activeItemVerticalPills1);
  if (this.state.activeItemVerticalPills1 !== tab) {
  this.setState({
    activeItemVerticalPills1: tab
  });
  }
    }

  toggleVerticalPills2 = tab => () => {
    console.log(this.state.activeItemVerticalPills2);
  if (this.state.activeItemVerticalPills2 !== tab) {
  this.setState({
    activeItemVerticalPills2: tab
  });
  }
    }

  toggleVerticalPills3 = tab => () => {
    console.log(this.state.activeItemVerticalPills3);
  if (this.state.activeItemVerticalPills3 !== tab) {
  this.setState({
    activeItemVerticalPills3: tab
  });
  }
    }

  toggleVerticalPills4 = tab => () => {
    console.log(this.state.activeItemVerticalPills4);
  if (this.state.activeItemVerticalPills4 !== tab) {
  this.setState({
    activeItemVerticalPills4: tab
  });
  }
    }

  toggleVerticalPills5 = tab => () => {
    console.log(this.state.activeItemVerticalPills5);
  if (this.state.activeItemVerticalPills5 !== tab) {
  this.setState({
    activeItemVerticalPills5: tab
  });
  }
    }

  toggleVerticalPills6 = tab => () => {
    console.log(this.state.activeItemVerticalPills6);
  if (this.state.activeItemVerticalPills6 !== tab) {
  this.setState({
    activeItemVerticalPills6: tab
  });
  }
    }


  fill_db(){
    fetch(API_ROOT + '/api/get_fill_db/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          'userId':this.state.userId
        })
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(() => {
       console.log('S3 sync Complete.')
      });
  }

  fill_2d_db(){
    fetch(API_ROOT + '/api/get_2dfill_db/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'userid':+this.state.userId
        })
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(() => {
       console.log('2D sync Complete.')
      });
  }

  handleError(e) {
    this.setState({profilePic: '/icons8-customer-128.png'});
  }


  render() {
    let {userProfile} = this.state
    return (
      <div className="container">

        <StyledMDBContainer>
          {/* <MDBView>
            <img src="/media/Prisma-Black.png" height="300px" className="img-fluid" alt="Docs Banner" />
            <MDBMask className="flex-center" pattern={0} overlay="black" >
              <div>
                  <center>
                      <i className="fa fa-book fa-4x white-text" aria-hidden="true"></i>
                      <h1 className="white-text docs">XSPACE Documentation</h1>
                      <p className="white-text docs">Explore documentation on how to use the XSPACE platform to its full potential.</p>
                      <MDBBtn rounded gradient="aqua" className="mb-3 mt-3" href="https://xspaceapp.zendesk.com/hc/en-us" target="_blank"><i className="fa fa-life-ring mr-1"></i>Help Center</MDBBtn>
                  </center>
              </div>

            </MDBMask>
          </MDBView> */}
          <div className="classic-tabs">
            <MDBNav classicTabs>
              <MDBNavItem>
                <MDBNavLink to="#" className={this.state.activeItemClassicTabs==="1" ? "active" : "" }
                            onClick={this.toggleClassicTabs("1")}>
                  <MDBIcon icon="clipboard" size="2x" />
                  <br />
                  Getting Started
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="#" className={this.state.activeItemClassicTabs==="2" ? "active" : "" }
                            onClick={this.toggleClassicTabs("2")}>
                  <MDBIcon icon="magic" size="2x" />
                  <br />
                  Creating Products
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="#" className={this.state.activeItemClassicTabs==="3" ? "active" : "" }
                            onClick={this.toggleClassicTabs("3")}>
                  <MDBIcon icon="truck" size="2x" />
                  <br />
                  Order Content
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="#" className={this.state.activeItemClassicTabs==="4" ? "active" : "" }
                            onClick={this.toggleClassicTabs("4")}>
                  <MDBIcon icon="cubes" size="2x" />
                  <br />
                  Product Profiles
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="#" className={this.state.activeItemClassicTabs==="5" ? "active" : "" }
                            onClick={this.toggleClassicTabs("5")}>
                  <MDBIcon icon="qrcode" size="2x" />
                  <br />
                  QR Print Labels
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="#" className={this.state.activeItemClassicTabs==="6" ? "active" : "" }
                            onClick={this.toggleClassicTabs("6")}>
                  <MDBIcon icon="th-list" size="2x" />
                  <br />
                  Content Standards
                </MDBNavLink>
              </MDBNavItem>
            </MDBNav>
            <MDBTabContent className="mb-5" activeItem={this.state.activeItemClassicTabs}>
              <MDBTabPane tabId="1">
                <LeftPanel>
                  <div pills color="elegant" className="flex-column no-list">
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills1==="1" ? "active" : "" }
                                  onClick={this.toggleVerticalPills("1")}>
                        Overview
                      </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills1==="2" ? "active" : "" }
                                  onClick={this.toggleVerticalPills("2")}>
                        Set Up My Account
                      </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills1==="3" ? "active" : "" }
                                  onClick={this.toggleVerticalPills("3")}>
                        Getting Started
                      </MDBNavLink>
                    </MDBNavItem>
                  </div>
                  <HelpButton href="https://xapphelp.zendesk.com/hc/en-us">Help Center</HelpButton>
                </LeftPanel>
                <RightPanel>
                  <MDBTabContent activeItem={this.state.activeItemVerticalPills1}>
                    <MDBTabPane tabId="1">
                      <MDBCardBody>
                        <MDBCardTitle>Overview</MDBCardTitle>
                        <MDBCardText>XSPACE is an all-in-one automation platform for product content. Its the first ever of its kind to focus on providing
                        high quality, cost effective, and customizable content for businesses of all types.</MDBCardText>
                        <MDBCardTitle>Product Content Made Easy</MDBCardTitle>
                        <MDBCardText>Our vision for the future of retail is product content made easy. We focus on making the generation, management,
                        and usage of product visuals as painless as possible. Our goal, simply put, is to digitize the world's products
                        in the race to enable the AR/VR revolution</MDBCardText>
                      </MDBCardBody>
                    </MDBTabPane>
                    <MDBTabPane tabId="2">
                      <MDBCardBody>
                        <MDBCardTitle>My Account | Setitngs</MDBCardTitle>
                        <MDBCardText>
                          Look at and change current profile information such as the email address connected with profile and your password. To change information click the green arrow and fill in the boxes.
                          This is also where two-factor authentication can be activated and all other current sessions can be signed out of.

                        </MDBCardText>
                        <MDBCardTitle>My Account | Edit Profile</MDBCardTitle>
                        <MDBCardText>
                              Look at and change your profile picture, account name, occupation, role and phone number. To change information click the green arrow and fill in the boxes.
                        </MDBCardText>
                        <MDBCardTitle>My Account | Notifications</MDBCardTitle>
                        <MDBCardText>
                              Enable or disable various forms of notifications here. Note: this is not where to go to find notifications, simply to edit notification settings.
                        </MDBCardText>
                        <MDBCardTitle>Organization</MDBCardTitle>
                        <MDBCardText>
                              On this setting tab, you can review your organizations details, edit company profile, and view the current active users in your organization.
                        </MDBCardText>
                        <MDBCardTitle>Billing</MDBCardTitle>
                        <MDBCardText>
                              On this setting tab, you can review your billing invoices, edit your subscription plan, and more.
                        </MDBCardText>
                        <MDBCardTitle>Invitations</MDBCardTitle>
                        <MDBCardText>
                              On this settings tab, you may invite users to your account by entering in the their first name, last name, and email, and resent emails for
                        </MDBCardText>

                      </MDBCardBody>
                    </MDBTabPane>
                    <MDBTabPane tabId="3">
                      <MDBCardBody>
                        <MDBCardTitle>Getting Started: First Steps</MDBCardTitle>
                        <MDBCardText>
                              If you are looking to order a product through XSPACE there a few simple steps to go through. First create a product by clicking on Create in top bar and follow the steps in the Product Creation Wizard.
                              Once you finish your product will be saved to on your XSPACE account for future use. When you are ready to order, click on the Order button in the top bar and follow the steps in the Product Order Wizard. To finish your order,
                              go to your cart and confirm your order. If there are any questions about orders, go to Products in the top bar and click on My Orders to view previous order information.

                        </MDBCardText>
                      </MDBCardBody>
                    </MDBTabPane>
                  </MDBTabContent>
                </RightPanel>
              </MDBTabPane>
              <MDBTabPane tabId="2">
                <LeftPanel>
                  <div pills color="elegant" className="flex-column no-list">
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills2==="4" ? "active" : "4" }
                                  onClick={this.toggleVerticalPills2("4")}>
                        Single Product Create
                      </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills2==="5" ? "active" : "5" }
                                  onClick={this.toggleVerticalPills2("5")}>
                        Excel Import
                      </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills2==="6" ? "active" : "6" }
                                  onClick={this.toggleVerticalPills2("6")}>
                        e-Commerce Import
                      </MDBNavLink>
                    </MDBNavItem>
                  </div>
                  <HelpButton href="https://xapphelp.zendesk.com/hc/en-us">Help Center</HelpButton>
                </LeftPanel>
                <RightPanel>
                  <MDBTabContent activeItem={this.state.activeItemVerticalPills2}>
                    <MDBTabPane tabId="4">
                      <MDBCardBody>
                        <MDBCardTitle>Creating A Single Product</MDBCardTitle>
                        <MDBCardText>Great for creating a single product. Basic product information can be entered one by one for products with the ability to make each one private, view or public.</MDBCardText>
                      </MDBCardBody>
                    </MDBTabPane>
                    <MDBTabPane tabId="5">
                      <MDBCardBody>
                        <MDBCardTitle>Creating Multiple Products via Excel</MDBCardTitle>
                        <MDBCardText>
                          This option is great if there are product information is already on an excel sheet or if there are multiple products being created.
                        To start, download the given template and populate it with information for your product(s). Then, once the excel file is populated, click on the icon to choose the file or it can be dragged to the space indicated and dropped for easy upload.
                        </MDBCardText>
                        <MDBCardTitle>Download Our Excel Import Template</MDBCardTitle>
                        <MDBCardText>
                              You may use our excel template to import thousands of products a one time. Simply click the download template button and open the excel sheet to make your desired changes.
                        </MDBCardText>
                        <MDBCardTitle>Best Practices</MDBCardTitle>
                        <MDBCardText>
                              To ensure a sucessful upload of your excel sheet, we ask that you do not create additional columns for the provided template. Any deviation of these columns will result in a failed upload.
                              We also ask that you do not keep and value blank, as all values need some type of default. Instead of leaving an entry empty, fill it with default value such a 0, or "None"
                        </MDBCardText>

                      </MDBCardBody>
                    </MDBTabPane>
                    <MDBTabPane tabId="6">
                      <MDBCardBody>
                        <MDBCardTitle>Import Products Via Excel</MDBCardTitle>
                        <MDBCardText>
                          This option allows for updating existing products as well as adding new ones without duplicating the entry information.
                          This option works with the API’s Shopify, Magento, and Woocommerce.
                        </MDBCardText>
                        <MDBCardTitle>1. Connect Your Store</MDBCardTitle>
                        <MDBCardText>
                          In order to connect your store, you must first go to My Account > API Settings. From the selection dropdown, select
                          the e-commerce API you would like to connect to. Then, enter in the API credentials for your connected store after
                          creating a private application for XSPACE on the platform of choice. You may be interested in how to create private
                          applications on these platforms:<br />
                          <ul>
                              <u>
                              <li><a className="blue-text" href="https://shopify.com" target="_blank">Shopify API Docs</a></li>
                              <li><a className="blue-text" href="https://magento.com" target="_blank">Magento API Docs</a></li>
                              <li><a className="blue-text" href="https://woocommerce.com" target="_blank">WooCommerce API Docs</a></li>
                              </u>
                          </ul>
                        </MDBCardText>
                        <MDBCardTitle>2. Pull Updates</MDBCardTitle>
                        <MDBCardText>
                          To pull a product from a store an API type must first be selected.
                          Then a pop up selection will appear to select the product from the store connect.
                          After confirming the products, hit the pull form store button to initate the data pull.
                          The product pull method only supports product information at the moment.
                        </MDBCardText>
                        <MDBCardTitle>3. Push Updates</MDBCardTitle>
                        <MDBCardText>
                            This can be used only after E-commerce has been configured. This feature allows new products & information to be pushed and
                            update your store from XSPACE. After confirming the products, hit the push to store button to initate the data push.
                            The product push method only supports product information at the moment.
                        </MDBCardText>

                      </MDBCardBody>
                    </MDBTabPane>
                  </MDBTabContent>
                </RightPanel>
              </MDBTabPane>
              <MDBTabPane tabId="3">
                <LeftPanel>
                  <div pills color="elegant" className="flex-column no-list">
                      <MDBNavItem>
                        <MDBNavLink to="#" className={this.state.activeItemVerticalPills3==="7" ? "active" : "" }
                                    onClick={this.toggleVerticalPills3("7")}>
                          Single Product Order
                        </MDBNavLink>
                      </MDBNavItem>
                      <MDBNavItem>
                        <MDBNavLink to="#" className={this.state.activeItemVerticalPills3==="8" ? "active" : "" }
                                    onClick={this.toggleVerticalPills3("8")}>
                          Multi Product Order
                        </MDBNavLink>
                      </MDBNavItem>
                      <MDBNavItem>
                        <MDBNavLink to="#" className={this.state.activeItemVerticalPills3==="9" ? "active" : "" }
                                    onClick={this.toggleVerticalPills3("9")}>
                          My Orders Page
                        </MDBNavLink>
                      </MDBNavItem>
                    </div>
                    <HelpButton href="https://xapphelp.zendesk.com/hc/en-us">Help Center</HelpButton>
                  </LeftPanel>
                  <RightPanel>
                    <MDBTabContent activeItem={this.state.activeItemVerticalPills3}>
                      <MDBTabPane tabId="7">
                        <MDBCardBody>
                          <MDBCardTitle>Ordering A Single Product</MDBCardTitle>
                          <MDBCardText>Click on Order in the top bar, then choose Order for One Product, select the order you want, add the angles and types desired, and confirm your order to add it to your cart.</MDBCardText>
                        </MDBCardBody>
                      </MDBTabPane>
                      <MDBTabPane tabId="8">
                        <MDBCardBody>
                          <MDBCardTitle>Ordering Multiple Products</MDBCardTitle>
                          <MDBCardText>
                            Click on Order in the top bar, then choose Order for Multiple Products, select the orders you want, the angles and types you want, and confirm your orders to add it to your cart.
                          </MDBCardText>
                          <MDBCardTitle>Batches</MDBCardTitle>
                          <MDBCardText>
                                Look at and change your profile picture, account name, occupation, role and phone number. To change information click the green arrow and fill in the boxes.
                          </MDBCardText>
                          <MDBCardTitle>Batch Content Types</MDBCardTitle>
                          <MDBCardText>
                          </MDBCardText>
                        </MDBCardBody>
                      </MDBTabPane>
                      <MDBTabPane tabId="9">
                        <MDBCardBody>
                          <MDBCardTitle>View Order Details</MDBCardTitle>
                          <MDBCardText>
                            After placing your content order, you may view details about your order. Simply click the right menu button and select "View Details".
                          </MDBCardText>
                          <MDBCardTitle>Generating QR Print Labels</MDBCardTitle>
                          <MDBCardText>
                            To generate a QR label for your product go to Products in the top bar. Click on My Orders and then on the right side of the order will be a button with 3 dots on it. Click it and choose QR Label.
                          </MDBCardText>
                          <MDBCardTitle>Adding Tracking Number to Orders</MDBCardTitle>
                          <MDBCardText>
                            You may add a tracking number to your order by going to Products > My Orders tab and clicking the right menu button for the corresponding order. Select the option for Add Tracking number
                            to update our operations teams. We accept tracking number from all major mail carriers (USPS, UPS, FedEx, DHL, etc.)
                          </MDBCardText>
                        </MDBCardBody>
                      </MDBTabPane>
                    </MDBTabContent>
                  </RightPanel>
              </MDBTabPane>
              <MDBTabPane tabId="4">
                <LeftPanel>
                  <div pills color="elegant" className="flex-column no-list">
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills4==="10" ? "active" : "" }
                                  onClick={this.toggleVerticalPills4("10")}>
                        Product Profile Overview
                      </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills4==="11" ? "active" : "" }
                                  onClick={this.toggleVerticalPills4("11")}>
                        Editing Product Info
                      </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills4==="12" ? "active" : "" }
                                  onClick={this.toggleVerticalPills4("12")}>
                        Upload, Donwload, and Deleting Files
                      </MDBNavLink>
                    </MDBNavItem>
                  </div>
                  <HelpButton href="https://xapphelp.zendesk.com/hc/en-us">Help Center</HelpButton>
                </LeftPanel>
                <RightPanel>
                  <MDBTabContent activeItem={this.state.activeItemVerticalPills4}>
                    <MDBTabPane tabId="10">
                      <MDBCardBody>
                        <MDBCardTitle>Product Profile Page Overview</MDBCardTitle>
                        <MDBCardText>The Profile Page of a product  is where all the information regarding said products and orders can be found.
                        You may select a product profile page on the <a className="blue-text" href="/#/products/manage">Product Manage</a> page
                        </MDBCardText>
                        <MDBCardTitle>Why do I need a product profile page?</MDBCardTitle>
                        <MDBCardText>Product information and tracking is important to any digital enterprise, so a product profile
                        will allow you to keep all your product information in one area.</MDBCardText>

                      </MDBCardBody>
                    </MDBTabPane>
                    <MDBTabPane tabId="11">
                      <MDBCardBody>
                        <MDBCardTitle>Editing Product Information</MDBCardTitle>
                        <MDBCardText>
                              Use to change information regarding product dimensions, name, category  and description of a product.
                        </MDBCardText>

                      </MDBCardBody>
                    </MDBTabPane>
                    <MDBTabPane tabId="12">
                      <MDBCardBody>
                        <MDBCardTitle>Uploading Files</MDBCardTitle>
                        <MDBCardText>
                          Files can be added to the product profile page by clicking the add new asset button. Once the popup window shows, you may click the
                          browse button to select the images you want to upload. You may upload multiple images at one time.
                        </MDBCardText>
                        <MDBCardTitle>Downloading Files</MDBCardTitle>
                        <MDBCardText>
                          Downloading files from XSPACE is super simple. For single image downloads, simply click the download icon for the image in question. For multiple downloads, simply select the checkboxes next to the product image names
                          and click the bulk download button to initiate the download. It will download all your files in a zip folder.
                        </MDBCardText>
                        <MDBCardTitle>Deleting Files</MDBCardTitle>
                        <MDBCardText>
                          Similar to the download function, simply select the product images you would like to delete, and click the delete button. This works for single and multiple image deletion.
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBTabPane>
                  </MDBTabContent>
                </RightPanel>
              </MDBTabPane>
              <MDBTabPane tabId="5">
                <LeftPanel>
                  <div pills color="elegant" className="flex-column no-list">
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills5==="12" ? "active" : "" } onClick={this.toggleVerticalPills5("12")}>
                        QR Labels Overview
                      </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills5==="13" ? "active" : "" } onClick={this.toggleVerticalPills5("13")}>
                        Generating & Downloading QR Print Labels
                      </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills5==="14" ? "active" : "" } onClick={this.toggleVerticalPills5("14")}>
                        Label Settings
                      </MDBNavLink>
                    </MDBNavItem>
                  </div>
                  <HelpButton href="https://xapphelp.zendesk.com/hc/en-us">Help Center</HelpButton>
                </LeftPanel>
                <RightPanel>
                  <MDBTabContent activeItem={this.state.activeItemVerticalPills5}>
                    <MDBTabPane tabId="12">
                      <MDBCardBody>
                        <MDBCardTitle>QR Print Labels</MDBCardTitle>
                        <MDBCardText>QR print labels are labels that can be attached to a product to help identify the object.</MDBCardText>
                        <MDBCardTitle>Why use QR Print Labels?</MDBCardTitle>
                        <MDBCardText>We use QR print labels to track individual products throughout our entire system. It makes the organization easier for both XSPACE and customers
                        when dealing with large orders. Creating a QR print label is simple and quick.
                        </MDBCardText>

                      </MDBCardBody>
                    </MDBTabPane>
                    <MDBTabPane tabId="13">
                      <MDBCardBody>
                        <MDBCardTitle>Generating QR Labels</MDBCardTitle>
                        <MDBCardText>
                            To generate a QR label for your product go to Products in the top bar. Click on My Orders and then on the right side of the order will be a button with 3 dots on it. Click it and choose Generate QR Labels.
                        </MDBCardText>
                        <MDBCardTitle>Downloading QR Labels</MDBCardTitle>
                        <MDBCardText>
                              Look at and change your profile picture, account name, occupation, role and phone number. To change information click the green arrow and fill in the boxes.
                        </MDBCardText>
                        <MDBCardTitle>Supported Avery Templates</MDBCardTitle>
                        <MDBCardText>
                              Look at and change your profile picture, account name, occupation, role and phone number. To change information click the green arrow and fill in the boxes.
                        </MDBCardText>


                      </MDBCardBody>
                    </MDBTabPane>
                    <MDBTabPane tabId="14">
                      <MDBCardBody>
                        <MDBCardTitle>Page Size</MDBCardTitle>
                        <MDBCardText>
                          You may select the page size for the print label sheet you are printing on. We currently support these sizes with plans to expand:
                          <ul>
                              <u>
                              <li>Letter (8.5in x 11in)</li>
                              <li>Avery A4</li>
                              <li>Avery A5</li>
                              <li>Avery A6</li>
                              </u>
                          </ul>

                        </MDBCardText>
                        <MDBCardTitle>Orientation Setting</MDBCardTitle>
                        <MDBCardText>
                          You may select the orientation of the print labels sheet in either portait, or landscape view.
                        </MDBCardText>
                        <MDBCardTitle>Corner Radius Setting</MDBCardTitle>
                        <MDBCardText>
                          Some label templates require the corner radius of the labels to match a certain inch size. Typically 2 Inches is the default corner radius for most Avery Templates.
                        </MDBCardText>
                        <MDBCardTitle>Number of Columns</MDBCardTitle>
                        <MDBCardText>
                          You can select the number of columns you would like to print per page. You must have at least one column per page and you can have a max of 3 columns per page.
                        </MDBCardText>
                        <MDBCardTitle>Number of Rows</MDBCardTitle>
                        <MDBCardText>
                          You can select the number of rows you would like to print per page. You must have at least one row per page and you can have a max of 8 rows per page.
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBTabPane>
                  </MDBTabContent>
                </RightPanel>
              </MDBTabPane>
              <MDBTabPane tabId="6">
                <LeftPanel>
                  <div pills color="elegant" className="flex-column no-list">
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills6==="15" ? "active" : "" } onClick={this.toggleVerticalPills6("15")}>
                        Contnet Standards Overview
                      </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills6==="16" ? "active" : "" } onClick={this.toggleVerticalPills6("16")}>
                        Creating A Standard
                      </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink to="#" className={this.state.activeItemVerticalPills6==="17" ? "active" : "" } onClick={this.toggleVerticalPills6("17")}>
                        Selecting A Standard for Orders
                      </MDBNavLink>
                    </MDBNavItem>
                  </div>
                  <HelpButton href="https://xapphelp.zendesk.com/hc/en-us">Help Center</HelpButton>
                </LeftPanel>
                <RightPanel>
                  <MDBTabContent activeItem={this.state.activeItemVerticalPills6}>
                    <MDBTabPane tabId="15">
                      <MDBCardBody>
                        <MDBCardTitle>Content Standards Overview</MDBCardTitle>
                        <MDBCardText>Content standards are a set of specifications for our team to track with every order. We strive
                        to ensure quality is met and all your content is standardized with your branding requirements. </MDBCardText>
                        <MDBCardTitle>Why Content Standards?</MDBCardTitle>
                        <MDBCardText>Often times when creating content at scale, organizations will run into inconsistiency issues across
                        multiple vendors. Content standards allows us to always provide you the correct content, format, color, and all. Major
                        e-commerce sites enact content standards to ensure wide spread consistiency.</MDBCardText>
                        <MDBCardTitle>Popular Content Standards</MDBCardTitle>
                        <MDBCardText> You can view content standards for multiple selling platforms:<br />
                          <ul>
                              <u>
                              <li><a className="blue-text" href="https://www.amazon.com/gp/help/customer/display.html?nodeId=200109520" target="_blank">Amazon Standards</a></li>
                              <li><a className="blue-text" href="https://sellerhelp.walmart.com/s/guide?article=000005824" target="_blank">Walmart Seller Standards</a></li>
                              <li><a className="blue-text" href="https://help.etsy.com/hc/en-us/articles/115015663347-What-Are-the-Requirements-for-Listing-Photos-?segment=selling" target="_blank">Etsy Standards</a></li>
                              <li><a className="blue-text" href="https://developer.ebay.com/devzone/merchant-products/catalog-best-practices/content/images.html" target="_blank">eBay Standards</a></li>
                              </u>
                          </ul>
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBTabPane>
                    <MDBTabPane tabId="16">
                      <MDBCardBody>
                        <MDBCardTitle>Creating A Content Standard </MDBCardTitle>
                        <MDBCardText>
                          Creating a content wizard is quick and simple. Simply click Order on the nav bar and you will be presented with the first order step. Select the button that
                          says create new standard in order to start.
                        </MDBCardText>
                        <MDBCardTitle>1. Start</MDBCardTitle>
                        <MDBCardText>On this step of the content standard wizard, you may name your content standard for futute use. You may also add a description.</MDBCardText>
                        <MDBCardTitle>2. Content Settings</MDBCardTitle>
                        <MDBCardText>
                              On step 2, you may set the content settings for each type of content that we offer at XSPACE. You may set the image sizes, file format, color profile, and more.
                              You may also add settings regarding 360 Views, 3D Models, and Video content.
                        </MDBCardText>
                        <MDBCardTitle>3. Content Formatting</MDBCardTitle>
                        <MDBCardText>
                              You may customize the format associated with your images. You can change the white margin space versus the product of your images to your desired sizes.
                        </MDBCardText>
                        <MDBCardTitle>4. Review</MDBCardTitle>
                        <MDBCardText>
                            Review your content standard before creating. If everything looks good, you can press confirm to complete the creation of your personlized standard.
                        </MDBCardText>

                      </MDBCardBody>
                    </MDBTabPane>
                    <MDBTabPane tabId="17">
                      <MDBCardBody>
                        <MDBCardTitle>Selecting Your Standard When Ordering</MDBCardTitle>
                        <MDBCardText>
                          You may choose from existing content standards for orders using the dropdown select on the first page of the order wizard as shown above.
                          Once selected from the dropdown, when you click next to go on to the next step, it will save your content standard with the order.
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBTabPane>
                  </MDBTabContent>
                </RightPanel>
              </MDBTabPane>
            </MDBTabContent>
          </div>
        </StyledMDBContainer>
      </div>
    );
  }
}
