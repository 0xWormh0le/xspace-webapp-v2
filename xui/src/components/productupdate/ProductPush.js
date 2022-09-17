import React, {Component} from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Container, Modal, ModalHeader, ModalBody, ModalFooter} from 'mdbreact'
import ProductModal from './ProductModal'
import ProductImportView from './ProductImportView'
import { Wrapper } from './ProductPull'

class ProductPush extends Component {
  constructor(props) {
      super(props);

      this.state = {
        'products':[],
        'quantity': 10,
        'page': 1,
        'currentPageList': [],
        'totalProduct': '',
        'queuedProducts': [],
        'pageNumbers': [],
        'selectedProducts': [],
        'modal': false,
        'showStatus': false,
        'store': "Shopify",
        'dropdownOpen': false
      }
      this.openToggle = this.openToggle.bind(this)
      this.closeToggle = this.closeToggle.bind(this)
      this.enqueue = this.enqueue.bind(this)
      this.removeProductFromQueue = this.removeProductFromQueue.bind(this)
      this.paginationClick = this.paginationClick.bind(this)
      this.exportToStore = this.exportToStore.bind(this)
      this.previousPage = this.previousPage.bind(this)
    }

    componentDidMount() {

    }


    paginationClick(event){
      this.setState({
        page: Number(event.target.id)
      });
      this.props.importFromXspace(event.target.id)
    }

    previousPage(event){
      let { page } = this.state
      if(page > 1){
          this.setState({
            page: page - 1
          });
        this.props.importFromXspace(page-1)  
      }
    }

    /*
     Purpose: After response from server state will be update
    */
    componentWillReceiveProps(nextProps) {
      /* Logic for calculating page numbers */
      if(nextProps.products){
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(nextProps.products.total_counts / 3); i++) {
          pageNumbers.push(i);
        }
        this.setState({'queuedProducts':nextProps.products.result || '', 'totalProduct': nextProps.products.total_counts || '', 'pageNumbers': pageNumbers})  
      }
      
    }

    /*
     Purpose: Import selected product to store
    */
    exportToStore(){
      let { selectedProducts } = this.state;
      this.props.exportToStore({"product_list":selectedProducts})
    }

    /*
     Purpose: Pushed checked product into seperate array
    */
    enqueue(idx,flag) {
      let { queuedProducts, selectedProducts} = this.state
      queuedProducts[idx].queued = flag
      selectedProducts.push(queuedProducts[idx])
      this.setState({'selectedProducts':selectedProducts})
    }

    /*
     Purpose: Pop Unchecked product from array
    */
    removeProductFromQueue(idx, flag) {
      let {selectedProducts, queuedProducts} = this.state
      queuedProducts[idx].queued = flag
      selectedProducts.splice(idx, 1);
      this.setState({'selectedProducts':selectedProducts, 'queuedProducts': queuedProducts})
    }

    /*
     Purpose: Open Modal pop up for product selection
    */
    openToggle() {
      this.props.importFromXspace(1)
      this.setState({
        modal: !this.state.modal,
        showStatus: true
      })
    }

    /*
     Purpose: Close Modal pop up for product selection
    */
    closeToggle() {
      this.setState({
        modal: !this.state.modal
      })
    }


  render() {
    let { products, queuedProducts, page, quantity, queueAll, store, selectedProducts, totalProduct, pageNumbers } = this.state
    
    let productName = (<span className="product-update-name"></span>)
    let productUPC = (<div></div>)
    let productSKU = (<div></div>)
    let productStatus = (<div style={{marginLeft: -5}}>Status #: </div>)
    let productPermissions = (<div style={{marginLeft: -5}}>Permissions #: </div>)
    let importViews = []
    let productViews = []

    if (queuedProducts && queuedProducts.length>0) {
      for (var idx = 0; idx < queuedProducts.length; idx++) {
        importViews.push((<ProductModal product={queuedProducts[idx]} key={idx} index={idx} enqueue={this.enqueue} remove={this.removeProductFromQueue} showStatus={this.state.showStatus}></ProductModal>))
      }
    }

    console.log(pageNumbers)
    // Logic for displaying todos
    const indexOfFirstTodo = page - 1;
    const indexOfLastTodo = indexOfFirstTodo + 3;
    const currentPageList = pageNumbers.slice(indexOfFirstTodo, indexOfLastTodo);

    /* Logic for displaying page numbers */
    const renderPageNumbers = currentPageList.map(number => {
      return (
        <li
          className={number == page ? 'active-page' : 'in-active-page'}
          key={number}
          id={number}
          onClick={this.paginationClick}
        >
          {number}
        </li>
      );
    });

    if(selectedProducts && selectedProducts.length>0){
      for (var idx = 0; idx < selectedProducts.length; idx++) {
        productViews.push((<ProductImportView product={selectedProducts[idx]} key={idx} index={idx} remove={this.removeProductFromQueue}></ProductImportView>))  
      } 
    }

    return (
      <React.Fragment>
        <Container>
          <Wrapper>
            <div className='wrapper-header'>
              <p>Products To Push Queue</p>
              {/* <Button onClick={this.openToggle}>Add Products To Receive Updates</Button> */}
              <i className="fa fa-plus" onClick={this.openToggle} />
              <button onClick={this.exportToStore}>Push To Store</button>
            </div>
            <div className='wrapper-body'>
              {productViews}
            </div>
          </Wrapper>
          <Modal isopen={this.state.modal} toggle={this.toggle} size="lg">
            <ModalHeader>
              Add Products To Push From Store  
            </ModalHeader>
            <ModalBody style={{width: 770, background: '#F2F2F2', border: '2px solid #B8B8B8',marginLeft: 15,marginTop: 8}}>            
              <div className="row">
                <div className="col-sm-12" style={{width: 800, height: 55, background: '#333333', marginTop: -16}}>
                  <div className="col-sm-3">
                    <span className="modal-pop-text">Select the product you'd like to push info from.</span>
                  </div>
                  <div className="col-sm-8 pull-right" style={{marginTop: -6, paddingLeft: 58}}>
                    <input type="text" placeholder="Quick Search By Name, Upc, Sku'S " name="searchQuery" className="order-search" onChange={this.handleInputChange}/>
                    <button type="submit" className="order-search-button">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </div>
                
                  <div className="scroll-container" style={{height: 300,background: '#F2F2F2'}}>
                    {importViews}
                  </div>
              </div>
            </ModalBody>
            <div className="row" style={{marginTop: 14}}>
              <div className="col-sm-4"></div>
              <div className="col-sm-4" style={{border: '2px solid rgb(184, 184, 184)', width: 252, height: 61}}>
                <ul className="page-product" style={{marginTop: 13, marginLeft: -21}}>
                  <li className="in-active-page">
                    <a className="" aria-label="Previous" onClick={this.previousPage}>
                      <span aria-hidden="true">&laquo;</span>
                      <span className="sr-only">Previous</span>
                    </a>
                  </li>
                  
                  {renderPageNumbers}
                  <li className="in-active-page">
                    <a className="" href="#" aria-label="Next" style={{pointerEvents:'none'}} onClick={this.nextPage}>
                      <span aria-hidden="true">&raquo;</span>
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-sm-4"></div>
            </div>
            <ModalFooter>
              <Button className="add-product-buttton" color="red" style={{height: 50}} onClick={this.closeToggle}>Cancel</Button>
              <Button className="add-product-buttton pull-right" color="green" onClick={this.closeToggle}>Add Selected Product(s)</Button>
            </ModalFooter>
          </Modal>
        </Container>        
      </React.Fragment>
    )
  }
}

export default ProductPush;