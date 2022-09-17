import React, { Component } from 'react';

export default class ProductReview extends Component {

  state = {

  }

  componentDidMount() {

  }

  render() {
    const errors = this.props.errors || {}
    return (
      <div class="animated fadeIn">
        <div class="row">
          <div class="col-sm-6">
            <h3 style={{fontWeight: 100}} >Easily create products on XSPACE. Select either of the methods below to add new products.</h3>
          </div>
          <div class="col-sm-6">
          </div>
        </div>

      </div>
    );
  }
}
