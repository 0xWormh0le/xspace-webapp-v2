import React, { Component } from 'react';
import styled from 'styled-components'
import { Input, Label, Button, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, Dropdown,
  DropdownItem, DropdownMenu, DropdownToggle, Container, Modal, ModalBody, ModalHeader, ModalFooter,
  MDBFormInline } from 'mdbreact';
import ReactQuill from 'react-quill'
import TextInput from '../../lib/TextInput';
import ReactHtmlParser from 'react-html-parser';
import {Select} from '../../lib/select'


const RequiredCircle = styled.span`
  width: 6px;
  height: 6px;
  display: block;
  background-color: #EB5757;
  border-radius: 6px;
`
const ContainerMine = styled.div`
  padding: 4px 65px;
`

const Wrapper = styled.div`
  .flex-div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }  
  .upc-wrapper {
    padding-bottom: 0px;
    > div:first-child {
      margin: 0;
      width: 100%;
    }
    select {
      width: 130px;
      margin-left: 15px;
      margin-bottom 16px;
    }
  }
  .category-dropdown {
    margin-bottom: 15px;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;      
    }
  }
  label, p {
    font-size: 18px;
    // color: #333330;
    color: #787878;
    line-height: 20px;
    margin: 1px;
    margin-bottom: 3px;
  }
  
  .quill {
    max-height: 300px;
    margin-bottom: 50px;
    height: 200px;
    .ql-toolbar.ql-snow {
      display: none;
    }
    .ql-container.ql-snow {
      border: 2px solid #F4F5FA;
      border-radius: 10px;
    }
    p {
      font-weight: bold;
    }
  }
  h5 {
    font-size: 14px;
    // color: #333333;
    color: #787878;
    line-height: 20px;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  h4 {
    font-size: 24px;
    // color: #333333;
    color: #787878;
    line-height: 20px;
    font-weight: normal;
    margin-bottom: 1rem;
  }
  
  #temp1 {
    font-size: 18px;
    color: #787878;
  }
  #temp2 {
    font-size: 18px;
    color: #787878;
  }
`

