import React from 'react';
import logo from '../assets/img/XSPACE.png'

export default class ErrorPage404View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false
    };
  }

  render() {
    return (
        <div className="container">

          <div className="row jumbotron" style={{background: '#F2F2F2', border: '3 solid #000000',boxSizing: 'border-box', marginLeft: 145, width: 814, marginTop:40,marginBottom:100}}>
              <div className="col-lg-1"></div>
              <div className="col-lg-5">
                <img src={logo} height="300" width="300" style={{marginTop:18}} alt="XSPACE Logo" />
              </div>
              <div className="col-lg-4">
                <span style={{position: 'absolute', marginTop: 97, textAlign: 'center'}}>
                  <h2>404 - Error</h2>
                  <h5>Not Found</h5>
                  <p style={{fontFamily: 'Roboto',fontStyle: 'normal', fontWeight: 300}}> The page / resource you are looking for cannot be found. </p>
                </span>
              </div>
          </div>
        </div>
    );
  }
}
