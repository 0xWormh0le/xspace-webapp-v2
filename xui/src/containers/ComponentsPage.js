import React from 'react'
import { connect } from 'react-redux'
import DashboardView from '../components/DashboardView'
import Navbar from './Navbar';
import Footer from './Footer'
import styled from 'styled-components'
import { API_ROOT } from '../index';

const UserCard = styled.div`
  text-align: center;
  padding-top: 35px;
  color: #333330;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 0.3rem;
  background-color: #ffffff;
  min-height: 370px;
  img {
    width: 90px;
    height: 90px;
  }
  h2 {
    font-size: 24px;
    line-height: 34px;
    margin: 0;
    margin-top: 15px;
    font-weight: 400;
  }
  p {
    font-size: 14px;
    opacity: .5;
    margin: 0;
    line-height: 20px;
    padding-bottom: 15px;
  }
  span {
    line-height: 26px;
    font-size: 16px;
    padding-bottom: 25px;
    display: block;
  }
  .d-flex {
    justify-content: center;
  }
  i {
    margin: 0 10px;
    padding: 10px;
    font-size: 20px;
    :hover {
      cursor: pointer;
    }
  }
  strong {
    color: #27AE60;
    opacity: .7;
    font-size: 12px;
    line-height: 20px;
    padding-top: 41px;
    font-weight: normal;
    display: block;
  }

`

const NewToXSpace = styled.div`
  display: flex;
  justify-content: flex-end;
  a {
    color: #27AE60;
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
    width: 263px;
    text-align: center;
    margin-bottom: 30px;
    text-decoration: none;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    :hover {
      background-color: #27AE60;
      color: #ffffff;
    }
  }
  @media (max-width: 768px) {
    justify-content: center;
  }
`

const CardWrapper = styled.div`
  text-align: center;
  color: #333330;
  padding: 1rem;
  min-height: ${props => props.cardType === 3 ? 170 : 370 }px;
  position: relative;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 0.3rem;
  background-color: #ffffff;
  h4 {
    font-size: 16px;
    line-height: 26px;
    padding-bottom: ${props => props.cardType === 3 ? 38 : 68}px;
    margin: 0;
    font-weight: bold;
  }
  i {
    color: #000000;
    font-size: 48px;
  }
  p {
    font-size: 14px;
    line-height: 20px;
    padding-top: ${props => props.cardType === 3 ? 0 : 20 }px;
    padding-bottom: ${props => props.cardType === 3 ? 11 : 20 }px;
    max-width: ${props => props.cardType === 1 ? 376 : 214 }px;
    margin: auto;
  }
  a {
    width: 133px;
    height: 38px;
    font-weight: bold;
    border-radius: 19px;
    background-color: #00A3FF;
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
    color: #ffffff;
    display: flex;
    margin: auto;
    align-items: center;
    justify-content: center;
    :hover {
      text-decoration: none;
    }
    position: absolute;
    bottom: ${props => props.cardType === 3 ? 20 : 70}px;
    left: 50%;
    transform: translateX(-50%);
  }
`
const ComponentsPage = (props) => {
  return (
    <div>
      <Navbar {...props}></Navbar>

        <div className="container">
            <NewToXSpace>
            <a href="/#/dashboard/?walkme=14-148604" target="_blank">New to XSPACE?</a>
            </NewToXSpace>
            <div className="row">
            <div className="col-md-3">
                <UserCard>
                <img className="rounded-circle" src='https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png' alt='user-profile'/>
                <h2 className="h2-responsive">Ryan Brown</h2>
                <p>Welcome</p>
                <span>20 Products</span>
                <div className="d-flex">
                    <i className="fa fa fa-bell-o" />
                    <i className="fa fa-pencil" />
                </div>
                <strong>No New Notifications</strong>
                </UserCard>
            </div>
            <div className="col-md-6">
                <CardWrapper cardType={1}>
                <h4>Create New Product(s)</h4>
                <i class="fa fa-cube"></i>
                <p>Create a new product to host on your e-commerce site and get digital assets.</p>
                <a href="/#/products/create/">Create New</a>
                </CardWrapper>
            </div>
            <div className="col-md-3">
                <CardWrapper cardType={3}>
                <h4>Order New Visuals</h4>
                <p>High quality product visuals.</p>
                <a href="/#/order/wizard">Order</a>
                </CardWrapper>
                <div style={{paddingBottom: 30}}></div>
                <CardWrapper cardType={3}>
                <h4>Manage 2D/3D Assets</h4>
                <p>Create, modify, delete.</p>
                <a href="/#/products/manage/">Manage</a>
                </CardWrapper>
            </div>
            </div>
            <div style={{paddingBottom: 30}}></div>
            <div className="row">
            <div className="col-lg-6">
                <CardWrapper cardType={1}>
                <h4>API Settings</h4>
                <i class="fa fa-cogs"></i>
                <p>Integrate XSPACE with your existing e-commerce platforms or web app.</p>
                <a href="/#/addtocart/addapikey/">API Settings</a>
                </CardWrapper>
            </div>
            <div className="col-lg-3">
                <CardWrapper cardType={2}>
                <h4>Profile Settings</h4>
                <i class="fa fa-user-o"></i>
                <p>Edit your company profile, change settings, and more.</p>
                <a href="/#/myaccount/edit/">Profile Settings</a>
                </CardWrapper>
            </div>
            <div className="col-lg-3">
                <CardWrapper cardType={2}>
                <h4>XSPACE Documentation</h4>
                <i class="fa fa-file-word-o"></i>
                <p>Take a look through our documentation to learn the XSPACE platform.</p>
                <a href="/#/docs/">Docs</a>
                </CardWrapper>
            </div>
            </div>
        </div>

      
      <Footer></Footer>
    </div>
  )
}


export default ComponentsPage;


// TODO: add in search bar back in
// <div className="row">
//   <div className="col-md-12">
//     <h1>Search</h1>
//     <p >Preform a quick search for existing products or find new ones to add to your catalog.</p>
//     <div className="jumbotron">
//       <form action="">
//         <div className="input-group">
//           <input className="form-control" name="search_string" placeholder="Search by UPC / Name..." type="text" />
//           <input name="start" type="hidden" value="0" />
//           <input name="size" type="hidden" value="5" />
//           <span className="input-group-btn">
//             <button className="btn btn-default SearchButton" type="submit">
//               <span className="input-group-btn">
//                 <span className="fa fa-search">
//                 </span>
//               </span>
//             </button>
//           </span>
//         </div>
//       </form>
//     </div>
//   </div>
// </div>
