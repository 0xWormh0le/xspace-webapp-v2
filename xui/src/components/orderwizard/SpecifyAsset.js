import React, { Component } from 'react';
import { Input, Label, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import ReactQuill from 'react-quill'

export default class SpecifyAsset extends Component {

  constructor(props) {
    super(props);
    this.state = {
        editing: true,
        isAddNote: false,
        currentProduct: null,
        productList: {},
    };

    this.toggleNoteVideo = this.toggleNoteVideo.bind(this);
    this.toggleNote360 = this.toggleNote360.bind(this);
    this.toggleNote2d = this.toggleNote2d.bind(this);
    this.toggleNote3D = this.toggleNote3D.bind(this);

  }

  componentDidMount() {

  }

  toggleNote3D(event){

    this.props.fieldValues.selectedProductLists.map((product, index) => {
      if(parseInt(event.target.value) === product.productid){
        this.props.fieldValues.selectedProductLists[index]['is3dmodelrequired'] = event.target.checked;
      }
    });

  }

  toggleNote2d(event){

    this.props.fieldValues.selectedProductLists.map((product, index) => {
      if(parseInt(event.target.value) === product.productid){
        this.props.fieldValues.selectedProductLists[index]['is2drequired'] = event.target.checked;
      }
    });
  }

  toggleNote360(event){

    this.props.fieldValues.selectedProductLists.map((product, index) => {
      if(parseInt(event.target.value) === product.productid){
        this.props.fieldValues.selectedProductLists[index]['is360viewrequired'] = event.target.checked;
      }
    });
  }

  toggleNoteVideo(event){

    this.props.fieldValues.selectedProductLists.map((product, index) => {
      if(parseInt(event.target.value) === product.productid){
        this.props.fieldValues.selectedProductLists[index]['isvideorequired'] = event.target.checked;
      }
    });
  }

  toggleNote = (event) => {
    this.setState({
        currentProduct: parseInt(event.target.value)
    });
    return this.props.fieldValues.selectedProductLists
  }

  handleInputChange = (event) => {
      const target = event.target,
          value = target.type ===
          'checkbox' ? target.checked : target.value,
        name = target.name

      this.setState({
          [name]: value
      });

      this.props.fieldValues.selectedProductLists.map((product, index) => {
        if(parseInt(event.target.id) == product.productid && event.target.name == 'comment_2d'){
          this.props.fieldValues.selectedProductLists[index]['notes2d'] = event.target.value;
        }else if(parseInt(event.target.id) == product.productid && event.target.name == 'comment_360'){
          this.props.fieldValues.selectedProductLists[index]['notes360view'] = event.target.value;
        }else if(parseInt(event.target.id) == product.productid && event.target.name == 'comment_3d'){
          this.props.fieldValues.selectedProductLists[index]['notes3dmodel'] = event.target.value;
        }else if(parseInt(event.target.id) == product.productid && event.target.name == 'comment_video'){
          this.props.fieldValues.selectedProductLists[index]['notesvideo'] = event.target.value;
        }
      });
  }

  render() {
    return (
        <div>
          <div className="animated fadeIn" style={{width:1019}}>
            <div className="row" style={{width:1030 }}>
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
                    <div className="col-sm-1" style={{marginLeft: 12}}>
                      <span className="select-one-product" style={{position: 'absolute', width: 105}}>Sort By Name(A-Z):</span>
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
                <div className="pce-order-card" key={product.productid}>
                  <div className="pce-card-top">
                    <div className="row">
                      <div className="col-sm-1 overide-width-1">
                        <span className="order-header-name">Product Name</span>
                        <p className="order-header-name-val">{product.name}</p>
                      </div>
                      <div class="col-sm-1 overide-width-1">
                        <span className="order-header-name">Xspace Sku</span>
                        <p className="order-header-name-val"> {this.props.truncateChar(product.uniqueID)} </p>
                      </div>
                      <div className="col-sm-1 overide-width-1">
                        <span className="order-header-name">Product Sku</span>
                        <p className="order-header-name-val">{product.SKU}</p>
                      </div>
                      <div className="col-sm-1 overide-width-1">
                        <span className="order-header-name">Product Upc</span>
                        <p className="order-header-name-val">{product.UPCType}</p>
                      </div>
                      <div className="col-sm-1 overide-width">
                        <input type="checkbox" className="check-box-pce-card" onChange={this.toggleNote2d} value={product.productid} />
                      </div>
                      <div className="col-sm-1 overide-width-1">
                        <span className="order-header-name" style={{marginLeft: -7}}>Order 2D Photos</span>
                      </div>
                      <div className="col-sm-1 overide-width">
                        <input type="checkbox" className="check-box-pce-card" onChange={this.toggleNote360} value={product.productid} />
                      </div>
                      <div className="col-sm-2 views-360">
                        <span className="order-header-name">Order 360 Views</span>
                      </div>
                      <div className="col-sm-1 overide-width">
                        <input type="checkbox" className="check-box-pce-card" onChange={this.toggleNote3D} value={product.productid} />
                      </div>
                      <div className="col-sm-2 views-360">
                        <span className="order-header-name" style={{marginLeft: -2}}>Order A 3D Model<br/>(VR/AR)</span>
                      </div>
                      <div className="col-sm-1 overide-width">
                        <input type="checkbox" className="check-box-pce-card" onChange={this.toggleNoteVideo} value={product.productid} />
                      </div>
                      <div className="col-sm-2 views-360">
                        <span className="order-header-name">Order Video</span>
                      </div>
                      <Button color="pre-next-button note-button" onClick={this.toggleNote} value={product.productid} style={{marginLeft: 20, width:93, height:45}}>Add Order <i className="fa fa-angle-down" aria-hidden="true"></i><br/> Notes </Button>
                    </div>
                    { this.state.currentProduct == product.productid ?
                      <div className="row">
                        <div className="col-sm-2 textarea-width">
                          <span className="order-header-name" style={{fontWeight: 'bold'}}>Add Order Notes</span><br/>
                          <span className="order-header-name">Add Your Own Notes To Each Product For Our Catpure Team.(1200 Characters Max Per Box)</span>
                        </div>
                        <div className="col-sm-2 textarea-width">
                          <span className="order-header-name" style={{fontSize: 9}}>2D Photos Order Notes</span>
                          <textarea placeholder="ADD NOTES HERE.." className="add-note-text-box" name="comment_2d" id={product.productid} onChange={this.handleInputChange} />
                        </div>
                        <div className="col-sm-2 textarea-width">
                          <span className="order-header-name" style={{fontSize: 9}}>360 View Order Notes</span>
                          <textarea placeholder="ADD NOTES HERE.." className="add-note-text-box" name="comment_360" id={product.productid} onChange={this.handleInputChange} />
                        </div>
                        <div className="col-sm-2 textarea-width">
                          <span className="order-header-name" style={{fontSize: 9}}>3D Model Order Notes</span>
                          <textarea placeholder="ADD NOTES HERE.." className="add-note-text-box" name="comment_3d" id={product.productid} onChange={this.handleInputChange} />
                        </div>
                        <div className="col-sm-2 textarea-width">
                          <span className="order-header-name" style={{fontSize: 9}}>Video Order Notes</span>
                          <textarea placeholder="ADD NOTES HERE.." className="add-note-text-box" name="comment_video" id={product.productid} onChange={this.handleInputChange} />
                        </div>

                      </div> : ''
                    }
                  </div>
                  <div className="pce-card-foot">
                    <div className="row">
                      <div className="col-sm-2">
                        <span className="pce-card-foot-id">&#35;{index}</span>
                      </div>
                      <div className="col-sm-1 pce-card-foot-width-1">
                         <span className="pce-card-foot-id">Status:</span>
                      </div>
                      <div className="col-sm-2 order-button-one">
                        <span className="order-button-text">Unpublished</span>
                      </div>

                      <div className="col-sm-2 order-button-two">
                        <span className="order-button-text">2D Photos</span>
                      </div>
                      <div className="col-sm-2 order-button-three">
                        <span className="order-button-text">360 Views</span>
                      </div>
                      <div className="col-sm-1 order-button-four">
                        <span className="order-button-text">AR/VR</span>
                      </div>
                      <div className="col-sm-1 order-button-five">
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
