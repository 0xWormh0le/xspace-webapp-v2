import React, { Component } from 'react';
import styled from 'styled-components'
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalHeader, ModalBody, ModalFooter } from 'mdbreact';
import ProductExcelCell from './ProductExcelCell';
import ProductAPICell from './ProductAPICell';
import ProductAPIStagedCell from './ProductAPIStagedCell';
import { StyledButton } from '../../lib/button'
import { Select } from '../../lib/select';

const Wrapper = styled.div`
  .flex-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 40px;
    .left-panel {
      max-width: 576px;      
    }    
  }
  .list-wrapper {
    display: flex;    
    .list-panel {
      width: 50%;
      .list-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        button {
          font-size: 12px;
          line-height: 20px;
          border: none;
          font-weight: bold;
          color: #00A3FF;
          border: none;
          margin-left: 10px;
          padding: 5px 10px;
          border-radius: 15px;
          :hover {
            background-color: #00A3FF;
            color: white;
          }
        }
        span {
          font-size: 12px;
          color: #333330;
          line-height: 20px;
          font-weight: bold;
        }
      }
      .list-body {
        border: 2px solid #F4F5FA;
        background-color: rgba(244, 245, 250, .4);
        min-height: 427px;
        border-radius: 10px;
      }
    }
    .list-panel.step2 {
      width: 100%;
    }
    .list-panel:first-child {
      margin-right: 30px;
    }
  }
  h3, h5 {
    font-size: 18px;
    font-weight: 400;
    line-height: 26px;
    color: #333330;
  }
  h5 {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: #333330;
    opacity: .5;
  }
`

export default class ProductAPIEntry extends Component {

  constructor(props) {
    super(props);

    this.state = {
      'products':[],
      'quantity': 20,
      'page': 1,
      'queuedProducts': [],
      'modal': true,
      'store': "Shopify",
      'dropdownOpen': false
    }

    this.removeProductFromQueue = this.removeProductFromQueue.bind(this)
    this.updateQuantity20 = this.updateQuantity20.bind(this)
    this.updateQuantity50 = this.updateQuantity50.bind(this)
    this.updateQuantity200 = this.updateQuantity200.bind(this)
    this.updateQuantity500 = this.updateQuantity500.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.toPage = this.toPage.bind(this)
    this.enqueue = this.enqueue.bind(this)
    this.enqueueAll = this.enqueueAll.bind(this)

    this.importStore = this.importStore.bind(this)
    this.initShopify = this.initShopify.bind(this)
    this.initMagento = this.initMagento.bind(this)
    this.initWooCommerce = this.initWooCommerce.bind(this)
    this.selectStore = this.selectStore.bind(this)
    this.toggle = this.toggle.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.queueProducts = this.queueProducts.bind(this)
    this.updateProductInQueue = this.updateProductInQueue.bind(this)
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({'queuedProducts':nextProps.products})
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.submitting == true && this.props.submitting == false) {
      let { products } = this.state;

      let marshalledProducts = [];
      products.map((product) => {
        let p = {}
        p["name"] = product["name"]
        // p["description"] = product["Product Description"]
        p["SKU"] = product["sku"]
        // p["upccode"] = product["Product SKU/UPC"]
        // p["manufacturer"] = product["Manufacturer"]
        // p["category"] = 1
        p["length"] = product["length"]
        p["width"] = product["width"]
        p["height"] = product["height"]
        p["price"] = product["price"]
        marshalledProducts.push(p)
      });

      this.props.submit({"product_list":marshalledProducts})
    }
    
