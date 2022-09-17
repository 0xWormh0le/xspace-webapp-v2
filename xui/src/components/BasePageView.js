import React from 'react';


export default class BaseView extends React.Component {
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
          <div style={{marginTop: 0, paddingTop: 60}}/>
          <div className="row">
              <div className="col-lg-12">
              </div>
          </div>
      </div>
    );
  }
}
