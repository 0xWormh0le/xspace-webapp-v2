import React, {Component} from 'react'
import styled from 'styled-components'
import { Container } from 'mdbreact'
import ManageLeftSideMenu from './../menu/ManageLeftSideMenu'
import ProductPush from './ProductPush'
import ProductPull from './ProductPull'

import './ProductUpdate.css'

import './../managepage.css';

import { ProductView, LeftPanel } from '../ProductManageView'
import repeatImg from '../../assets/img/repeat.png'
import { Select } from '../../lib/select'

const StyledLeftPanel = styled(LeftPanel)`
  min-height: 600px;
`

const RightPanel = styled(LeftPanel)`
  position: relative;
  max-width: 100%;
  width: 100%;
  justify-content: initial;
  padding-bottom: 45px;
  min-height: 600px;
  .flex-wrapper {
    display: flex;
    padding: 25px 50px;
    .wrapper-body {
      min-height: 427px;
      background-color: #F4F5FA;
      border-radius: 10px;
    }
  }
`

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 25px;
  border-bottom: 2px solid #F4F5FA;
  div {
    display: flex;
    align-items: center;
    img {
      width: 32px;
      height: 32px;
      margin-right: 20px;
    }
    h5 {
      font-size: 14px;
      line-height: 20px;
      color: #333333;
      font-weight: bold;
      margin: 0;
    }
    input {
      font-size: 14px;
      line-height: 20px;
      color: #3D3D3D;
      font-weight: bold;
      height: 38px;
      box-sizing: border-box;
      border: 2px solid #F4F5FA;
      border-radius: 19px;
      width: 250px;
      padding: 0 10px;
      margin-right: 15px;
      ::placeholder {
        opacity: .7;
      }
    }
    span, select {
      font-size: 14px;
      line-height: 20px;
      color: #3D3D3D;
      font-weight: bold;
    }
    span {
      padding-right: 10px;
    }
    select {
      display: block !important;
      border: none;
      outline: none;
    }
  }
`

export default class ProductUpdate extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      products : '',
      'modal': false,
      storeType: 'Shopify'
    }
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    
  }

  componentWillMount() {
    document.title = 'XSPACE | Product Updates'
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.importedProducts)
      this.setState({'shopifyProducts':nextProps.importedProducts})
    else if (nextProps.excelProducts)
      this.setState({'excelProducts':nextProps.excelProducts})
    else if (nextProps.createdProduct)
      this.setState({'createdProduct':nextProps.createdProduct})
  }

  onChange(event){
    this.setState({
      storeType: event.target.value
    })
  }

  render() {

    return (
      <Container>
        <div className="animated">
          <ProductView>
            <StyledLeftPanel>
              <ManageLeftSideMenu active={2}/>
            </StyledLeftPanel>
            <RightPanel>
              <StyledRow>
                <div>
                  <img src={repeatImg} alt=''/>
                  <h5 className="active-product-label">Active Store for Updates</h5>
                </div>
                <div>
                  <input type="text" placeholder="Search name, ID, SKU, UPC..." name="searchQuery"/>
                  <span>Filter By: </span>
                  <Select onChange={this.onChange}>
                    <option value="Shopify">Shopify API</option>
                    <option value="Magento1212">Magento API</option>
                    <option value="Woocommerce">Woocommerce API</option>
                  </Select>
                </div>
              </StyledRow>
              <div className='flex-wrapper'>
                <ProductPull
                  storeType={this.state.storeType}
                  productImportStore={this.props.productImportStore}
                  products={this.props.importedProducts}
                  createProducts={this.props.createProducts}
                  productCount={this.props.productCount}>
                </ProductPull>
                <ProductPush
                  storeType={this.state.storeType}
                  importFromXspace={this.props.importFromXspace}
                  products={this.props.importedXspaceProducts}
                  exportToStore={this.props.exportToStore}
                  productCount={this.props.productCount}>
                </ProductPush>
              </div>    
            </RightPanel>
          </ProductView>
        </div>
      </Container>
    )
  }
}
