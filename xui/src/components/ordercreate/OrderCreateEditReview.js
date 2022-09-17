import React, { Component } from 'react';
import styled from 'styled-components'
import {MDBDataTable, MDBInput} from "mdbreact";
import {StyledTable} from "../../lib/styled-table";
import Loader from "react-loader";
import './OrderCreateEditReview.css'

const DeleteButton = styled.button`
  width: 160px;
  height: 58px;
  background-color: #ff2626;
  color: #ffffff;
  font-size: 18px;
  line-height: 26px;
  font-weight: normal;
  border-radius: 29px;
  border: 2px solid #F4F5FA;
  margin-left: 12px;
  margin-top: 10px;
  
  
  :hover {
    background-color: #ff2626;
    color: white;
    border: none;
  }
  :focus {
    background-color: #ff2626;
  }
  //
  // :disabled {
  //   background-color: #c1c1c1;
  // }
  
  &.small-btn {
    width: 130px;
    height: 38px;
    border-radius: 19px;
    font-size: 14px;
  }
  &.filled-btn {
    background-color: #ff2626;
    color: #ffffff;
  }
`



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
  
    // .dataTables_info {
  //   font-size: 14px;
  //   color: #333330;
  //   line-height: 20px;
  // }
  // .pagination .page-item {
  //   color: #333333;
  //   font-size: 14px;
  //   line-height: 20px;
  //   font-weight: bold;
  // }
  // .pagination .page-item.active .page-link {
  //   background-color: #00A3FF;
  //   border-radius: 100%;
  // }
  // .dataTables_length {
  //   label {
  //     font-size: 14px;
  //     color: #333330;
  //     line-height: 20px;
  //   }
  //   .select-wrapper {
  //     input {
  //       height: 20px;
  //       margin-top: 9px;
  //       font-size: 14px;
  //       line-height: 20px;
  //       color: #333333;
  //       font-weight: bold;
  //     }
  //   }
  // }
  // .dataTables_filter {
  //   input {
  //     // font-size: 14px;
  //     // padding-bottom: 3px;
  //     // border: none;
  //   }
  // }
  
  .dataTables_wrapper {
    margin-top: 0px;
  }
  
  .dataTables_wrapper .dataTables_filter {
    input {
      border: 2px solid #F4F5FA !important;
      box-shadow: none !important;
      font-size: 14px;
      font-weight: bold;
      color: #3d3d3d;
      line-height: 20px;
      border-radius: 20px;
      height: 38px;
      padding: 0 15px;
      box-sizing: border-box;
      max-width: 380px;
      // margin-left: 380px;
      // left: 300px;
      ::placeholder {
        text-align: center;
      }
    }
  }
  .dataTables_filter.md-form {
      margin: 1rem 0;
      // left: 70px;
      float: right;
      width: 370px;
  }
  .dataTables_wrapper .btn-primary {
        border-radius: 2rem;
        background-color: #3eb2ff !important;
        border-color: #3eb2ff;
        font-size: 12px;
        margin-top: 10px;
        margin-right: 15px;

  }
  
  .dataTables_wrapper li.active {
    a.page-link {
      // background-color: #00A3FF;
      background-color: #3eb2ff;
      // border-radius: 16px;
      border-radius: 0px;
      // width: 5px;
      // height: 5px;
      color: white;
    }
  }
  
  .dataTables_wrapper table.dataTable thead:last-child {
    display: table-row-group;
  }
  
  // table.dataTable colgroup {
  //   display: none;
  // }
  
  .dataTables_wrapper table.dataTable tbody tr td {
    // font-size: 14px;
    // font-weight: normal;
    // color: #636363;
    
    :first-child {
      width: 7%;
      padding: 10px 0px 10px 16px !important;
    }
    :nth-child(2) {
      width: 22%;
      padding-left: 0px !important;
      padding-right: 0px!important;
    }
    :nth-child(3) {
      width: 14%;
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
    :nth-child(4) {
      width: 33%;
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
    :nth-child(5) {
      width: 22%;
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
    :last-child {
      display: none; 
      width: 0px;
    }
  }
  
  .dataTables_wrapper table.dataTable thead tr th {
    font-size: 14px;
    // font-weight: normal;
    color: #636363;
    
    :first-child {
      width: 7%;
      padding: 10px 0px 10px 8px;
    }
    :nth-child(2) {
      width: 22%;
      padding-left: 0px;
      padding-right: 0px;
    }
    :nth-child(3) {
      width: 14%;
      padding-left: 0px;
      padding-right: 0px;
    }
    :nth-child(4) {
      width: 33%;
      padding-left: 0px;
      padding-right: 0px;
    }
    :nth-child(5) {
      width: 22%;
      padding-left: 0px;
      padding-right: 0px;
    }
    // :last-child {
    //   display: none;      
    // }
  }    
  .dataTables_wrapper table.dataTable thead tr th {
    border-bottom: 3px solid #dcdcdc;
    // div {
    //     width: 0px;
    //     height: 0px;
    //     // top: 20px;
    //     bottom: 5px;
    //     margin: -1px;
    //     padding: 0px;
    //     // padding-right: 0px;
    //     // padding-left: 0px;
    // }
  }
  
  // table.dataTable tbody tr:nth-child(2n+1) {
  //   background-color: #FFFFFF;
  // }
  table.dataTable {
    margin-top: 0.90%;
  }
  table.dataTable tbody {
      div {
          width: 0px;
          height: 0px;
          bottom: 20px;
          // top: 0px;
          // margin-top: 0px;
          margin: 0px;
          padding: 0px;
          // padding-left: 0px;
      }
  }
  
  .table-responsive {
        margin-left: 5%;
        margin-right: 2%;        
        width: 90%;
        // overflow-y: auto;
        // overflow-x: auto;        
        // max-height: 500px;
        // display: none;
  }
  
  // table.table.btn-table td {
  //   max-width: 200px;
  //   white-space: nowrap;
  //   text-overflow: ellipsis;
  //   overflow: hidden;
  // }
`

const RightPanel = styled(Wrapper)`
  position: relative;
  width: 100%;
  max-height: none;
  min-height: 600px;
  padding: 100;
`

const Review_Product_Info = styled.div`
		bottom: 2%;
		overflow: visible;
		width: 100%;
		white-space: nowrap;
		text-align: left;
		font-family: Roboto;
		font-style: normal;
		font-weight: normal;
		font-size: 39px;
		color: rgba(120,120,120,1);
`

const Products = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 25px;
  border-bottom: 2px solid #F4F5FA;
  i {
    font-size: 32px;
    color: #000000;
    padding-right: 20px;
  }
  span {
    color: #636363;
    color: rgba(99,99,99,1);
    font-size: 20px;
    font-weight: bold;
    line-height: 20px;
    padding-left: 20px;
  }
  dashcam {
    .camera {
        overflow: visible;
        // width: 78.474px;
        width: 35px;
        // height: 62.779px;
        // left: 279.806px;
        // width: 78.474px;
        // height: 62.779px;
        // left: 279.806px;
        // top: 58.125px;
        // top: 0px;
        transform: matrix(1,0,0,1,0,0);
    }
  }
  
  #buttonleft {
    background-color: #707070;
    // color: white;
    // display: block;
    position: absolute;
    height: 23px;
    left: 380px;
    top: 35px;
    // /* line-height: 40px; */
    // /* text-decoration: none; */
    width: 50px;
    // /* text-align: center; */
    border-top-left-radius: 25% 50%;
    border-bottom-left-radius: 25% 50%;
    
    svg {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 0px;
      left: 15px;
    }
  }
`

export default class OrderCreateEditReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: '',
      productimg: [],
      isSuccess: false,
      imgUrl: 'https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png',
      pagenumber: 1,
      pagecount: 0,
      username: '',
      tableRows: [],
      productData: [],
      pageCount: 1,
      selectedProductIndex: 0,
      noRecord: false,
      isLoaded: false,
      isCheckAll: false,
      data: this.props.data,
      selectedEdit: '',
      forDelete: new Set(),
      selectedContentStandard:'',
      contentStandardId: '',
    }

    this.createData = this.createData.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.deleteSelected = this.deleteSelected.bind(this);
    // this.assembleProducts = this.assembleProducts.bind(this);
  }

  componentDidMount() {
  this._isMounted = true;
  console.log('COMPANY', this.state.companyName);
  console.log('LIST', Object.entries(this.props.productsSelected));
  console.log('EDIT', this.props.selectedEditapply);
  console.log('EDIT', this.props.selectedContentStandard.name, this.props.selectedContentStandard.uniqueID);


  /*Get All Product Data*/
  this.setEditGetProducts(this.props.selectedEditapply, this.props.noAddContentStandard, this.props.selectedContentStandard);
  // this.getAllProducts()
  }


  setEditGetProducts = (num, noaddit, cstandard) => {
    const addContentStandard = noaddit ? 'No Content Standard' : 'Apply Content Standard.';
    var edit = num === 0 ? 'Only ' : num === 1 ? 'Background Removal with ' : num === 2 ? 'Auto Crop & Center with ' : 'Color Correction with ';
    edit = edit + addContentStandard;
    console.log('Cstandard', cstandard);
    this.setState( {  selectedEdit: edit,
                      selectedContentStandard: cstandard.name,
                      contentStandardId: cstandard.uniqueID,
    }, () => { console.log( this.state); this.getAllProducts()});
  }


  // checkAll = (event) => {
  //   // although not used, I'm putting this in so that if we want to implement a check feature for reveiwing
  //   // it is already staged
  //   console.log('all', event.target.checked);
  //   console.log(this.state.tableRows);
  //   console.log("statecheckall", this.state.isCheckAll);
  //   this.setState( {isCheckAll : event.target.checked}, function () {
  //     console.log(this.state);
  //     console.log("state ischeckall", this.state.isCheckAll);
  //     console.log('here');
  //     const newrows = this.state.tableRows.map( (obj, index) => {
  //       obj['ischecked'] = <MDBInput label=" " type="checkbox" id={index.toString()} checked={this.state.isCheckAll}
  //                                    onChange={this.handleClick}/>;
  //       return obj;
  //     });
  //
  //     this.setState( {tableRows: newrows}, () => {console.log(this.state.tableRows);});
  //   } );
  // }
  //
  // handleInputChange = (event) => {
  //   // although not used, I'm putting this in so that if we want to implement a check feature for reveiwing
  //   // it is already staged
  //   const target = event.target,
  //         value = target.type ===
  //         'checkbox' ? target.checked : target.value,
  //       name = target.name
  //     this.setState({
  //         [name]: value
  //     });
  // }

  // assembleProducts = (productData) => {
  //   console.log('assembling table', this.state);
  //   let productsRow =productData.map((product, index) => {
  //     console.log('product', product)
  //     console.log('productData', productData)
  //     return (
  //       {
  //         // ischecked: <MDBInput label=" " type="checkbox" id={index.toString()} checked={this.state.isCheckAll} onChange={this.handleClick} />,
  //         // compliance: product.compliance,
  //         name: product.name,
  //         upccode: product.upccode,
  //         upctype: product.UPCType,
  //         SKU: product.SKU,
  //         manufacturer: product.manufacturer,
  //         category: product.category,
  //         width: product.width,
  //         length: product.length,
  //         height: product.height,
  //         price: product.price,
  //         description: product.description,
  //       }
  //     )
  //   });
  //   console.log('assembled table', this.state);
  //   // this.props.handleExcelApprovedList(productsRow);
  //   return productsRow;
  // }

  handleClick = (e) => {

    // console.log('handleclick', e);
    const eid = e.target.id;
    const echecked = e.target.checked
    console.log('handleclick', eid, echecked);
    if (echecked) {
      this.setState(({ forDelete }) => ({
        forDelete: new Set(forDelete).add(eid)
      }));
    } else {
      this.setState(({forDelete}) => {
        const newset = new Set(forDelete);
        newset.delete(eid);

        return {forDelete: newset};
      });
    }
    console.log('handleclickend', this.state.forDelete);
  }

  deleteSelected = () => {
    console.log('deleteselected', this.state.forDelete);
    console.log('deleteselected', this.state.tableRows);

    const newTableTemp = this.state.tableRows.map( (entry, index) => {
      entry['select'] = <MDBInput containerClass="form-check checkbox-red"
                                  label=" "
                                  type="checkbox"
                                  key={entry.select.key}
                                  id={entry.select.props.id}
                                  onChange={this.handleClick} />;

      return entry;
    });

    const newTable = newTableTemp.filter( entry => !this.state.forDelete.has(entry.select.props.id));

    console.log('deleteselected', newTable);

    this.setState( {tableRows : newTable});

    this.props.updateProductsForCart(newTable);
  }

  getAllProducts = () => {
    // let thisScope = this;
    // let products = []


    // // grab all good and all bad products and put them into one list and append compliance values
    // //
    // Object.entries(this.props.select).map(([key, data]) => {
    //   data['key'] = key
    //   data["compliance"] = null
    //   products.push(data)
    // })
    // Object.entries(this.props.baddata).map(([key, data]) => {
    //   data['key'] = key
    //   data["compliance"] = ""
    //   products.push(data)
    // })
    // thisScope.setState({
    //   productData: products,
    //   isLoaded: true,
    //   tableRows:thisScope.assembleProducts(products)
    //

    console.log("PRODUCTS SELECTED", this.props.productsSelected);
    const products = this.props.productsSelected.map((entry, index) => {
          console.log('thisScope.state.selectedEdit', this.state.selectedEdit);
          return (
              {
                select: <MDBInput containerClass="form-check checkbox-red"
                                  label=" "
                                  type="checkbox"
                                  key={index.toString()}
                                  id={index.toString()}
                                  onChange={this.handleClick}/>,

                name: entry.productname,
                xspaceid: entry.xspaceid,
                contentstandard: this.state.selectedContentStandard,
                service: this.state.selectedEdit,
                productid: entry.slug,
              }
          )
        }
    )

    this.setState({
      tableRows: products,
      isLoaded: true
    }, () => console.log('tablerows', this.state.tableRows));

    this.props.updateProductsForCart(products);
  }
    // },() => {
    //   let rowsData = []
    //   // used for compliance
    //   // for (let index = 0; index < thisScope.state.tableRows.length; index++) {
    //   //     let rowItem = thisScope.state.tableRows[index]
    //   //     rowItem["compliance"] = thisScope.state.tableRows[index].compliance
    //   //     if (rowItem["compliance"] != ""){
    //   //     rowItem["compliance"] =  <span style={{background:'#ff9994'}} title={rowItem["compliance"]}>errors</span>
    //   //     }else{
    //   //     rowItem["compliance"] =  <span style={{background:'rgba(152,255,148,0.85)'}} title={rowItem["compliance"]}>Product is compliant!</span>
    //   //     }
    //
    //   rowsData.push(rowItem)
    // }
    //   console.log('getting thisScope state')
    //   console.log(thisScope.state)
    //   thisScope.setState({
    //       tableRows: rowsData,
    //   })
    // }

  createData() {
    const data = {
      columns: [
        //{
          // label: "select",
          // label: <MDBInput className="tabcheck" label="All" type="checkbox" id="checkbox5" style={{width:10, height:10}}/>,
          //: <MDBInput label=" " type="checkbox" id="checkbox_all" filled  onClick={this.checkAll}/>,
          //field: 'ischecked',
          //sort: 'disabled',
          //searchable: false,
          // width: 10,
        //},
        {
          label: 'Select',
          field: 'select',
          sort: 'disabled'
        },
        {
          label: 'Product',
          field: 'name',
          sort: 'desc'
        },
        {
          label: 'XSpace ID',
          field: 'xspaceid',
          sort: 'desc'
        },
        {
          label: 'Content Standard',
          field: 'contentstandard',
          sort: 'desc'
        },
        {
          label: 'Service',
          field: 'service',
          sort: 'desc'
        },
        // {
        //   label: 'Manufacturer',
        //   field: 'manufacturer',
        //   sort: 'desc'
        // },
        // {
        //   label: 'Category',
        //   field: 'category',
        //   sort: 'desc'
        // },
        // {
        //   label: 'Width',
        //   field: 'width',
        //   sort: 'desc'
        // },
        //   {
        //   label: 'Length',
        //   field: 'length',
        //   sort: 'desc'
        // },
        //   {
        //   label: 'Height',
        //   field: 'height',
        //   sort: 'desc'
        // },
        //   {
        //   label: 'Price',
        //   field: 'price',
        //   sort: 'desc'
        // },
        //   {
        //   label: 'Description',
        //   field: 'description',
        //   sort: 'desc'
        // },
      ],
      rows: this.state.tableRows

    };
    return data;
  }

  render() {
    return (
        <Wrapper>
          <div className="animated">
            <Review_Product_Info>
              Review Editing Order:
            </Review_Product_Info>
            <div>
              <StyledTable>
                <MDBDataTable
                  responsive
                  maxHeight="500px"
                  // autoWidth
                  searching={false}
                  scrollY
                  scrollX
                  paging={false}
                  // exportToCSV={true}
                  data={this.createData()}/>
              </StyledTable>
              { this.state.noRecord &&
                  <div className="row" style={{width:1030, height:105 }}>
                    <div className="alert-wizard" style={{position: 'absolute', marginLeft: -82, marginTop: 37, background: '#EB5757', width: 1085 }}>
                      <p className="alert-wizard-text" style={{width: 366, textAlign: 'center'}}>No result found <i className="fa fa-times" aria-hidden="true" style={{marginLeft: 691,position: 'absolute', marginTop: 12}} onClick={this.clearMessage}></i></p>
                    </div>
                  </div>
              }
              { !this.state.isLoaded && (
                <div>
                  <Loader loaded={this.state.isLoaded} lines={13} length={20} width={10} radius={30}
                        corners={1} rotate={0} direction={1} color="#6FCF97" speed={1}
                  trail={60} shadow={false} hwaccel={false} className="spinner"
                  top="50%" left="50%" scale={0.70}
                  loadedClassName="loadedContent" />
                </div>
              )}
            </div>
          </div>
          <DeleteButton onClick={this.deleteSelected}>Delete Selected</DeleteButton>
      </Wrapper>
    )
  }

}

