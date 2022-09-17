import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #333;
  margin-top: 80px;
  color: #FFF;
`

const FooterView = ({errors}) => {
  return (
    <Container>
      <div className="row" style={{marginRight:0, marginLeft:0}}>
        <div className="col override-col-padding" style={{height: 15, backgroundColor: '#FF1000'}}>
        </div>
        <div className="col override-col-padding" style={{height: 15, backgroundColor: '#FBB03B'}}>
        </div>
        <div className="col override-col-padding" style={{height: 15, backgroundColor: '#23B573'}}>
        </div>
        <div className="col override-col-padding" style={{height: 15, backgroundColor: '#29ABD2'}}>
        </div>
      </div>
      <footer className="page-footer center-on-small-only">
        <div className="container-fluid" style={{paddingTop: 30}}>
            <div className="row">
                <div className="col-md-4">
                    <h5>ABOUT XSPACE</h5>
                    <p>XSPACE is an augmented reality web platform for e-Commerce businesses to deliver rich 3D product models for their customers over the web.</p>
                    <p>XSPACE aims to be compatible with Android, iOS, Windows, and Linux.</p>
                    <i className="fa fa-android fa-2x" aria-hidden="true" style={{padding:15}}/>
                    <i className="fa fa-apple fa-2x" aria-hidden="true" style={{padding:15}}/>
                    <i className="fa fa-windows fa-2x" aria-hidden="true" style={{padding:15}}/>
                    <i className="fa fa-linux fa-2x" aria-hidden="true"style={{padding:15}}/>

                </div>
                <div className="col-lg-2 col-md-2">
                    <h4 className="title">COMPANY</h4>
                    <ul className="footer-space">
                      <li><a href="https://xspaceapp.com/contact-us/">Contact Us</a></li>
                      <li><a href="https://xspaceapp.com/about-us/">About Us</a></li>
                      <li><a href=" https://xspaceapp.com/terms-of-service/">Terms of Service</a></li>
                      <li><a href="https://xspaceapp.com/privacy-policy/">Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="col-lg-2 col-md-2">
                    <h4 className="title">XSPACE</h4>
                    <ul className="footer-space">
                        <li><a href="https://xspaceapp.com/photo-gallery/">Photo Gallery</a></li>
                        <li><a href="/#/docs/">Documentation</a></li>
                        <li><a href="https://xapphelp.zendesk.com/hc/en-us">Help Center</a></li>
                    </ul>
                </div>

                <div className="col-lg-2 col-md-2">
                    <h5 className="title">SOCIAL</h5>
                    <ul className="footer-space">
                        <li><i className="fa fa-linkedin" aria-hidden="true"/>
                          <a href="https://www.linkedin.com/company/25282705/">LinkedIn</a></li>
                        <li><i className="fa fa-facebook" aria-hidden="true"/>
                          <a href="https://www.facebook.com/xspacesystems/">Facebook</a></li>
                    </ul>
                </div>


            </div>
        </div>


        <hr />




        <br />

        <div className="footer-copyright text-center">
            <div className="container-fluid">
                © 2019 Copyright <a href="https://xspaceapp.com"> XSPACE by Prisma Systems Corporation </a>

            </div>
        </div>
      </footer>
    </Container>
  )
}

export default FooterView
