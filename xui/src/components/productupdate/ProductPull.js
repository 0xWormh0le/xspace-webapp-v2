import React, {Component} from 'react'
import styled from 'styled-components'
import  Loader from 'react-loader'
import { Container, Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'mdbreact'

import ProductModal from './ProductModal'
import ProductImportView from './ProductImportView'

export const Wrapper = styled.div`
  flex: 1;
  .wrapper-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      margin: 0;
      font-size: 12px;
      color: #333330;
      font-weight: bold;
      line-height: 20px;
    }
    i {
      background-color: #00A3FF;
      width: 15px;
      height: 15px;
      border-radius: 100%;
      color: white;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      :hover {
        cursor: pointer;
      }
    }
    button {
      color: #00A3FF;
      font-size: 12px;
      font-weight: bold;
      line-height: 20px;
      border: none;
      :hover {
        border-radius: 19px;
        background-color: #00A3FF;
        color: white;
      }
    }
  }
  .wrapper-boddy {

  }
`

class ProductPull extends Component {
  constructor(props) {
      super(props);

      this.state = {
        'storeProducts':[],
        'quantity': 10,
        'page': 1,
        'Uploaded': '',
        'isLoaded': false,
        'isSubmitted': false,
        'totalProduct' : '',
        'selectedProducts': [],
        'modal': false,
        'store': "Shopify",
        'dropdownOpen': false
      }
      this.openToggle = this.openToggle.bind(this)
      this.closeToggle = this.closeToggle.bind(this)
      this.enqueue = this.enqueue.bind(this)
      this.compareProduct = this.compareProduct.bind(this)
      this.pullFromStore = this.pullFromStore.bind(this)
      this.handleInputChange = this.handleInputChange.bind(this);
      this.paginationClick = this.paginationClick.bind(this);
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
    
    paginationClick(event){
      this.setState({'storeProducts': [], 'isLoaded': false, page: Number(event.target.id)})
      this.props.productImportStore(this.props.storeType, event.target.id)
    }

    /*
     Purpose: After response from server state will be update
    */    
    componentWillReceiveProps(nextProps) {
      this.setState({
          'storeProducts':nextProps.products || '', 
          'totalProduct': nextProps.productCount || '', 
          'isLoaded': true, 
          'Uploaded': nextProps.products ? nextProps.products.message : '',
          'selectedProducts': []
      })
    }

    /*
     Purpose: Pushed checked product into seperate array
    */
    enqueue(idx,flag) {
      let { storeProducts, selectedProducts} = this.state
      storeProducts[idx].queued = flag
      selectedProducts.push(storeProducts[idx])
      this.setState({'selectedProducts':selectedProducts})
    }

    /*
     Purpose: Pop Unchecked product from array
    */
    removeProductFromQueue(idx, flag) {
      let {selectedProducts, storeProducts} = this.state
      storeProducts[idx].queued = flag
      selectedProducts.splice(idx, 1);
      this.setState({'selectedProducts':selectedProducts, 'storeProducts': storeProducts})
    }

    /*
     Purpose: Export to Xspace from Store
    */
    pullFromStore(){
      let { selectedProducts } = this.state;
      let marshalledProducts = [];
      selectedProducts.map((product) => {
        let p = {}
        p["ecommerce_id"] = product["id"]
        p["name"] = product["name"]
        p["SKU"] = product["sku"] || " "
        p["length"] = product["length"] || "0.0"
        p["width"] = product["width"] || "0.0"
        p["height"] = product["height"] || "0.0"
        p["price"] = product["price"] || "0.0"
        p["category"] = product["categories_ids"]
        p["description"] = product["description"]
        marshalledProducts.push(p)
      });
      this.setState({'isSubmitted': true, 'isLoaded': false})
      this.props.createProducts({"product_list":marshalledProducts, "type": this.props.storeType})
    }

    compareProduct(){

    }

    openToggle() {
      this.setState({'storeProducts': [], 'isLoaded': false})
      this.props.productImportStore(this.props.storeType, 1)
      this.setState({
        modal: !this.state.modal
      })
    }

    closeToggle() {
      this.setState({
        modal: !this.state.modal
      })
    }

  render() {
    let { storeProducts, page, quantity, queueAll, store, selectedProducts, totalProduct, isLoaded, isSubmitted, Uploaded} = this.state
    let productName = (<span className="product-update-name"></span>)
    let productUPC = (<div></div>)
    let productSKU = (<div></div>)
    let productStatus = (<div style={{marginLeft: -5}}>Status #: </div>)
    let productPermissions = (<div style={{marginLeft: -5}}>Permissions #: </div>)
    let importViews = []
    let productViews = []
    
    if (storeProducts && storeProducts.length>0) {
      for (var idx = 0; idx < storeProducts.length; idx++) {
        if (storeProducts[idx])
          importViews.push((<ProductModal product={storeProducts[idx]} key={idx} index={idx} enqueue={this.enqueue} remove={this.removeProductFromQueue}></ProductModal>))
      }
    }
    
  /* Logic for calculating page numbers */
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalProduct / quantity); i++) {
      if(pageNumbers.length <= 3){
        pageNumbers.push(i);
      }else{

      }
      
    }

    /* Logic for displaying page numbers */
    const renderPageNumbers = pageNumbers.map(number => {
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
              <p>Products To Update Queue</p>
              {/* <Button onClick={this.openToggle}>Add Products To Receive Updates</Button> */}
              <i className="fa fa-plus" onClick={this.openToggle} />
              <button onClick={this.pullFromStore}>Pull From Store</button>
            </div>
            <div className='wrapper-body'>
              {productViews}
            </div>
          </Wrapper>      
          { isSubmitted && (
            <div style={{top: 280, position: 'absolute'}}>
              <Loader loaded={isLoaded} lines={13} length={20} width={10} radius={30}
                corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
                trail={60} shadow={false} hwaccel={false} className="spinner"
                zIndex={2e9} bottom="80px" left="340px" scale={1.00}
                loadedClassName="loadedContent" />
                <h4 style={{color: '#70C09C', marginLeft: 110,marginTop: -83}}>{Uploaded}</h4>
            </div>
          )}
          <Modal isopen={this.state.modal} toggle={this.toggle} size="lg">
            <ModalHeader>
              Add Products To Pull From Store  
            </ModalHeader>
            <ModalBody style={{width: 770, background: '#F2F2F2', border: '2px solid #B8B8B8',marginLeft: 15,marginTop: 8}}>
            
              <div className="row">
                <div className="col-sm-12" style={{width: 800, height: 55, background: '#333333', marginTop: -16}}>
                  <div className="col-sm-3">
                    <span className="modal-pop-text">Select the product you'd like to pull info from.</span>
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
                { !isLoaded && (
                  <div style={{marginTop: 200}}>
                    <Loader loaded={isLoaded} lines={13} length={20} width={10} radius={30}
                      corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
                      trail={60} shadow={false} hwaccel={false} className="spinner"
                      zIndex={2e9} bottom="80px" left="340px" scale={1.00}
                      loadedClassName="loadedContent" />
                  </div>
                 )}
              </div>
            </ModalBody>
            <div className="row" style={{marginTop: 14, background: '#F2F2F2', width: 799, marginLeft: 0}}>
              <div className="col-sm-4"></div>
              <div className="col-sm-4" style={{border: '2px solid rgb(184, 184, 184)', width: 252, height: 61}}>
                <ul className="page-product" style={{marginTop: 17}}>
                  <li className="in-active-page">
                    <a className="" href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                      <span className="sr-only">Previous</span>
                    </a>
                  </li>
                  {renderPageNumbers}
                  <li className="in-active-page">
                    <a className="" href="#" aria-label="Next" style={{pointerEvents:'none'}}>
                      <span aria-hidden="true">&raquo;</span>
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-sm-4"></div>
            </div>
          <ModalFooter>
            <Button className="add-product-buttton" color="red" style={{height: 50 }} onClick={this.closeToggle}>Cancel</Button>
            <Button className="add-product-buttton pull-right" color="green" onClick={this.closeToggle}>Add Selected Product(s)</Button>
          </ModalFooter>
        </Modal>
      </Container>      
      </React.Fragment>
    )
  }
}

export default ProductPull;