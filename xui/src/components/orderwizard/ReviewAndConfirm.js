import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import ReactQuill from 'react-quill'

export default class ReviewAndConfirm extends Component {

  constructor(props) {
    super(props);
    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        dropdownOpenCat: false,
        editing: true,
        isDisabled: true,
        productData: [],
        product_count: this.props.fieldValues.selectedProductLists.length
    };
    this.toggle = this.toggle.bind(this);
    this.toggleCat = this.toggleCat.bind(this);
  }

  componentDidMount() {
      /*Load Selected Product*/
      this.props.loadSelectedProduct(this.state.product_count)
  }

  /*delete product from selected product list*/
  removeProduct = (id) => {
    const afterDeletedProduct = this.props.fieldValues.selectedProductLists.filter(function(product) {
      return product.productid !== parseInt(id.target.value);
    });
    this.props.fieldValues.selectedProductLists = afterDeletedProduct
    return this.props.fieldValues.selectedProductLists
  }

  toggle() {
      this.setState({
          dropdownOpen: !this.state.dropdownOpen
      });
  }

  toggleNote = (event) => {
    this.setState({
        currentProduct: parseInt(event.target.value)
    });
  }

  toggleCat() {
      this.setState({
          dropdownOpenCat: !this.state.dropdownOpenCat
      });
  }

  render() {

    let orderingDropDown = (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav caret><p>Descending</p></DropdownToggle>
        <DropdownMenu>
            <DropdownItem href="#">Ascending</DropdownItem>
            <DropdownItem href="#">Descending</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )

    return (
        <div>
          <div class="animated fadeIn" style={{width:1019}}>
            <div class="row" style={{width:1030 }}>
              <div style={{width:1110,height: 62,background: '#4F4F4F', marginLeft: -87,marginTop: -40 }}>
                <form className="form-inline my-2 my-lg-0">
                  <div className="row">
                    <div className="col-sm-1">
                      <span className="select-one-product" style={{position: 'absolute', width: 115}}>Standard For Entire Order:</span>
                    </div>
                    <div className="col-sm-2" style={{width: 281}}>
                      <select className="form-control edit-accinbox" id="sel1" value={this.state.value} onChange={this.handleChange} style={{fontFamily: 'Roboto', marginLeft: 40, marginTop: 12}}>
                        <option value="English_us">Mike's Appearal Store Standard</option>
                        <option value="English_uk">Select Store</option>
                      </select>
                    </div>
                    <div className="col-sm-2" style={{marginLeft: 90}}>
                      <span className="select-one-product" style={{position: 'absolute', width: 196}}>Specify Catpure Order For Multiple Products</span>
                    </div>
                    <div className="col-sm-1">
                      <span className="select-one-product" style={{position: 'absolute', width: 105, marginLeft: 20}}>Sort By Name(A-Z):</span>
                    </div>
                    <div className="col-sm-2" style={{width: 281}}>
                      <select className="form-control edit-accinbox" id="sel1" value={this.state.value} onChange={this.handleChange} style={{fontFamily: 'Roboto', marginLeft: 22, marginTop: 12}}>
                        <option value="English_us">Descending</option>
                        <option value="English_uk">Ascending</option>
                      </select>
                    </div>
                    <div className="col-sm-2" style={{width: 360}}>
                      {/*<Button color="pre-next-button" onClick={ this.previousStep } style={{marginTop: 13}}>Prev Page</Button>
                                            <Button color="pre-next-button" onClick={ this.previousStep } style={{marginLeft:140, marginTop: -69}}>Next Page</Button>*/}
                    </div>
                  </div>

                </form>
              </div>
            </div>
            {
              this.props.fieldValues.selectedProductLists.map((product, index) =>(
                <div class="pce-order-card" key={product.productid}>
                  <div class="pce-card-top">
                    <div class="row">
                      <div className="col-sm-1 overide-width-1">
                        <span className="order-header-name">Product Name</span>
                        <p className="order-header-name-val">{product.name}</p>
                      </div>
                      <div class="col-sm-1 overide-width-1">
                        <span className="order-header-name">Xspace Sku</span>
                        <p className="order-header-name-val">{this.props.truncateChar(product.uniqueID)} </p>
                      </div>
                      <div class="col-sm-1 overide-width-1">
                        <span className="order-header-name">Product Sku</span>
                        <p className="order-header-name-val">{product.SKU}</p>
                      </div>
                      <div class="col-sm-1 overide-width-1">
                        <span className="order-header-name">Product Upc</span>
                        <p className="order-header-name-val">{product.UPCType}</p>
                      </div>
                      <div className="col-sm-1 overide-width">
                        <input type="checkbox" className="check-box-pce-card" checked={product.is2drequired} disabled={this.state.isDisabled} />
                      </div>
                      <div class="col-sm-1 overide-width-1">
                        <span className="order-header-name" style={{marginLeft: -7}}>Order 2D Photos</span>
                      </div>
                      <div className="col-sm-1 overide-width">
                        <input type="checkbox" className="check-box-pce-card" checked={product.is360viewrequired} disabled={this.state.isDisabled} />
                      </div>
                      <div class="col-sm-2 views-360">
                        <span className="order-header-name">Order 360 Views</span>
                      </div>
                      <div className="col-sm-1 overide-width">
                        <input type="checkbox" className="check-box-pce-card" checked={product.is3dmodelrequired} disabled={this.state.isDisabled} />
                      </div>
                      <div class="col-sm-2 views-360">
                        <span className="order-header-name" style={{marginLeft: -2}}>Order A 3D Model<br/>(VR/AR)</span>
                      </div>
                      <div className="col-sm-1 overide-width">
                        <input type="checkbox" className="check-box-pce-card" checked={product.isvideorequired} disabled={this.state.isDisabled} />
                      </div>
                      <div class="col-sm-2 views-360">
                        <span className="order-header-name">Order Video</span>
                      </div>
                      <Button color="pre-note-button note-button" onClick={this.toggleNote} value={product.productid} style={{width:60, height:35, marginLeft:-31}}><span style={{marginLeft:0}}>Views<i class="fa fa-angle-down" aria-hidden="true" style={{marginTop:-5}}></i><br/> Notes</span> </Button>
                      <Button type="submit" color="pre-remove-button note-button" style={{width:80, height:35, marginLeft:39}} value={product.productid}><span style={{marginLeft:-11}}><i class="fa fa-times" aria-hidden="true" style={{marginTop:-5}}></i> Remove<br/> From<br/> Order</span> </Button>
                    </div>
                    { this.state.currentProduct == product.productid ?
                      <div className="row">
                        <div className="col-sm-2 textarea-width">
                          <span className="order-header-name" style={{fontWeight: 'bold'}}>Add Order Notes</span><br/>
                          <span className="order-header-name">Add Your Own Notes To Each Product For Our Catpure Team.(1200 Characters Max Per Box)</span>
                        </div>
                        <div className="col-sm-2 textarea-width">
                          <span className="order-header-name" style={{fontSize: 9}}>2D Photos Order Notes</span>
                          <textarea disabled={this.state.isDisabled} className="add-note-text-box" name="comment_2d" id={product.productid} value={product.notes2d} onChange={this.handleInputChange} />
                        </div>
                        <div className="col-sm-2 textarea-width">
                          <span className="order-header-name" style={{fontSize: 9}}>360 View Order Notes</span>
                          <textarea disabled={this.state.isDisabled} className="add-note-text-box" name="comment_360" id={product.productid} value={product.notes360view} onChange={this.handleInputChange} />
                        </div>
                        <div className="col-sm-2 textarea-width">
                          <span className="order-header-name" style={{fontSize: 9}}>3D Model Order Notes</span>
                          <textarea disabled={this.state.isDisabled} className="add-note-text-box" name="comment_3d" id={product.productid} value={product.notes3dmodel} onChange={this.handleInputChange} />
                        </div>
                        <div className="col-sm-2 textarea-width">
                          <span className="order-header-name" style={{fontSize: 9}}>Video Order Notes</span>
                          <textarea disabled={this.state.isDisabled} className="add-note-text-box" name="comment_video" id={product.productid} value={product.notesvideo} onChange={this.handleInputChange} />
                        </div>

                      </div> : ''
                    }
                  </div>
                  <div class="pce-card-foot">
                    <div class="row">
                      <div class="col-sm-2">
                        <span className="pce-card-foot-id">&#35;{index + 1}</span>
                      </div>
                      <div class="col-sm-1 pce-card-foot-width-1">
                         <span className="pce-card-foot-id">Status:</span>
                      </div>
                      <div class="col-sm-2 order-button-one">
                        <span className="order-button-text">Unpublished</span>
                      </div>
                      <div class="col-sm-2 order-button-two">
                        <span className="order-button-text">2D Photos</span>
                      </div>
                      <div class="col-sm-2 order-button-three">
                        <span className="order-button-text">360 Views</span>
                      </div>
                      <div class="col-sm-1 order-button-four">
                        <span className="order-button-text">AR/VR</span>
                      </div>
                      <div class="col-sm-1 order-button-five">
                        <span className="order-button-text">Video</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
    );
  }
}
