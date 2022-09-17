import React, { Component } from 'react';

export default class ProductCreateEdit extends Component {

  state = {

  }

  componentDidMount() {

  }

  render() {
    const errors = this.props.errors || {}
    let btnCNS = <button className="new-stndard-button">Create New Standard</button>

    return (
      <div class="animated fadeIn">
        <div class="row">
          <div class="col-sm-6">
            <h3 style={{fontWeight: 200}}>Select your asset standard for capture orders. Learn more about Asset Standards.</h3>
            <br />
            <div class="center">
              <img src="/media/asset_check_plus.png" />
            </div>
            <br />
            <h3 style={{fontWeight: 200}}>Create a new asset standard for your order and future orders.</h3>
            <br />
            <div class="center">

            </div>
          </div>
          <div class="col-sm-6" style={{borderLeft: "1px solid #ccc"}}>
          </div>
        </div>
        <br />
        <br />
        <br />
      </div>
    );
  }
}
