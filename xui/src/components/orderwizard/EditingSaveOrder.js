import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import ReactQuill from 'react-quill'
import  Loader from 'react-loader';
import axios from 'axios';
import { Redirect } from 'react-router-dom'

import { API_ROOT } from '../../index';

export default class EditingSaveOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
            dropdownOpen: false,
            isSaveSuccessfully: true,
            isLoaded: true,
            dropdownOpenCat: false,
            editing: true,
            checkoutURL: '',
        };
        this.toggle = this.toggle.bind(this);
        this.toggleCat = this.toggleCat.bind(this);
    }

    componentDidMount() {
        /*call saveSelectedProduct function*/
        // const { submitData } = this.props;
        //
        //
        // this.setState({ invoiceList: submitData() }, () => {
        //     var url = this.state.invoiceList;
        // });
        //
        // this.setState({
        //        isSaveSuccessfully: true,
        //        isLoaded: true,
        //        checkoutURL: ''
        //     });

    }

    componentWillReceiveProps(nextProps) {

      // if we get a redirect url and if we are not coming in from Chargebee redirect
      if (typeof nextProps.url !== "undefined") {
      //this code will add a new tab
        console.log(nextProps.url)

      //   var a = window.open(nextProps.url, "cbeeWindow");
      //   a.focus();
        //window.location.href = nextProps.url
        window.location.href=nextProps.url;



      }
    }

    toggle() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleCat() {
        this.setState({
          dropdownOpenCat: !this.state.dropdownOpenCat
        });
    }

    render() {
      console.log("EDITINGSAVEORDER", this.props.url);
      if (this.props.url) {
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

                      <h3 className=""><b>All Done!<br /> Your editing order has been<br /> created successfully.</b></h3>
                      <a className="btn btn-success" href="/#/products/orders" target="/#/products/orders"><i class="fa fa-tags" aria-hidden="true" ></i>      <b>Next Steps:</b> Generate Product Tags & Ship</a>
                      </center>
                    </div>
                </div>
            </div>
        );
      } else {
            return (
                <div class="container" style={{height: 500}}>
                    <div class="row">

                        <div class="col-lg-12">
                            <Loader loaded={this.state.isLoaded} lines={13} length={20} width={10} radius={30}
                                corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
                                trail={60} shadow={false} hwaccel={false} className="spinner"
                                zIndex={2e9} top="120px" left="50%" scale={1.00}
                                loadedClassName="loadedContent" />
                        </div>
                        <div className="col-lg-12">
                        <Loader loaded={this.state.isLoaded} lines={13} length={20} width={10} radius={30}
                                corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
                                trail={60} shadow={false} hwaccel={false} className="spinner"
                                zIndex={2e9} top="120px" left="50%" scale={1.00}
                                loadedClassName="loadedContent" />
                            <p className="loading-bar-css">One Moment Please...<br /> We Are Creating Your Order </p>
                        </div>
                    </div>
                </div>
            );
      }
    }
}