export default class ProductCreateEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        dropdownOpenCat: false,
        categoryDropDownOpen: false,
        editing: true,
        modal: false,
        categories: [{title:'Uncategorized'}],
        currentValue: '',
        selectedCategory: 24,
        selectedCategoryText: 'Uncategorized',
        upc: '',
        upcType: 'UPC-A',
        sku: '',
        manufacturer: '',
        name: '',
        description: '',
        descriptionHTML: '',
        price: 0.0,
        length: 0.0,
        width: 0.0,
        height: 0.0,
        rawResponse: '',
        error: {
          upc: '',
          upcType: '',
          sku: '',
          manufacturer: '',
          name: '',
          price: '',
          length: '',
          width: '',
          height: ''
        },
        checkbox: 1
    };

    this.toggle = this.toggle.bind(this);
    this.toggleCat = this.toggleCat.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.updateNameValue = this.updateNameValue.bind(this);
    this.updateDescriptionValue = this.updateDescriptionValue.bind(this);
    //this.updateUPCTypeValue = this.updateUPCTypeValue.bind(this);
    this.updateUPCValue = this.updateUPCValue.bind(this);
    this.updateSKUValue = this.updateSKUValue.bind(this);
    this.updateManufactureValue = this.updateManufactureValue.bind(this);
    this.updatePriceValue = this.updatePriceValue.bind(this);
    this.updateLengthValue = this.updateLengthValue.bind(this);
    this.updateWidthValue = this.updateWidthValue.bind(this);
    this.updateHeightValue = this.updateHeightValue.bind(this);
    this.checkValidity = this.checkValidity.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
  }

  state = {

  }

  componentDidMount() {
    this.getCategory();
  }

  getCategory(){
    this.props.categories()
      .then(res => {
        console.log('res', res)
        const cats = res.payload;
        
        const bats = cats.categories;
        
        this.setState({'categories':bats || '' })
        this.setState({'selectedCategoryText':bats[0].title || 'Uncategorized' })

      })
  }

  toggleCat(event) {
    this.setState({
      currentValue: event.target.value,
      selectedCategory: event.target.value
    });
  }

  toggleDialog() {
    this.setState({
      modal: !this.state.modal
    });
  }

  selectCategory(event) {
    const val = event.target.value;
    console.log("SELECTEDCATAGORY", event.target[val].label);
    this.setState({
      selectedCategory: event.target.value,
      selectedCategoryText: event.target[event.target.value].label
    });
  }


  checkValidity() {
    let namePass, skuPass, pricePass, upcPass, heightPass, widthPass, lengthPass;
    let {name, sku, price, upc, length, width, height} = this.state;
    let pass = true
    if (name === '') {
      namePass = 'Name field cannot be empty'
      pass = false
    }
    if (sku === '') {
      skuPass = 'SKU field cannot be empty'
      pass = false
    }
    // if (price == '') {
    //   pricePass = 'Price field cannot be empty'
    //   pass = false
    // }
    if (upc === '') {
      upcPass = 'UPC field cannot be empty'
      pass = false
    }
    if (height === '') {
      heightPass = 'Height field cannot be empty'
      pass = false
    }
    if (width === '') {
      widthPass = 'Width field cannot be empty'
      pass = false
    }
    if (length === '') {
      lengthPass = 'Length field cannot be empty'
      pass = false
    }

    if (pass === false) {
      this.setState(
        {'error':
          {
            'name':namePass,
            'sku':skuPass,
            'upc':upcPass,
            'price':pricePass,
            'height':heightPass,
            'width':widthPass,
            'length':lengthPass
          }
        }
      )
    }

    return pass
  }

  componentWillReceiveProps(nextProps) {

      if (nextProps.step === 2) {
        if (this.checkValidity()) {

        } else {
          this.props.reset()
        }
      }

      if (nextProps.processing === true && this.props.processing === false) {
        this.toggleDialog()
        let { upc, sku, manufacturer, name, description, price, height, width, length, selectedCategory } = this.state;
        this.props.onSubmit(sku, name, price, height, width, length, description, selectedCategory, manufacturer, upc)
      }else if (nextProps.product && nextProps.processing === true && this.props.processing === true) {
        this.toggleDialog()
        this.props.finish()
      }
  }

  updateNameValue(evt) {
    this.setState({
      'name':evt.target.value
    });
  }

  updateDescriptionValue(evt) {
    let evtCap = evt + ''
    this.setState({
      'description':evtCap
    });
  }

  updateUPCValue(evt) {
    let val = evt.target.value
    if (!/^[0-9]*$/.test(val)) {
      this.setState({'error':{'upc':'This is not a valid barcode number.'}})
    }
    else if (this.state.upcType === 'UPC-A') {
      if (val.length !== 12)
        this.setState({'error':{'upc':'Please enter a valid UPC-A code'}})
      else
        this.setState({'error':{'upc':''}})
    }
    else if (this.state.upcType === 'UPC-E') {
      if (val.length !== 6)
        this.setState({'error':{'upc':'Please enter a valid UPC-E code'}})
      else
        this.setState({'error':{'upc':''}})
    }
    else if (this.state.upcType === 'EAN-8') {
      if (val.length !== 8)
        this.setState({'error':{'upc':'Please enter a valid EAN-8 code'}})
      else
        this.setState({'error':{'upc':''}})
    }
    else if (this.state.upcType === 'EAN-13') {
      if (val.length !== 13)
        this.setState({'error':{'upc':'Please enter a valid EAN-13 code'}})
      else
        this.setState({'error':{'upc':''}})
    }
    this.setState({
      'upc':evt.target.value
    });
  }

  updateSKUValue(evt) {
    this.setState({
      'sku':evt.target.value
    });
  }

  updateManufactureValue(evt) {
    this.setState({
      'manufacturer':evt.target.value
    });
  }

  updatePriceValue(evt) {
    let regex = /^(\d*\.)?\d+$/g;
    if (!regex.test(evt.target.value)) {
      this.setState({error: {price: 'Please enter a valid value. ##.##'}})
    } else {
      this.setState({error: {price: ''}})
    }
    this.setState({price: evt.target.value});
  }

  updateLengthValue(evt) {
    let regex = /^(\d*\.)?\d+$/g;
    if (!regex.test(evt.target.value)) {
      this.setState({error: {length: 'Please enter a valid value. ##'}})
    } else {
      this.setState({error: {length: ''}})
    }
    this.setState({
      'length':evt.target.value
    });
  }

  updateWidthValue(evt) {
    let regex = /^(\d*\.)?\d+$/g;
    if (!regex.test(evt.target.value)) {
      this.setState({error: {width: 'Please enter a valid value. ##'}})
    } else {
      this.setState({error: {width: ''}})
    }
    this.setState({
      'width':evt.target.value
    });
  }

  updateHeightValue(evt) {
    let regex = /^(\d*\.)?\d+$/g;
    if (!regex.test(evt.target.value)) {
      this.setState({error: {height: 'Please enter a valid value. ##'}})
    } else {
      this.setState({error: {height: ''}})
    }
    this.setState({
      'height':evt.target.value
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onChangeUPCType = (event) => {
    this.setState({ upcType: event.target.value });
  }

  onClick = nc => () => {
    this.setState({
      checkbox: nc
    });
  };


  render() {
    const errors = this.props.errors || {}
    let { upc, sku, manufacturer, name, description, price, currentValue, error, categories, length, width, height } = this.state;
    const { step } = this.props
    // let inputName =  <TextInput name="Name" required label="Product Name:" value={name} error={error.name} onChange={this.updateNameValue} placeholder={'Enter name...'} />
    let inputName =  <TextInput name="Name" value={name} error={error.name} onChange={this.updateNameValue} placeholder={'Enter name...'} />
    let inputDescription = <ReactQuill label="Product Description" value={description} onChange={this.updateDescriptionValue} value={this.state.description}/>
    let upcType = (<Select onChange={this.onChangeUPCType}>
                    <option value='UPC-A'>UPC-A</option>
                    <option value='UPC-E'>UPC-E</option>
                    <option value='EAN-8'>EAN-8</option>
                    <option value='EAN-13'>EAN-13</option>
                  </Select>)
    let inputUPC = <TextInput onChange={this.updateUPCValue} error={error.upc} value={upc} placeholder='Enter UPC'/>
    // let inputSKU = <TextInput label="Product SKU" onChange={this.updateSKUValue} error={error.sku} value={sku} placeholder='Product SKU' required/>
    let inputSKU = <TextInput onChange={this.updateSKUValue} error={error.sku} value={sku} placeholder='Product SKU' />
    // let inputManu = <TextInput label="Manufacturer" onChange={this.updateManufactureValue} error={error.manufacturer} value={manufacturer} placeholder='Manufacturer'/>
    let inputManu = <TextInput onChange={this.updateManufactureValue} error={error.manufacturer} value={manufacturer} placeholder='Manufacturer'/>
    // let inputPrice = <TextInput label="Price ($)" onChange={this.updatePriceValue} error={error.price} value={price} placeholder='Price'/>
    let inputPrice = <TextInput onChange={this.updatePriceValue} error={error.price} value={price} placeholder='Price'/>
    // let inputLength = <TextInput label="L:" onChange={this.updateLengthValue} error={error.length} value={length} placeholder='Length' variation="2" required/>
    // let inputWidth = <TextInput label="W:" onChange={this.updateWidthValue} error={error.width} value={width} placeholder='Width' variation="2" required/>
    // let inputHeight = <TextInput label="H:" onChange={this.updateHeightValue} error={error.height} value={height} placeholder='Height' variation="2" required/>
    // let inputLength = <TextInput label="L:" onChange={this.updateLengthValue} error={error.length} value={length} placeholder='Length' variation="2" required/>
    // let inputWidth = <TextInput label="W:" onChange={this.updateWidthValue} error={error.width} value={width} placeholder='Width' variation="2" required/>
    // let inputHeight = <TextInput label="H:" onChange={this.updateHeightValue} error={error.height} value={height} placeholder='Height' variation="2" required/>
    let inputLength = <div className='flex-div'><TextInput label="L: " onChange={this.updateLengthValue} error={error.length} value={length} placeholder='Length' variation="2" required/></div>
    let inputWidth = <div className='flex-div'><TextInput label="W:" onChange={this.updateWidthValue} error={error.width} value={width} placeholder='Width' variation="2" required/></div>
    let inputHeight = <div className='flex-div'><TextInput label="H:" onChange={this.updateHeightValue} error={error.height} value={height} placeholder='Height' variation="2" required/></div>

    let permissions = (
      <div class="col-sm-3">
        <hr />
        <div class="pcw-sm-outer-radio">
          <label class="pcw-sm-container">Private (default)
            <input type="radio" name="radio" />
            <span class="checkmark"></span>
          </label>
          <p>This setting marks your product as private. Only you can have access to the products link at assets.</p>
          <label class="pcw-sm-container">View/Read Only
            <input type="radio" name="radio" />
            <span class="checkmark"></span>
          </label>
          <p>This setting only allows specified users on XSPACE to view this page if they have a link and use its assets.</p>
          <label class="pcw-sm-container">Public
            <input type="radio" name="radio" />
            <span class="checkmark"></span>
          </label>
          <p>This setting marks your product as public. Anyone can have access to the products link and its assets.</p>
        </div>
      </div>
    )

    // let categoryList = (
    //   <div></div>
    // )

    // if (categories.length > 0) {
    //
    //   categoryList = (
    //         <select className="form-control" value={currentValue} onChange={this.toggleCat}>
    //           <option value="">
    //               Select Category
    //           </option>
    //           {categories.map((category,index) => (
    //               <option key={index} id={category.id} value={category.title} name={category.title}>
    //                   {category.title}
    //               </option>
    //           ))}
    //       </select>
    //   )
    // }


    // let categoryDropDown = (
    //   <div className='category-dropdown'>
    //     <div>
    //       <label>Category:</label>
    //       <RequiredCircle />
    //     </div>
    //     <Select onChange={this.selectCategory}>
    //       {categories.map((category, index) => <option value={index + 1}>{category && category.title}</option>)}
    //     </Select>
    //   </div>
    // )

    let categorySelector = (<Select onChange={this.selectCategory}>
                              {categories.map((category, index) => <option value={index}>{category && category.title}</option>)}
                            </Select>)

    if (step === 2) {
      categorySelector = (<div><h5 class="animated fadeInDown">{this.state.selectedCategoryText}</h5></div>)
      inputName = (<div><h5 class="animated fadeInDown">{this.state.name}</h5></div>)
      inputDescription = (<div>{ReactHtmlParser(this.state.description)}</div>)
      upcType = (<div><h5 class="animated fadeInDown">{this.state.upcType}</h5></div>)
      inputUPC = (<div><h5 class="animated fadeInDown">{this.state.upc}</h5></div>)
      inputSKU = (<div><h5 class="animated fadeInDown">{this.state.sku}</h5></div>)
      inputManu = (<div><h5 class="animated fadeInDown">{this.state.manufacturer}</h5></div>)
      inputPrice = (<div><h5 class="animated fadeInDown">{this.state.price}</h5></div>)
      permissions = (<p>You have selected</p>)
      inputLength = (<div><div className='flex-div'><p>Length</p> <RequiredCircle /></div><h5 class="animated fadeInDown">{this.state.length}</h5></div>)
      inputWidth = (<div><div className='flex-div'><p>Width</p><RequiredCircle /></div><h5 class="animated fadeInDown">{this.state.width}</h5></div>)
      inputHeight = (<div><div className='flex-div'><p>Height</p><RequiredCircle /></div><h5 class="animated fadeInDown">{this.state.height}</h5></div>)
    }

    let categoryDropDown = (
        <div className='category-dropdown'>
          <div>
            <label>Category:</label>
            <RequiredCircle />
          </div>
          {categorySelector}
        </div>
    )

    let resp = <p></p>
    if (this.state.rawResponse != '') {
      resp = (<p>{this.state.rawResponse}</p>)
    }

    return (
      <ContainerMine>
        <Modal isopen={this.state.modal}>
          <ModalHeader toggle={this.toggleDialog}>Creating A New Product</ModalHeader>
          <ModalBody>
            Please wait, we are processing your submission...
          </ModalBody>
        </Modal>
        <div class="animated">
          <Wrapper>
            {/*<h4>Select Import Method:</h4>*/}
            {/*<MDBFormInline>*/}
            {/*  <div className="col">*/}
            {/*  <Input type="checkbox"*/}
            {/*         label="Create Single Product"*/}
            {/*         id="temp1"*/}
            {/*         onClick={this.onClick(1)}*/}
            {/*         checked={this.state.checkbox === 1 ? true: false}*/}
            {/*         className="chooseCheck"*/}
            {/*  />*/}
            {/*  </div>*/}
            {/*  <div className="col">*/}
            {/*  <Input type="checkbox"*/}
            {/*         label="Import Products Via Excel (.xlsx, .csv)"*/}
            {/*         id="temp2"*/}
            {/*         onClick={this.onClick(2)}*/}
            {/*         checked={this.state.checkbox === 2 ? true: false}*/}
            {/*         className="chooseCheck"*/}
            {/*  />*/}
            {/*  </div>*/}
            {/*</MDBFormInline>*/}


            {/*<p><input type="checkbox" value="0" name="checkbox" /></p>*/}
            {/*<label>*/}
            {/*  <input type="checkbox" value="0" name="checkbox" />*/}
            {/*      <span className="checkmark"><span/></span>*/}
            {/*</label>*/}
            {/*<div className="pcw-sm-outer-radio">*/}
            {/*  <label className="pcw-sm-container">Create Single Product*/}
            {/*    /!*<input type="radio" value="0" name="radio" onChange={() => changeMode(0)}/>*!/*/}
            {/*    <input type="checkbox" value="0" name="radio" />*/}
            {/*    <span className="checkmark"><span/></span>*/}
            {/*  </label>*/}
            {/*  <label className="pcw-sm-container">Import Products Via Excel (.xlsx, .csv)*/}
            {/*    /!*<input type="radio" value="1" name="radio" onChange={() => changeMode(1)}/>*!/*/}
            {/*    <input type="checkbox" value="1" name="radio" />*/}
            {/*    <span className="checkmark"><span/></span>*/}
            {/*  </label>*/}
            {/*</div>*/}

            {/*<h4>Product Info:</h4>*/}
            <div class="row">
              <div class="col-sm-4">
                <div className='flex-div'>
                  <label>Product Name:</label>
                  <RequiredCircle />
                </div>
                {inputName}
                {/*{categoryDropDown}                */}
                <div className='upc-wrapper'>
                  <div className='flex-div'>
                    <label>Product UPC:</label>
                    <RequiredCircle />
                  </div>
                  <div className='flex-div'>
                    {inputUPC}
                    {upcType}
                    {/*<Select onChange={this.onChangeUPCType}>*/}
                    {/*  <option value='UPC-A'>UPC-A</option>*/}
                    {/*  <option value='UPC-E'>UPC-E</option>*/}
                    {/*  <option value='EAN-8'>EAN-8</option>*/}
                    {/*  <option value='EAN-13'>EAN-13</option>*/}
                    {/*</Select>*/}
                  </div>                  
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    <div className='flex-div'>
                      <label>Product SKU:</label>
                      <RequiredCircle />
                    </div>
                    {inputSKU}
                  </div>
                  <div className="col-sm-6">
                  <div className='flex-div'>
                    <label>Price ($):</label>
                  </div>
                  {inputPrice}
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div className='flex-div'>
                  <label>Manufacturer:</label>
                </div>
                {inputManu}
                {categoryDropDown}
                {/*<p>Description</p>*/}
                {/*{inputDescription}*/}
                {/* {resp}*/}
                <label>Dimensions:</label>
                <div class="row">
                  <div class="col-sm-4">{inputLength}</div>
                  <div class="col-sm-4">{inputWidth}</div>
                  <div class="col-sm-4">{inputHeight}</div>
                </div>
              </div>
              <div class="col-sm-4">
                <p>Product Description:</p>
                {inputDescription}
                {/*{inputSKU}*/}
                {/*{inputManu}*/}
                {/*{inputPrice}*/}
                {/*{inputLength}*/}
                {/*{inputWidth}*/}
                {/*{inputHeight}*/}
              </div>
            </div>
          </Wrapper>
        </div>
      </ContainerMine>
    );
  }
}
