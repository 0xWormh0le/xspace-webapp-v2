import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';

import { API_ROOT } from '../../index';

export default class File extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    };

  }

  render() {
   const errors = this.props.errors || {}


    return (
      <div class="animated fadeIn">
        <div class="row pd-ct-folder">
          <h3>360 View Models</h3>
        </div>
        <div class="row pd-ct-directory">
          <div class="col-sm-3">
            <input type="checkbox" /><a><p class="pd-ct-item-name">My Cool Product Shot 22 (Angle View).png</p></a>
          </div>
          <div class="col-sm-2">
            <p><i>2</i></p>
          </div>
          <div class="col-sm-2">
            <p><i>03/23/2018 - 12:00PM CST</i></p>
          </div>
          <div class="col-sm-2">
            <a class="pd-ct-item-author" href=""><p>Brandon Burton</p></a>
          </div>
          <div class="col-sm-1">
            <p><i>300KB</i></p>
          </div>
          <div class="col-sm-2">
            <p>...</p>
          </div>
        </div>
      </div>
    );
  }
}
