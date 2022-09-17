import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';

export default class ProductMethod extends Component {

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
            <h2 style={{fontWeight: 200}}>Entry Method</h2>
            <hr />
            <h3 style={{fontWeight: 200}}>Easily create products on XSPACE. Select either of the methods below to add new products.</h3>
            <br />
              <div class="pcw-sm-outer-radio">
                <label class="pcw-sm-container">Create Single Product
                  <input type="radio" name="radio" />
                  <span class="checkmark"></span>
                </label>
                <label class="pcw-sm-container">Import Products Via Excel (.xlsx, .csv)
                  <input type="radio" name="radio" />
                  <span class="checkmark"></span>
                </label>
                <label class="pcw-sm-container">Import Products Via E-Commerce Platform
                  <input type="radio" name="radio" />
                  <span class="checkmark"></span>
                </label>
              </div>
          </div>
          <div class="col-sm-6">
          </div>
        </div>
        <br />
        <br />
        <br />
      </div>
    );
  }
}