    if (nextProps.submitting == true && this.props.submitting == true) {
      this.props.finish();
    }
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    })
  }

  toggleDropdown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  selectStore(event) {
    this.setState({store: event.target.value});
  }

  importStore() {
    const { store } = this.state
    if (store === "Shopify") {
      this.initShopify()
    } else if (store === "Magento") {
      this.initMagento()
    } else if (store === "WooCommerce") {
      this.initWooCommerce()
    }
  }

  updateQuantity20() {
    this.setState({'quantity': 20, 'page': 1});
  }

  updateQuantity50() {
    this.setState({'quantity':50, 'page': 1});
  }

  updateQuantity200() {
    this.setState({'quantity':200, 'page': 1});
  }

  updateQuantity500() {
    this.setState({'quantity':500, 'page': 1});
  }

  previousPage() {
    if (this.state.page > 1)
      this.setState({'page': this.state.page - 1})
  }

  nextPage() {
    if (this.state.page * this.state.quantity < this.state.products.length)
      this.setState({'page': this.state.page + 1})
  }

  toPage(idx) {
    this.setState({'page':idx})
  }

  importCart() {
    this.initShopify()
  }

  initShopify() {
    this.props.importShopify()
  }

  initMagento() {
    this.props.importMagento()
  }

  initWooCommerce() {
    this.props.importWoocommerce()
  }

  updateProductInQueue(idx, key, value) {
    let products = this.state.products
    products[idx][key] = value
    this.setState({'products':products})
  }

  removeProductFromQueue(idx) {
    let oldProducts = this.state.products;
    oldProducts.splice(idx, 1);
    let newProducts = oldProducts
    this.setState({'products':newProducts})
  }

  enqueue(idx) {
    let oldProducts = this.state.queuedProducts;
    oldProducts[idx].queued = !oldProducts[idx].queued
    let newProducts = oldProducts
    this.setState({'queuedProducts':newProducts})
  }

  queueProducts() {
    let newProducts = this.state.queuedProducts;
    let currentProducts = this.state.products;
    Array.prototype.push.apply(currentProducts, newProducts)
    this.setState({'products':currentProducts,'queuedProducts':[]})
  }

  enqueueAll() {
    let { products } = this.state
    let prdxs = []
    if (products.length > 0) {
      for (var i=0; i < products.length; i++) {
        let prod = products[i]
        prod.queued = !prod.queued
        prdxs.push(prod)
      }
      this.setState({'products':prdxs})
    } else {
      alert("You must have at least one product selected.")
    }
  }

  render() {
    let { products, queuedProducts, page, quantity, queueAll, store } = this.state

    let storeType = (
      // <Dropdown isopen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
      //   <DropdownToggle nav caret><p>{store}</p></DropdownToggle>
      //   <DropdownMenu>
      //       <DropdownItem onClick={this.selectStore}>Shopify</DropdownItem>
      //       <DropdownItem onClick={this.selectStore}>Magento</DropdownItem>
      //       <DropdownItem onClick={this.selectStore}>WooCommerce</DropdownItem>
      //   </DropdownMenu>
      // </Dropdown>
      <Select onChange={this.selectStore}>
        <option value='Shopify'>Shopify</option>
        <option value='Magento'>Magento</option>
        <option value='WooCommerce'>WooCommerce</option>
      </Select>
    )

    // let productViews = products.map((product, idx) => {
    //   return
    // })

    let productViews = []
    let importViews = []

    let quantity20 = <a onClick={this.updateQuantity20} href="#">20</a>
    let quantity50 = <a onClick={this.updateQuantity50} href="#">50</a>
    let quantity200 = <a onClick={this.updateQuantity200} href="#">200</a>
    let quantity500 = <a onClick={this.updateQuantity500} href="#">500</a>

    let previousPage = <div></div>
    let nextPage = <div></div>
    let pageNum = []
    let pageView = <div></div>
    let totalView = <div></div>
    let enqueueAllButton = (<div></div>)

    //if there are items queued
    if (queuedProducts) {
      for (var idx = (page - 1) * quantity; idx < page * quantity; idx++) {
        if (queuedProducts[idx])
          importViews.push((<ProductAPICell product={queuedProducts[idx]} key={idx} index={idx} enqueue={this.enqueue} remove={this.removeProductFromQueue}></ProductAPICell>))
      }
      enqueueAllButton = (
        <Button onClick={this.enqueueAll} color="light-green">Mark As All Correct</Button>
      )
    }

    //if there are products from the API
    if (products) {

      for (var idx = (page - 1) * quantity; idx < page * quantity; idx++) {
        if (products[idx])
          productViews.push((<ProductAPIStagedCell product={products[idx]} key={idx} index={idx} enqueue={this.enqueue} updateProductInQueue={this.updateProductInQueue} remove={this.removeProductFromQueue}></ProductAPIStagedCell>))
      }
      for (var i = 0; i < products.length / quantity; i++) {
        pageNum.push(i)
      }
      pageView = pageNum.map((pg, idx) => {
        if (idx == this.state.page - 1) {
          return (<li key={idx} class="btnoff" onClick={() => this.toPage(idx + 1)}>{pg + 1}</li>)
        }
        return (<li onClick={() => this.toPage(idx + 1)}>{pg + 1}</li>)
      });

      if (products.length > 0)
        totalView = (<p>{products.length} products were found.</p>)

      if (page * quantity < products.length)
        nextPage = <Button color="cyan" onClick={this.nextPage}>Next Page</Button>
    }

    if (this.state.page > 1)
      previousPage = <Button color="cyan" onClick={this.previousPage}>Prev Page</Button>

    switch(this.state.quantity) {
      case 20:
        quantity20 = <a href="#" class="btnoff"><strong>20</strong></a>
        break;
      case 50:
        quantity50 = <a href="#" class="btnoff"><strong>50</strong></a>
        break;
      case 200:
        quantity200 = <a href="#" class="btnoff"><strong>200</strong></a>
        break;
      case 500:
        quantity500 = <a href="#" class="btnoff"><strong>500</strong></a>
        break;
    }

    return (
      <Container>
        <Modal isopen={this.state.modal} toggle={this.toggle} size="lg">
          <ModalHeader toggle={this.toggle}>Add Products From Store</ModalHeader>
          <ModalBody>
            <div class="row">
              <div class="col-sm-6">
                <h4>Select The Store To Import From</h4>
              </div>
              <div class="col-sm-3">
                {storeType}
              </div>
              <div class="col-sm-3">
                <Button color="primary" onClick={this.importStore}>Select</Button>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <div class="scroll-container">
                  {importViews}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>{' '}
            <Button color="primary" onClick={this.queueProducts}>Add Selected Products</Button>
          </ModalFooter>
        </Modal>
        <div class="animated">
          <Wrapper>
            {this.props.step === 1 && <div className='flex-div'>
              <div className='left-panel'>
                <h3>ECommerce Entry</h3>
                <h5>Mass import thousands of products on the XSPACE platform. By clicking confirm, you have reviewed all information to be correct. To make new
                  changes to your entry, click the Back Button.</h5>
              </div>
              <div>
                <StyledButton className='filled-btn small-btn' onClick={this.toggle}>Import</StyledButton>
                {/* {enqueueAllButton} */}
              </div>              
            </div>}
            {this.props.step === 2 && <h3>Review Import List</h3>}
            {this.props.step === 1 && <div className='list-wrapper'>
              <div className='list-panel'>
                <div><div className='list-header'>
                  <span>{`${store} Product List`}</span>
                  <button onClick={this.queueProducts}>Add To Your Product List</button>
                  <button onClick={this.enqueueAll}>Import All</button>
                </div>
                <div className='list-body'>{importViews}</div>
              </div>
              </div>
              <div className='list-panel'>
                <div className='list-header'>
                  <span>Your Import List</span>
                  <button>Push To Store</button>
                </div>
                <div className='list-body'>{productViews}</div>
              </div>
            </div>}
            {this.props.step === 2 && <div className={'list-wrapper'}>
              <div className={'list-panel step2'}>
                <div className='list-header'>
                  <span>Import List</span>
                  <div>
                    <button onClick={this.queueProducts}>Add To Your Product List</button>
                    <button onClick={this.enqueueAll}>Import All</button>
                  </div>
                </div>
                <div className='list-body'>{productViews}</div>
              </div>
            </div>}
            {/* <h5>{totalView}</h5> */}
            {/* <div class="row">
              <div class="col-sm-5">
                <span> Products Per Page: </span>
                {quantity20}
                <span> | </span>
                {quantity50}
                <span> | </span>
                {quantity200}
                <span> | </span>
                {quantity500}
              </div>
              <div class="col-sm-3">
                {previousPage}
                {nextPage}
              </div>
              <div class="col-sm-3">
                <ul class="page-product">
                  <li class="animated fadeIn">Jump to Page:</li>
                  {pageView}
                </ul>
              </div>
            </div> */}
          </Wrapper>
        </div>
      </Container>
    );
  }
}
