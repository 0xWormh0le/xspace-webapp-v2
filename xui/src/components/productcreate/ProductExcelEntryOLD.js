import React, { Component } from 'react';
import styled from 'styled-components'
import { MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import ProductExcelCell from './ProductExcelCell';
import uploadImg from '../../assets/img/upload.png'
import ReactQuill from 'react-quill';
const Wrapper = styled.div`
  h3, h5 {
    font-size: 18px;
    line-height: 26px;
    color: #333330;
    font-weight: 400;
  }
  h5 {
    font-size: 14px;
    line-height: 20px;
    opacity: .5;
    max-width: 50%;
    margin-bottom: 15px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
  a {
    margin-top: 23px;
    margin-bottom: 29px;
    // background-color: #00A3FF;
    background-color: #3eb2ff;
    width: 300px;
    height: 38px;
    border-radius: 19px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    margin-left: auto;
    margin-right: auto;
    :hover {
      box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
    }
  }
  .upload-img {
    margin-right: 10px;
    width: 32px;
    height: 32px;
  }
  input {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    display: block;
    :hover {
      cursor: pointer;
    }
  }
  span {
    font-size: 14px;
    color: #333330;
    opacity: .5;
    line-height: 20px;
  }
`

export default class ProductExcelEntry extends Component {

  constructor(props) {
    super(props);

    this.state = {
      'productUpload':this.props.upload,
      'products':[],
      'queuedProducts':[],
      'quantity': 20,
      'page': 1,
      'active': false,
      'loaded': false,
      'baseColor': 'gray',
      'activeColor': 'green',
      'overlayColor': 'rgba(255, 255, 255, 0.3)',
      'hasUploaded': false,
      "deleteModalIndex": 0,
      "deleteModalVisible": false,
      "deleteModalMessage": "Are you sure want to delete this item?"
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
    this.validate = this.validate.bind(this)
    this.validateAll = this.validateAll.bind(this)
    this.updateProductInQueue = this.updateProductInQueue.bind(this)
    this.deleteProductInQueue = this.deleteProductInQueue.bind(this)

    this.onDragEnter  = this.onDragEnter.bind(this);
    this.onDragLeave  = this.onDragLeave.bind(this);
    this.onDrop       = this.onDrop.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.deleteModalToggle = this.deleteModalToggle.bind(this);
  }

  componentDidMount() {
    this.setState({'productUpload':this.props.upload})
    console.log("MOUNTED")
  }

  componentWillReceiveProps(nextProps) {

    if (!nextProps.evaluated) {
      this.setState({'productUpload':this.props.upload})
      console.log('product.result.res', nextProps.products);
      let list = nextProps.products.result.res
      console.log(list[0]);
      let prdxs = []
      if (list) {
        for (var i=0; i < list.length; i++) {
          let prod = list[i]
          prod.queued = false
          prdxs.push(prod)
        }
        this.setState({'products':prdxs, 'hasUploaded': true},() => {

        })
      }
    }

    // eslint-disable-next-line eqeqeq
    if (nextProps.submitting === true && this.props.submitting === false) {
      let { products } = this.state;
      console.log("SUBMITTNG PRODUCTS");
      let marshalledProducts = [];
      products.map((product) => {

        let p = {}
        p["name"] = product["name"]
        p["description"] = product["description"]
        p["SKU"] = product["SKU"]
        p["upccode"] = product["upccode"]
        p["UPCType"] = product["UPCType"]
        p["manufacturer"] = product["manufacturer"]
        p["category"] = product["category"]
        p["length"] = product["length"]
        p["width"] = product["width"]
        p["height"] = product["height"]
        p["price"] = product["price"]
        marshalledProducts.push(p)
      });

      this.props.submit({"product_list":marshalledProducts}).then((res)=> {
        alert("Your products were submitted successfully!")
        this.props.finish()
      }).catch((err)=> {
        alert("There was an error. " + err)
      })
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

  uploadFiles(files) {

    if (files) {
      this.props.upload(files[0])
    } else {
      console.log("SELECT A VALID FILE")
    }
  }

  removeProductFromQueue(idx) {
    this.setState({"deleteModalVisible": true, "deleteModalIndex": idx, "deleteModalMessage": "Are you sure want to delete this item?"})
  }

  deleteModalToggle() {
    this.setState({"deleteModalVisible": !this.state.deleteModalVisible})
  }

  deleteProductInQueue(idx) {
    let oldProducts = this.state.products;
    oldProducts.splice(idx, 1);
    let newProducts = oldProducts
    this.setState({'products':newProducts, "deleteModalVisible": false}, () => {

    })
  }

  updateProductInQueue(idx, key, value) {
    let { products } = this.state
    products[idx][key] = value
    this.setState({'products':products})
  }

  enqueue(idx) {
    let oldProducts = this.state.products;
    oldProducts[idx].queued = !oldProducts[idx].queued
    let newProducts = oldProducts
    if (this.validate(newProducts[idx])) {
      this.setState({'products':newProducts},()=> {
        if (this.validateAll()) {
          this.props.evaluateProducts(true)
        } else {
          this.props.evaluateProducts(false)
        }
      })
    } else {
      alert("ERROR")
    }
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
      this.setState({'products':prdxs},() => {
        if (this.validateAll()) {
          this.props.evaluateProducts(true)
        } else {
          this.props.evaluateProducts(false)
        }
      })
    } else {
      alert("You must have at least one product selected.")
    }
  }

  validate() {


    // if ( prod['Manufacturer'] &&
    //   prod['Price'] &&
    //   prod['Product Category'] &&
    //   prod['Product Description'] &&
    //   prod['Product Height'] &&
    //   prod['Product Length'] &&
    //   prod['Product Name'] &&
    //   prod['Product SKU'] &&
    //   prod['Product UPC'] &&
    //   prod['Product Width'] &&
    //   prod['UPC Type']
    // ) {
    //   return true
    // }
    // else {
    //   return false
    // }
    return true
  }

  validateAll() {
    let { products } = this.state
    var j = 0
    var hasQueue = false
    while (j < products.length) {
      if (products[j].queued) {
        j = products.length
        hasQueue = true
      } else {
        hasQueue = false
      }
      j++
    }
    return hasQueue
  }

  onDragEnter(e) {
        this.setState({ active: true });
  }

  onDragLeave(e) {
      this.setState({ active: false });
  }

  onDragOver(e) {
      e.preventDefault();
  }

  onDrop(e) {
      e.preventDefault();
      this.setState({ active: false });
      this.state.productUpload(e.dataTransfer.files[0]).then(res => alert(
      "Product Importing is Complete! \n \nYour products have been successfully imported, but it looks like we had to modify the structure or format of the following items:\n\n"+
      String(res.payload.result['warnings']) +
      "\n\nYou can review and modify these entries by navigating to the Manage Products page. Entries that were not added were not modified."
      ));
  }

  getFileObject() {
    return this.refs.input.files[0];
  }

  getFileString() {
      return this.state.imageSrc;
  }

  render() {
    let { products, page, quantity, queueAll, hasUploaded, deleteModalVisible } = this.state

    // let productViews = products.map((product, idx) => {
    //   return
    // })

    let productViews = []

    let quantity20 = <a style={{display: 'inline'}} onClick={this.updateQuantity20} href="#">20</a>
    let quantity50 = <a style={{display: 'inline'}} onClick={this.updateQuantity50} href="#">50</a>
    let quantity200 = <a style={{display: 'inline'}} onClick={this.updateQuantity200} href="#">200</a>
    let quantity500 = <a style={{display: 'inline'}} onClick={this.updateQuantity500} href="#">500</a>

    let previousPage = <div></div>
    let nextPage = <div></div>
    let pageNum = []
    let pageView = <div></div>
    let totalView = <div></div>

    let markAll = <div></div>

    let deleteConfirmDialog = (
      <MDBModal isopen={deleteModalVisible} toggle={this.deleteModalToggle} size="lg" centered >
        <MDBModalHeader toggle={this.deleteModalToggle}><div className="row" style={{ marginLeft: '120px' }}>Action Permission</div></MDBModalHeader>
        <MDBModalBody>
          <div className="container">
            <div className="row">
              <b>{this.state.deleteModalMessage}</b>
            </div>
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="green" onClick={() => this.deleteProductInQueue(this.state.deleteModalIndex)}>Yes</Button>
          <Button color="red" onClick={() => this.deleteModalToggle()}>No</Button>
        </MDBModalFooter>
      </MDBModal>
    )

    if (products.length > 0) {
      markAll = <Button onClick={this.enqueueAll} color="light-green"><i class="fa fa-check-square" aria-hidden="true"></i>    Mark As All Correct</Button>
      for (var idx = (page - 1) * quantity; idx < page * quantity; idx++) {
        if (products[idx])
          productViews.push((<ProductExcelCell product={products[idx]} key={idx} index={idx} updateProductInQueue={this.updateProductInQueue} enqueue={this.enqueue} remove={this.removeProductFromQueue}></ProductExcelCell>))
      }
      for (var i = 0; i < products.length / quantity; i++) {
        pageNum.push(i)
      }
      pageView = pageNum.map((pg, idx) => {
        if (idx == this.state.page - 1) {
          return (<li key={pg} class="btnoff" onClick={() => this.toPage(idx + 1)}>{pg + 1}</li>)
        }
        return (<li key={pg} onClick={() => this.toPage(idx + 1)}>{pg + 1}</li>)
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
        quantity20 = <a class="btnoff" style={{display: 'inline'}}><strong>20</strong></a>
        break;
      case 50:
        quantity50 = <a class="btnoff" style={{display: 'inline'}}><strong>50</strong></a>
        break;
      case 200:
        quantity200 = <a class="btnoff" style={{display: 'inline'}}><strong>200</strong></a>
        break;
      case 500:
        quantity500 = <a class="btnoff" style={{display: 'inline'}}><strong>500</strong></a>
        break;
    }

    let state = this.state,
    labelClass  = `uploader ${state.loaded && 'loaded'}`,
    borderColor = state.active ? state.activeColor : state.baseColor,
    iconColor   = state.active
        ? state.activeColor
        : (state.loaded)
            ? state.overlayColor
            : state.baseColor;

    let pageBar = (<div></div>)
    if (hasUploaded) {
      pageBar = (
                <div class="row">
                  <div class="col-sm-5">
                    <span> Products Per Page:
                    {quantity20}
                     |
                    {quantity50}
                     |
                    {quantity200}
                     |
                    {quantity500}
                  </span>
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
              </div>
      )
    }

    console.log(this.state.products);
    if(this.state.products.length === 0){return (
      <Wrapper>

        <div class="animated">
          <div className="row">
          <div className="col-md">
            {deleteConfirmDialog}
            {/*<h3>1. Use Our Excel Template</h3>*/}
            <h5>Import your product data with ease by using our product import excel template.</h5>
            <a href="https://s3.amazonaws.com/storage.xspaceapp.com/media/xspace_product_import_template.xlsx" download target="_blank">Download Excel Template</a>
          </div>
          <div className="col-md">
            {/*<h3>2. Upload Template</h3>*/}
            <h5>Simply drop your excel sheet template file with your product data into the area below.</h5>
            <div
              className={labelClass}
              onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave}
              onDragOver={this.onDragOver}
              onDrop={this.onDrop}
              // onClick={}
              style={{outlineColor: borderColor}}>
              <img src={state.imageSrc} className={`uploadImg ${state.loaded && 'loaded'}`} alt=''/>
              <img className='upload-img' src={uploadImg} alt=''/>
              <span>Drag and drop file here.</span>
              <input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={ (e) => this.uploadFiles(e.target.files) }  ref="input" />
            </div>
          </div>
          </div>
          {productViews}
          <br />
          {pageBar}
          {markAll}
          {totalView}
        </div>
      </Wrapper>
    );
    }else{
    return(
        <Wrapper>
           <div>
           <button onClick={(e)=>this.setState({'products':[]})}>upload again?</button>
          {deleteConfirmDialog}
          {productViews}
          <br />
          {pageBar}
          {markAll}
          {totalView}
          </div>
          </Wrapper>
    )}
  }
}
