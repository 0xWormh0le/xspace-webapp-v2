import React, { Component } from 'react';
import { Input, Button, MDBInput } from 'mdbreact';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardFooter, MDBIcon, MDBTooltip,  MDBBadge, MDBCarousel, MDBCarouselInner, MDBCarouselItem, MDBBtn } from "mdbreact";

export default class ChooseOrderingMethod extends Component {

  constructor(props) {
    super(props)

    this.state = {
      input: "",
      radio: this.props.fieldValues.isSingleProduct,
      checkbox: []
    };
    // this.handleInputChange = this.handleInputChange.bind(this)
  }

  changeInput = (e) => {
    this.setState({input: e.target.value});
  }

  changeRadio = (id) => {
    this.setState({radio: id});
    this.props.setMode(id)
  }

  componentDidMount() {
    console.log("OMMOount")
    let localStorage = window.localStorage
    localStorage.setItem("orderTree", undefined)
  }

  render() {
    const errors = this.props.errors || {}
    return (
      <div className="animated fadeIn">
            <MDBRow>
            <MDBCol lg="6" md="6" className="mb-lg-0 mb-4">
              <MDBCard collection className="z-depth-1-half">
                <div className="view zoom">
                  <img
                    src="https://clippingpathbest.com/wp-content/uploads/2019/04/Clipping-path.....jpg"
                    className="img-fluid"
                    alt=""
                  />
                  <div className="stripe elegant-color-dark">
                        <MDBInput labelClass="white-text" checked={this.state.radio===1} onChange={this.changeRadio.bind(this, 1)} label="Order Image Editing (BG Removal, Auto Crop & Auto Center, Renaming, Barcode Detection)" value="single" type="radio" id="radio1" />
                  </div>
                </div>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="6" md="6" className="mb-lg-0 mb-4">
              <MDBCard collection className="z-depth-1-half">
                <div className="view zoom">
                  <img
                    src="https://www.canon.com.hk/public/product/2012/pr_large_201268.jpg"
                    className="img-fluid"
                    alt=""
                  />
                  <div className="stripe elegant-color-dark">
                        <MDBInput labelClass="white-text" checked={this.state.radio===0} onChange={this.changeRadio.bind(this, 0)}label="Order Product Photography" value="multiple" type="radio" id="radio2" />
                  </div>
                </div>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        <br />
        <br />
        <br />
      </div>
    );
  }
}
