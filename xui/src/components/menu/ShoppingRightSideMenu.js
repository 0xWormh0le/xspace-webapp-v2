import React from 'react'
import styled from 'styled-components'
import { NavLink} from 'mdbreact'

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
  height: 50px;
  // background-color: #00A3FF;
  //  background-color: rgba(62,178,255,1);
  background-color: #3eb2ff;
  font-size: 14px;
  line-height: 20px;
  font-weight: normal;
  color: #ffffff;
  margin-bottom: 8px;
  border-radius: 25px;
  :hover {
    box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
    border: none;
    text-decoration: none;
    color: white;
    
  }
`
const RightSideMenu = ({active, company, profileURL, profilePic, fullName, subTotal, checkoutURL, editingIncluded,
                         captureIncluded, totalProducts, totalServices, handleProceedToCheckout}) => {
  console.log('RightSideMenu received', active,' //// ',
      company,' //// ', profileURL,' //// ', profilePic,' //// ', fullName,' //// ', subTotal,' //// ', checkoutURL)

  // let editingIncluded
  let checkoutButton
  // if (captureIncluded) {
  //   editingIncluded = <p className="my-2 font-weight-normal" style={{fontSize:"18px", color:"#636363"}}>: Yes</p>
  // } else {
  //   editingIncluded = <p className="my-2 font-weight-normal" style={{fontSize:"18px", color:"#636363"}}>: No</p>
  // }
  console.log('editingIncluded', editingIncluded)
  if (editingIncluded) {
    // editing is included so let's go to the chargebee url if it exists
    checkoutButton = <Button href={checkoutURL ? checkoutURL : "javascript:;"}
                             style={{fontSize:"18px", color:"#ffffff", fontWeight: 600}} >Proceed to Checkout</Button>
  } else {
    if (captureIncluded) {
      // editing is NOT included, but capture exists so let's let the customer feel like we know what we're doing by
      // just having a modal pop up
      checkoutButton = <Button onClick={(e) => handleProceedToCheckout(e)}
                               style={{fontSize:"18px", color:"#ffffff", fontWeight: 600}}>Proceed to Checkout</Button>
    } else {
      // neither editing nor capture exists so render the button useless or have a modal pop up saying that there is
      // nothing in the cart
      checkoutButton = <Button style={{fontSize:"18px", color:"#ffffff", fontWeight: 600, backgroundColor: '#888888'}}> Proceed to Checkout </Button>
    }
  }

  return (
    <React.Fragment>
      <div className="row sm-12 mx-3" style={{height:"21%", borderBottom: "3px solid #dcdcdc"}}>
        <div className="col-5 pr-0 mt-4 pl-0">
          <img style={{position: "sticky", borderTopLeftRadius: '50%', borderTopRightRadius: '50%', borderBottomLeftRadius: '50%',
            borderBottomRightRadius: '50%', maxHeight: '90%', maxWidth: '90%', marginLeft: '2.5%'}}
               src={profileURL ? profileURL : profilePic} alt='user-profile'/>
        </div>
        <div className="col-7 pl-3 mt-4">
          <h2 className="h2-responsive" style={{marginTop: "25%", fontSize:"120%", fontWeight:"normal", color:"#636363"}}>{fullName}</h2>
          {/*<h5 style={{fontWeight:"normal", color:"#636363", float: "center", fontSize:"14px", marginTop:"1em"}}>{productCount} Products</h5>*/}
        </div>
      </div>
        <div className="row d-flex justify-content-center align-items-center">
          <p className="my-3 font-weight-bold" style={{fontSize:"23px", color:"#636363"}}>Order Summary</p>
        </div>
        <div className="row px-2 mx-auto d-flex justify-content-around align-items-center">
          <p className="my-2 font-weight-normal" style={{fontSize:"18px", color:"#636363"}}>Total Services Selected: {totalServices}</p>
        </div>
        <div className="row px-2 mx-auto d-flex justify-content-around align-items-center">
          <p className="my-2 font-weight-normal" style={{fontSize:"18px", color:"#636363"}}>Total Products for Capture: {totalProducts}</p>
        </div>
        {/*<div className="row px-2 mx-auto d-flex justify-content-around align-items-center">*/}
        {/*  <p className="my-2 font-weight-normal" style={{fontSize:"18px", color:"#636363"}}>Editing Included for Capture</p>*/}
        {/*  {editingIncluded}*/}
        {/*</div>*/}
        <div className="row my-5 py-3"/>
        <div className="row mx-auto d-flex flex-column justify-content-around align-items-center">
          <p className="my-2 font-weight-bold" style={{fontSize:"23px", color:"#636363"}}>Your Subtotal is:</p>
          <p className="my-2 font-weight-bold" style={{fontSize:"36px", color:"#ff6565"}}>{subTotal}</p>
        </div>
      <div style={{padding: 20}}>
        {checkoutButton}
      </div>
    </React.Fragment>
  )  
}

export default RightSideMenu
