import React, { Component } from 'react';
import styled from 'styled-components'
import { MDBContainer, MDBPopover, MDBPopoverBody, MDBPopoverHeader, MDBBtn, Input, Button, Container, Modal, ModalHeader, ModalBody } from 'mdbreact';

const Wrapper = styled.div`
  h3 {
    font-size: 18px;
    color: #333330;
    line-height: 26px;
  }
  p {
    font-size: 14px;
    line-height: 20px;
    color: #333330;
    opacity: .5;
    max-width: 576px;
  }
  .pcw-sm-outer-radio {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: #F4F5FA;
    border: none;
    border-radius: 10px;
    padding: 30px 0;
    label {
      font-size: 14px;
      line-height: 20px;
      color: #333330;
      padding-left: 40px;
      margin: 0;
      span {
        background-color: #ffffff;
        border: 2px solid rgba(61, 61, 61, .2);
        width: 20px;
        height: 20px;
        span {
          display: none;
        }
      }
      input:checked ~ .checkmark {
        background-color: #ffffff;
        span {
          width: 9px;
          height: 9px;
          display: block;
          background-color: #00A3FF;
          margin: auto;
          margin-top: 3px;
          border-radius: 100%;
          border: none;
        }
      }
      :hover {
        input ~ .checkmark {
          border-color: rgba(61, 61, 61, .3);
          background-color: #ffffff;
        }
      }
    }
  }
  .bottom-wrapper {
    display: flex;
    justify-content: space-between;
    img {
      height: 50px;
    }
    img:nth-child(2) {
      margin: 0 50px;
      width: 83px;
      height: 70px;
    }
  }
  .space-between {
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    p {
      font-weight: bold;
    }
    button {
      width: 213px;
      height: 58px;
      background-color: #00A3FF;
      color: #ffffff;
      font-size: 18px;
      font-weight: bold;
      line-height: 26px;
      border: none;
      border-radius: 29px;
    }
    a {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      font-weight: bold;
      text-decoration: none;
      width: 120px;
      height: 45px;
      border-radius: 23px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #F4F5FA;
      :hover {
        background-color: #00A3FF;
        color: #ffffff;
        border: none;
      }
    }
  }
`

export default class ProductMethod extends Component {

  state = {
    mode: 0,
    products: [],
    modal: false
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    const errors = this.props.errors || {}
    const {evaluateAccess, modeOption, changeMode } = this.props
    return (
      <Container>
        <Modal isopen={this.state.modal}>
          <ModalHeader>Uploading Products</ModalHeader>
          <ModalBody>
            <p>{this.state.products}</p>
          </ModalBody>
        </Modal>
        <Wrapper class="animated fadeIn">
          <h3>Easily create products on XSPACE.</h3>
          <p>Select either of the methods below to add new products.</p>
          <div class="pcw-sm-outer-radio">
            <label class="pcw-sm-container">Create Single Product
              <input type="radio" value="0" name="radio" onChange={() => changeMode(0)}/>
              <span class="checkmark"><span /></span>
            </label>
            <label class="pcw-sm-container">Import Products Via Excel (.xlsx, .csv)
              <input type="radio" value="1" name="radio" onChange={() => changeMode(1)}/>
              <span class="checkmark"><span /></span>
            </label>
            <label class="pcw-sm-container">Import Products Via E-Commerce
              <input type="radio" value="2" name="radio" onChange={() => changeMode(2)}/>
              <span class="checkmark"><span /></span>
            </label>
          </div>
          <div className='bottom-wrapper'>
            <div>
              <h3>Integrate your existing e-commerce platform into XSPACE</h3>
              <p>*If new products have been created since your last creation, then we will import new merchandise and disregard already linked products.</p>              
            </div>
            <div>
              <img src="https://cdn.shopify.com/assets/images/logos/shopify-bag.png" alt=''/>
              <img src="https://www.shareicon.net/data/256x256/2015/10/06/112653_development_512x512.png" alt='' />
              <img src="https://www.shareicon.net/data/256x256/2015/10/06/112651_development_435x512.png" alt='' />
              <img src="https://wwwcdn.bigcommerce.com/www1.bigcommerce.com/assets/logos/bc-logo-dark.svg?mtime=20160329000432" alt='' />
            </div>
          </div>
          <div className='space-between'>
            {modeOption !== -1 ? <button color="get-started" onClick={evaluateAccess}>Get Started</button> : <p>Select A Choice Above To Get Started</p>}
            <a href="/#/addtocart/addapikey">App Settings</a>
          </div>
        </Wrapper>
    </Container>
    );
  }
}
