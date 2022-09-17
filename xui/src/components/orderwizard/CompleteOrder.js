import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import ReactQuill from 'react-quill'
import  Loader from 'react-loader';
import axios from 'axios';

import { API_ROOT } from '../../index';

export default class CompleteOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
            dropdownOpen: false,
            isSaveSuccessfully: true,
            checkoutURL: '',
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
      // if we get a redirect url and if we are not coming in from Chargebee redirect
    }

    render() {

        return (
            <div class="container" style={{height: 500}}>
                <div class="row">
                    <div className="col-md-12">
                      <center>
                      <div className="product-wizard-circle" style={{background: '#27AE60', width: 191, height:191,marginTop: 35, marginBottom:20}}>
                            <img src="/media/arrow.png" style={{marginTop: 64,marginLeft: 5}} alt="v2logo" />
                      </div>
                      </center>
                    </div>
                    <br />
                    <div className="col-md-12">
                      <center>

                      <h3 className=""><b>All Done!<br /> Your capture order has been<br /> created successfully.</b></h3>
                      <a className="btn btn-success" href="/#/products/orders" target="/#/products/orders"><i class="fa fa-tags" aria-hidden="true" ></i>      <b>Next Steps:</b> Generate Product Tags & Ship</a>
                      </center>
                    </div>
                </div>
            </div>
          )

    }
}
