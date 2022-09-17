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
    margin: 30px 25px 25px 0px
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
  
  .capturerow {
    margin-left: 5px;
    margin-right: 5px;
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
  
  h5 {
    font-size: 20px;
    // color: #333333;
    color: #787878;
    line-height: 20px;
    font-weight: normal;
    margin-bottom: 1rem;
    margin-top: 15px;
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
    font-weight: normal;
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
  width: 200px;
  height: 75px !important;
  background-color: ${props =>  props.isPicked ? "#3e78ff !important" : "#ffffff !important"};
  // color: #adadad !important;
  color: ${props =>  props.isPicked ? "#ffffff !important" : "#adadad !important"};
  font-size: 16px !important;
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
        this.getCategory = this.getCategory.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.onEditChange = this.onEditChange.bind(this);
        this.setList = this.setList.bind(this);
        this.assembleStandards = this.assembleStandards.bind(this);
    }

    componentDidMount() {
        this.setList()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.contentStandard !== prevProps.contentStandard) {
            this.setList();
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {

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
            if (this.props.contentStandard["contentStandard"] && this.props.contentStandard["contentStandard"].length > 0) {
                standardsOptionItem = this.props.contentStandard["contentStandard"].map((standard, index) => {
                    //console.log(standard.name)
                    return (<option key={index} value={standard.uniqueID} id={standard.name} >{standard.name}</option>)
                })
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
        let { categories, selectedButton, standardsOptionList } = this.state;
        const { step } = this.props

        let categorySelector = (<Select onChange={this.selectCategory}>
            {categories.map((category, index) => <option value={index + 1}>{category && category.title}</option>)}
        </Select>)

        if (step === 2) {
            categorySelector = (<div><h5 class="animated fadeInDown">{this.state.selectedCategoryText}</h5></div>)
        }

        let resp = <p/>
        if (this.state.rawResponse !== '') {
            resp = (<p>{this.state.rawResponse}</p>)
        }

        console.log("SelectedBUTTONS", selectedButton)
        console.log("ContentStandard")
        console.log("ContentStandard", standardsOptionList)

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
                    <div className="row capturerow">
                        <div className="col-sm-8">
                            <h5>2D Photos:</h5>
                            <div className="row roworder1">
                                <EditButton onClick={ (e) => this.onEditChange(e, 1)} isPicked={selectedButton === 1}>Single Photo</EditButton>
                                <EditButton onClick={ (e) => this.onEditChange(e, 2)} isPicked={selectedButton === 2}>4-Pack Photos</EditButton>
                                <EditButton onClick={ (e) => this.onEditChange(e, 3)} isPicked={selectedButton === 3}>5-Pack Photos</EditButton>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <h5>Other Mediums:</h5>
                            <div className="row roworder1">
                                <EditButton onClick={ (e) => this.onEditChange(e, 4)} isPicked={selectedButton === 4}>360 Spin</EditButton>
                            </div>
                        </div>
                    </div>

                    <div className="row roworder2">
                        <h4>Select Content Standards:</h4>
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
        )
    }
}
