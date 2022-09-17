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
  padding: 16px 60px 16px 60px;
  
  .row {
    justify-content: space-between !important;
  }
  .roworder1 {
    margin: 45px 25px 25px 0px
  }
  .roworder2 {
    margin-left: -15px;
    margin-right: -15px;
    margin-top: 45px;
  }
  .roworder3 {
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 35px;
  }
  
  select {
    border: 2px solid #adadad !important;
    border-radius: 15px;
    height: 60px !important;
    width: 600px;
    font-size: 20px;
    font-weight: normal;
    color: #adadad;
    padding-left: 40px;
  }
  
  .fa-chevron-down {
    font-size: 30px;
    right: 20px;
  }
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
  .row {
    justify-content: start;
  }
`
export const EditButton = styled.button`
  width: 260px;
  height: 110px !important;
  background-color: ${props =>  props.isPicked ? "#3e78ff !important" : "#ffffff !important"};
  // color: #adadad !important;
  color: ${props =>  props.isPicked ? "#ffffff !important" : "#adadad !important"};
  font-size: 24px !important;
  line-height: 26px;
  font-weight: normal;
  border-radius: 29px;
  border: 2px solid #adadad;
  :hover {
    background-color: #00A3FF !important;
    color: white !important;
    border: none;
  }
  &.small-btn {
    width: 130px;
    height: 38px;
    border-radius: 19px;
    font-size: 14px;
  }
  &.filled-btn {
    background-color: #00A3FF;
    color: #ffffff;
  }
`
export default class OrderCreateEdit extends Component {

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
            checkbox: 1,
            selectedButton: 0,
            selectedColor: "#3e78ff",
            unselectedColor: "#ffffff",
            standardsOptionList: [],
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
        this.onEditChange = this.onEditChange.bind(this);
        this.setList = this.setList.bind(this);
        this.assembleStandards = this.assembleStandards.bind(this);
    }

    componentDidMount() {
        this.setList();
        // this.getCategory();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.contentStandard !== prevProps.contentStandard) {
            this.setList();
        }
    }

    componentWillReceiveProps(nextProps) {

        // if (nextProps.step == 2) {
        //     if (this.checkValidity()) {
        //
        //     } else {
        //         this.props.reset()
        //     }
        // }

        if (nextProps.processing === true && this.props.processing === false) {
            this.toggleDialog()
            let { upc, sku, manufacturer, name, description, price, height, width, length, selectedCategory } = this.state;
            this.props.onSubmit(sku, name, price, height, width, length, description, selectedCategory, manufacturer, upc)
        }else if (nextProps.product && nextProps.processing === true && this.props.processing === true) {
            this.toggleDialog()
            this.props.finish()
        }
    }


    assembleStandards = () => {
        let standardsOptionItem;
        console.log("MAPMAPMAP", this.props)
        if(this.props.contentStandard){
            console.log("MAP")
            if (this.props.contentStandard["contentStandard"] && this.props.contentStandard["contentStandard"].length > 0) {
                standardsOptionItem = this.props.contentStandard["contentStandard"].map((standard, index) => {
                    //console.log(standard.name)
                    return (<option key={index} value={standard.uniqueID} id={standard.name} >{standard.name}</option>)
                });
            }
        }
        else{
            standardsOptionItem = (<option value="No Standards"><p>No Standards</p></option>)
        }
        return standardsOptionItem;
    }


    /*get product data */
    setList = () => {
        this.setState({ standardsOptionList:this.assembleStandards()});
        //console.log(this.state.standardsOptionList);
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
        this.setState({
            selectedCategory: event.target.value,
            selectedCategoryText: event.target.innerText
        });
    }

    onEditChange(e, selectedButton) {
        console.log('buttonedit', e.target.isPicked, selectedButton);
        this.setState( {selectedButton: selectedButton})
        this.props.setSelectedEdit(selectedButton);
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
        let { upc, sku, manufacturer, name, description, price, currentValue, error, categories, length, width, height, selectedButton, selectedColor, unselectedColor, standardsOptionList } = this.state;
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
            {categories.map((category, index) => <option value={index + 1}>{category && category.title}</option>)}
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
        if (this.state.rawResponse !== '') {
            resp = (<p>{this.state.rawResponse}</p>)
        }

        var background_color = { backgroundColor: selectedColor + " !important"};
        var nonbackground_color = { backgroundColor: unselectedColor + " !important"};

        console.log("SelectedBUTTTONS",selectedButton);
        console.log("ContentStandard");
        console.log("ContentStandard", standardsOptionList);


        return (
            <ContainerMine>
                <Modal isopen={this.state.modal}>
                    <ModalHeader toggle={this.toggleDialog}>Creating A New Product</ModalHeader>
                    <ModalBody>
                        Please wait, we are processing your submission...
                    </ModalBody>
                </Modal>
                <div class="animated">
                    <div className="row">
                        <h4>Select Editing Service:</h4>
                    </div>
                    <div className="row roworder1">
                            <EditButton onClick={ (e) => this.onEditChange(e, 1)} isPicked={selectedButton === 1}>Background Removal</EditButton>
                            <EditButton onClick={ (e) => this.onEditChange(e, 2)} isPicked={selectedButton === 2}>Auto Crop & Center</EditButton>
                            <EditButton onClick={ (e) => this.onEditChange(e, 3)} isPicked={selectedButton === 3}>Color Correction</EditButton>
                    </div>
                    <div className="row roworder2">
                        <h4>(AND/OR) Select a Content Standards:</h4>
                    </div>
                    <div className={"row roworder3"}>
                        {/*<Select onChange={(e) => onChange(e, 'image_file_type')} value={image_file_type}>*/}
                        <Select defaultValue="null" onChange={this.props.updateSelectedStandard}>
                            <option disabled value='Choose A Content Standard'>Choose A Content Standard</option>
                            <option value="null" id="No Content Standard">No Content Standard</option>
                            {standardsOptionList}
                            <option disabled value='Popular Standards'>Popular Standards</option>
                            <option value="Snap36" id="Snap36">Snap36</option>
                            <option value="Xspace" id="Xspace">Xspace</option>
                            <option value="Amazon" id="Amazon">Amazon</option>
                            <option value="Walmart" id="Walmart">Walmart</option>
                        </Select>
                    </div>
                </div>
            </ContainerMine>
        );
    }
}
