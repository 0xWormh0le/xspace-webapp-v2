import React from 'react'
import styled from 'styled-components'
import { NavLink} from 'mdbreact'
import './MenuBarCss.css'

const StyledNavLink = styled(NavLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 25px;
  border-bottom: 2px solid #F4F5FA;
  span {
    color: ${props => props.active ? '#00A3FF' : '#333330'};
    font-size: 16px;
    line-height: 26px;
    font-weight: bold;
  }
  i {
    font-size: 8px;
  }
`

const Extended = styled.div`
  color: #333330;
  font-size: 14px;
  line-height: 20px;
  padding: 20px;
`

const Button = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 260px;
  height: 38px;
  // background-color: #00A3FF;
  //  background-color: rgba(62,178,255,1);
  background-color: #3eb2ff;
  font-size: 14px;
  line-height: 20px;
  font-weight: normal;
  color: #ffffff;
  margin-bottom: 15px;
  border-radius: 25px;
  :hover {
    box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
    border: none;
    text-decoration: none;
    color: white;
    
  }
`

const LeftSideMenu = ({active, company, toggle_cs, toggle_pc, toggle_oe, toggle_oc, toggle_ra, profileURL, profilePic, fullName, productCount, toggle_mu}) => {
  // console.log('active', active);
  // console.log('company', company);
  // console.log('toggle', toggle_cs);
  // console.log(profileURL);
  return (
    <React.Fragment>
      {/*<div className="h-25">*/}
        <div className="row sm-12 mx-3" style={{height:"21%", borderBottom: "3px solid #dcdcdc"}}>
          <div className="col-5 pr-0 mt-4 pl-0">
            <img style={{position: "sticky", borderTopLeftRadius: '50%', borderTopRightRadius: '50%', borderBottomLeftRadius: '50%',
              borderBottomRightRadius: '50%', maxHeight: '90%', maxWidth: '90%', left: '25%',
            }}
                 src={profileURL ? profileURL : profilePic} alt='user-profile'/>
          </div>
          <div className="col-7 pl-3 mt-4">
            <h2 className="h2-responsive" style={{marginTop: "25%", fontSize:"120%", fontWeight:"normal", color:"#636363"}}>{fullName}</h2>
            <h5 style={{fontWeight:"normal", color:"#636363", float: "center", fontSize:"14px", marginTop:"1em"}}>{productCount} Products</h5>
          </div>
        </div>
        {/*<div className="row mx-3" style={{height:"10px", borderBottom: "3px solid #dcdcdc"}}></div>*/}
      {/*<div className="row"></div>*/}

        {/*<StyledNavLink to="/products/manage" active={active === 1}>*/}
        {/*  <span>Product Library</span>*/}
        {/*  {active === 1 ? <i className="fa fa-chevron-down"/> : <i className="fa fa-chevron-right"/>}*/}
        {/*</StyledNavLink>*/}
        {/*{active === 1 && <Extended>Manage all of your products in your catalogs, share with vendors, and more.</Extended>}*/}
        {/*<StyledNavLink to="/products/update" active={active === 2}>*/}
        {/*  <span>Product Updates</span>*/}
        {/*  {active === 2 ? <i className="fa fa-chevron-down"/> : <i className="fa fa-chevron-right"/>}*/}
        {/*</StyledNavLink>*/}
        {/*{active === 2 && <Extended>Receive updates from your e-commerce store / push updates to your store.</Extended>}*/}
        {/*<StyledNavLink to="/products/orders" active={active === 3}>*/}
        {/*  <span>My Orders</span>*/}
        {/*  {active === 3 ? <i className="fa fa-chevron-down"/> : <i className="fa fa-chevron-right"/>}*/}
        {/*</StyledNavLink>*/}
        {/*{active === 3 && <Extended>Receive updates from your e-commerce store / push updates to your store.</Extended>}*/}
      {/*</div>*/}
      <div style={{padding: 20}}>
        {/*<Button href="/#/order/wizard">Create Content Standards</Button>*/}
        <Button href={ (active === 3) ? "/#/products/manage" : "javascript:;"} onClick={toggle_cs}>Create Content Standards</Button>
        {/*<Button href="/#/products/create">Create/Import New Products</Button>*/}
        <Button href={ (active === 3) ? "/#/products/manage" : "javascript:;"} onClick={toggle_pc}>Create/Import New Products</Button>
        {/*<Button href="/#/products/create">Order Photography for Products</Button>*/}
        <Button href={ (active === 3) ? "/#/products/manage" : "javascript:;"} onClick={toggle_oc}>Order Photography for Products</Button>
        {/*<Button href="/#/products/create">Upload Media for Products</Button>*/}
        <Button href={ (active === 3) ? "/#/products/manage" : "javascript:;"} onClick={toggle_mu}>Upload Media for Products</Button>
        {/*<Button href="/#/order/wizard">Order Editing for Selected Products</Button>*/}
        <Button href={ (active === 3) ? "/#/products/manage" : "javascript:;"} onClick={toggle_oe}>Order Editing for Selected Products</Button>
        <Button href={ (active === 3) ? "/#/products/manage" : "javascript:;"} onClick={toggle_ra}>Run Audit on Selected Products</Button>

      </div>
    </React.Fragment>
  )  
}

export default LeftSideMenu
