import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import  Loader from 'react-loader';
import { API_ROOT } from '../../index';
import axios from 'axios';
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Container, Modal, ModalHeader, ModalBody, ModalFooter} from 'mdbreact'

class OrderView extends Component {
  constructor(props) {
      super(props);
      this.state = {
        'modal': this.props.modal,
        'dropdownOpen': false,
      }
      this.closeToggle = this.closeToggle.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps, nextState) {

    }

    closeToggle() {
      this.props.closeToggle()
    }



  render() {
    let { page, quantity, queueAll, selectedProducts, totalProduct, isSubmitted, Uploaded } = this.state
    let { modal, productList, orderId, isProductLoaded} = this.props
    console.log("PRODUCTVIEWORDERDATA", productList);
      return (
        <React.Fragment>
          <Container>
            <Modal isOpen={modal} toggle={this.toggle} size="fluid">
              <ModalHeader>
                {/*My Order #<b>{orderId}</b>*/}
                  My Order #<b>{productList.order_ID}</b>
              </ModalHeader>
              <ModalBody className="view-order-modal">
                <div className="row">
                    <div className="col-md-12">
                        <div className="scroll-containerView" style={{height: 500,background: '#F2F2F2'}}>
                            { !isProductLoaded && (
                                <div className="myorder-loader" style={{marginTop: 68}}>
                                  <Loader loaded={isProductLoaded} lines={13} length={20} width={10} radius={30}
                                        corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
                                        trail={60} shadow={false} hwaccel={false} className="spinner"
                                        zIndex={2e9} bottom="80px" left="460px" scale={1.00}
                                        loadedClassName="loadedContent" />
                                </div>
                              )}

                          {/*{productList.map((productdata, index) =>(*/}
                          {/*    <div className="row" style={{background: '#FFFFFF', border: '2px solid #B8B8B8', padding:'10px', margin: 'auto'}} key={index}>*/}

                          {/*      <div className="col-md-6 view-order-modal-label">*/}
                          {/*          {productdata.product}*/}
                          {/*      </div>*/}
                          {/*      <div className="col-md-6 view-order-modal-label">*/}
                          {/*          ID: <i>{productdata.uniqueID}</i>*/}
                          {/*      </div>*/}
                          {/*      <div className="col-md-3 view-order-modal-label">*/}
                          {/*        UPC: <b>{productdata.UPC}</b><br/>*/}
                          {/*        SKU: <b>{productdata.SKU}</b>*/}
                          {/*      </div>*/}
                          {/*      <div className="col-md-3 view-order-modal-label">*/}
                          {/*        2D Photos: <b>{productdata.is2drequired ? 'Yes' : 'No'}</b><br/>*/}
                          {/*        360 View: <b>{productdata.is360viewrequired ? 'Yes' : 'No'}</b>*/}
                          {/*      </div>*/}
                          {/*      <div className="col-md-3 view-order-modal-label">*/}
                          {/*        <span className="col-md-1" style={{marginLeft: -25}}>  3D Model: <b>{productdata.is3dmodelrequired ? 'Yes' : 'No'}</b> </span><br/>*/}
                          {/*        <span className="col-md-1" style={{marginLeft: -23}}>  Video: <b>{productdata.isvideorequired ? 'Yes' : 'No'}</b> </span>*/}
                          {/*      </div>*/}
                          {/*      <div className="col-md-3 view-order-modal-label">*/}

                          {/*      </div>*/}
                          {/*    </div>*/}
                          {/*  ))*/}
                          {/*}*/}
                            <div className="row" style={{background: '#FFFFFF', border: '2px solid #B8B8B8', padding:'10px', margin: 'auto'}} >

                              {/*<div className="col-md-6 view-order-modal-label">*/}
                              {/*    {productdata.product}*/}
                                <div className="col-md-4 view-order-modal-label">
                                  <div className="row">
                                      <b>Number of Products/Assets:&nbsp;&nbsp;&nbsp;</b> {+productList.numberOfProducts}
                                  </div>
                                  {/*<div className="col-md-6 view-order-modal-label">*/}
                                  {/*    ID: <i>{productdata.uniqueID}</i>*/}
                                  <div className="row mb-2">
                                          <b>Status:&nbsp;&nbsp;&nbsp;</b> <i>{productList.status}</i>
                                  </div>
                                  {/*<div className="col-md-3 view-order-modal-label">*/}
                                  {/*  UPC: <b>{productdata.UPC}</b><br/>*/}
                                  {/*  SKU: <b>{productdata.SKU}</b>*/}
                                  {/*</div>*/}
                                  <div className="row">
                                      {/*First Created: <b>{productList.createdDate}</b>*/}
                                      First Created:&nbsp;<b>{new Intl.DateTimeFormat('en-US').format(new Date(productList.createdDate))}</b>
                                  </div>
                                  <div className="row">
                                    Last Modified:&nbsp;<b>{new Intl.DateTimeFormat('en-US').format(new Date(productList.lastModifiedDate))}</b>
                                  </div>

                                </div>
                                <div className="col-md-4 view-order-modal-label">

                                  {/*<div className="col-md-3 view-order-modal-label">*/}
                                  {/*  2D Photos: <b>{productdata.is2drequired ? 'Yes' : 'No'}</b><br/>*/}
                                  {/*  360 View: <b>{productdata.is360viewrequired ? 'Yes' : 'No'}</b>*/}
                                  {/*</div>*/}
                                  {/*<div className="col-md-3 view-order-modal-label">*/}
                                      <pre>{productList.descriptionList}</pre>
                                  {/*</div>*/}
                                </div>
                                <div className="col-md-4 view-order-modal-label">
                                    {/*<div className="col-md-3 view-order-modal-label">*/}
                                  {/*  <span className="col-md-1" style={{marginLeft: -25}}>  3D Model: <b>{productdata.is3dmodelrequired ? 'Yes' : 'No'}</b> </span><br/>*/}
                                  {/*  <span className="col-md-1" style={{marginLeft: -23}}>  Video: <b>{productdata.isvideorequired ? 'Yes' : 'No'}</b> </span>*/}
                                  {/*</div>*/}
                                  {/*<div className="col-md-4 view-order-modal-label">*/}
                                      <pre>{productList.serviceNote}</pre>
                                  {/*</div>*/}
                                </div>
                              {/*<div className="col-md-3 view-order-modal-label">*/}

                              {/*</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <div className="row">
                    <div className="col-md-8">
                        <p>For modifying existing orders, please contact XSPACE services at <u className="blue-text"><a href="mailto:support@xspaceapp.com">support@xspaceapp.com</a></u> </p>
                    </div>
                    <div className="col-md-4">
                        <Button className="add-product-buttton" color="red" style={{height: 50 }} onClick={this.props.cancel}>Cancel</Button>
                    </div>
                </div>

              </ModalFooter>
            </Modal>
          </Container>
        </React.Fragment>
    )
  }
}

export default OrderView;
