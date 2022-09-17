import React, { Component } from 'react';
import styled from 'styled-components'
import {MDBDataTable, MDBInput} from "mdbreact";
import {StyledTable} from "../../lib/styled-table";
import Loader from "react-loader";
import Moment from "react-moment";
const Wrapper = styled.div`h3, h5 {
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

export default class ProductExcelFileUploader extends Component {

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
      data: props.data,
      templateUsed: props.templateUsed
    }

    this.createData = this.createData.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
    this.assembleProducts = this.assembleProducts.bind(this);
  }

  componentDidMount() {
      this._isMounted = true;
      // console.log('COMPANY', this.state.companyName)
      // /*Get All Product Data*/
      this.getAllProducts()
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

  assembleProducts = (productData) => {
    console.log('assembling table');
    console.log('productData', productData)
    let productsRow = productData.map((product, index) => {



      if (this.state.templateUsed === 'xspace') {
          console.log('using template xspace')
          console.log('product', product)
          return (
              {
                  // ischecked: <MDBInput label=" " type="checkbox" id={index.toString()} checked={this.state.isCheckAll} onChange={this.handleClick} />,
                  // compliance: product.compliance,
                  name: product.name,
                  upccode: product.upccode,
                  upctype: product.UPCType,
                  SKU: product.SKU,
                  manufacturer: product.manufacturer,
                  category: product.category,
                  width: product.width,
                  length: product.length,
                  height: product.height,
                  price: product.price,
                  description: product.description,
              }
          )
      } else {
          console.log('using template snap36')
          console.log('product', product)
          return (
            {
              // ischecked: <MDBInput label=" " type="checkbox" id={index.toString()} checked={this.state.isCheckAll} onChange={this.handleClick} />,
              // compliance: product.compliance,

              internalSKU: product['Internal SKU#'],
              upccode: product['UPC'],
              upctype: product['UPC Type'],
              cat: product['Product Category'],
              description: product['Item Description'],
              standalone: product['Does the product stand on its own?'],
              photographyNotes: product['Photography notes'],
              length: product['Item Length'],
              width: product['Item Width'],
              height: product['Item Height'],
              weight: product['Item Weight'],
              acDelcoID: product['ACDelco'],
              advancedAutoID: product['Advanced Auto'],
              advantageID: product['Advantage'],
              amazonID: product['Amazon'],
              graingerID: product['Grainger SKU'],
              homeDepotID: product['Home Depot'],
              johnstoneID: product['Johnstone'],
              oReillyID: product["O'Reilly"],
              walmartID: product['Walmart'],
              vendorCode1: product['VendorCode1'],
              vendorCode2: product['VendorCode2'],
              vendorCode3: product['VendorCode3'],
            }
        )
      }
    })
    console.log('assembled table', this.state);
    this.props.handleExcelApprovedList(productsRow);
    return productsRow;
  }

  getAllProducts = () => {
    let thisScope = this;
    let products = []
    // grab all good and all bad products and put them into one list and append compliance values
    //
    //   console.log('gooddata', this.props.gooddata)
    //   console.log('baddata', this.props.baddata)
      Object.entries(this.props.gooddata).map(([key, data]) => {
          data['key'] = key
          data["compliance"] = null
          products.push(data)
      })
      Object.entries(this.props.baddata).map(([key, data]) => {
          data['key'] = key
          data["compliance"] = ""
          products.push(data)
      })
    thisScope.setState({
        productData: products,
        isLoaded: true,
        tableRows: thisScope.assembleProducts(products)
    })
    }

  createData() {
      let data
      console.log('template:', this.state.templateUsed)
      if (this.state.templateUsed === 'xspace') {
          data = {
          columns: [
              {
                  label: 'Product Name',
                  field: 'name',
                  sort: 'desc'
              },
              {
                  label: 'UPC',
                  field: 'upccode',
                  sort: 'desc'
              },
              {
                  label: 'UPC Type',
                  field: 'upctype',
                  sort: 'desc'
              },
              {
                  label: 'SKU',
                  field: 'SKU',
                  sort: 'desc'
              },
              {
                  label: 'Manufacturer',
                  field: 'manufacturer',
                  sort: 'desc'
              },
              {
                  label: 'Category',
                  field: 'category',
                  sort: 'desc'
              },
              {
                  label: 'Width',
                  field: 'width',
                  sort: 'desc'
              },
              {
                  label: 'Length',
                  field: 'length',
                  sort: 'desc'
              },
              {
                  label: 'Height',
                  field: 'height',
                  sort: 'desc'
              },
              {
                  label: 'Price',
                  field: 'price',
                  sort: 'desc'
              },
              {
                  label: 'Description',
                  field: 'description',
                  sort: 'desc'
              },
          ],
              rows: this.state.tableRows

      }}
      else {
          // using snap36 template
          data = {
              columns: [
                  {
                      label: 'Internal SKU',
                      field: 'internalSKU',
                      sort: 'desc'
                  },
                  {
                      label: 'UPC',
                      field: 'upccode',
                      sort: 'desc'
                  },
                  {
                      label: 'UPC Type',
                      field: 'upctype',
                      sort: 'desc'
                  },
                  {
                      label: 'SKU',
                      field: 'SKU',
                      sort: 'desc'
                  },
                  {
                      label: 'Stand Alone?',
                      field: 'standalone',
                      sort: 'desc'
                  },
                  {
                      label: 'Category',
                      field: 'cat',
                      sort: 'desc'
                  },
                  {
                      label: 'Width',
                      field: 'width',
                      sort: 'desc'
                  },
                  {
                      label: 'Length',
                      field: 'length',
                      sort: 'desc'
                  },
                  {
                      label: 'Height',
                      field: 'height',
                      sort: 'desc'
                  },
                  {
                      label: 'Weight',
                      field: 'weight',
                      sort: 'desc'
                  },
                  {
                      label: 'ACDelco ID',
                      field: 'acDelcoID',
                      sort: 'desc'
                  },

                  {
                      label: 'Advanced Auto ID',
                      field: 'advancedAutoID',
                      sort: 'desc'
                  },
                  {
                      label: 'Advantage ID',
                      field: 'advantageID',
                      sort: 'desc'
                  },

                  {
                      label: 'Amazon ID',
                      field: 'amazonID',
                      sort: 'desc'
                  },
                  {
                      label: 'Grainger ID',
                      field: 'graingerID',
                      sort: 'desc'
                  },

                  {
                      label: 'Home Depot ID',
                      field: 'homeDepotID',
                      sort: 'desc'
                  },
                  {
                      label: 'Johnstone ID',
                      field: 'johnstoneID',
                      sort: 'desc'
                  },

                  {
                      label: "O'Reilly ID",
                      field: 'oReillyID',
                      sort: 'desc'
                  },
                  {
                      label: 'Walmart ID',
                      field: 'walmartID',
                      sort: 'desc'
                  },
                  {
                      label: 'Vendor Code #1',
                      field: 'vendorCode1',
                      sort: 'desc'
                  },

                  {
                      label: "Vendor Code #2",
                      field: 'vendorCode2',
                      sort: 'desc'
                  },


                  {
                      label: "Vendor Code #3",
                      field: 'vendorCode3',
                      sort: 'desc'
                  },
                  {
                      label: 'Description',
                      field: 'description',
                      sort: 'desc'
                  },
                  {
                      label: 'Photography Notes',
                      field: 'photographyNotes',
                      sort: 'desc'
                  },
              ],
              rows: this.state.tableRows
          }
      }
    console.log('data returned:', data)
    return data;
  }

  render() {
    return (
        <Wrapper>
          <div className="animated">
            <Review_Product_Info>
              Review Product Info:
            </Review_Product_Info>
            <br/><br/>
            <div>
              <StyledTable >
                <MDBDataTable
                  responsive
                  maxHeight="400px"
                  scrollY={true}
                  scrollX={true}
                  paging={false}
                  data={this.createData()}/>
              </StyledTable>
              { this.state.noRecord &&
                  <div className="row" style={{width:1030, height:105 }}>
                    <div className="alert-wizard" style={{position: 'absolute', marginLeft: -82, marginTop: 37, background: '#EB5757', width: 1085 }}>
                      <p className="alert-wizard-text" style={{width: 366, textAlign: 'center'}}>No result found <i className="fa fa-times" aria-hidden="true" style={{marginLeft: 691,position: 'absolute', marginTop: 12}} onClick={this.clearMessage}/></p>
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
      </Wrapper>
    )
  }

}

