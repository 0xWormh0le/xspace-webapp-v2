import React from 'react'
import logo from '../assets/img/XSPACE.png'
import { Redirect } from 'react-router-dom'

import { StyledButton } from '../lib/button'

const WhitelabelPreview = (props) => {
  return (
    <div className="container">
      <div className="row jumbotron" style={{background: '#F2F2F2', border: '3 solid #000000',boxSizing: 'border-box', marginLeft: 145, width: 814, marginTop:40,marginBottom:100}}>
          <div className="col-lg-1"></div>
          <div className="col-lg-5">
            <img src={logo} height="300" width="300" style={{marginTop:18}} alt="XSPACE Logo" />
          </div>
          <div className="col-lg-4">
            <span style={{position: 'absolute', marginTop: 97, textAlign: 'center'}}>
              <h5>Ask us about our whitelabeling solution!</h5>
              <p style={{fontFamily: 'Roboto',fontStyle: 'normal', fontWeight: 300}}>Contact us at <a target="_blank" href="mailto:support@xspaceapp.com" >support@xspaceapp.com</a> for more information in regards to your whitelabeled solution. </p>
              <StyledButton onClick={()=>{window.location.href='/#/myaccount/edit'}}> Go Back </StyledButton>
            </span>
          </div>
      </div>
    </div>
  )
}

export default WhitelabelPreview;
