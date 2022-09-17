import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';

export default class PermissionSettings extends Component {

  state = {

  }

  componentDidMount() {

  }

  render() {
    const errors = this.props.errors || {}

    let permissions = (
      <div>
        <div class="row">
          <div class="col-sm-6">
            <br />
            <div class="pcw-sm-outer-radio">
              <label class="pcw-sm-container">Private (default)
                <input type="radio" name="radio" />
                <span class="checkmark"></span>
              </label>
              <p>This setting marks your product as private. Only you can have access to the products link at assets.</p>
              <label class="pcw-sm-container">View/Read Only
                <input type="radio" name="radio" />
                <span class="checkmark"></span>
              </label>
              <p>This setting only allows specified users on XSPACE to view this page if they have a link and use its assets.</p>
              <label class="pcw-sm-container">Public
                <input type="radio" name="radio" />
                <span class="checkmark"></span>
              </label>
              <p>This setting marks your product as public. Anyone can have access to the products link and its assets.</p>
            </div>
            <br />
            </div>
          </div>
          <div class="col-sm-6">
            <br />
            <h3>Permissions</h3>
            <hr />
          </div>
        </div>
      )

    return (
      <div class="animated fadeIn">
        {permissions}
      </div>
    );
  }
}
