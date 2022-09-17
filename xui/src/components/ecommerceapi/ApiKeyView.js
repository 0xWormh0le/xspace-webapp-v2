import React, {Component} from 'react'
import styled from 'styled-components'
import ShopifyForm from './ShopifyForm'
import MagentoForm from './MagentoForm'
import WooCommerceForm from './WoocommerceForm'
import LeftSideMenu from '../menu/LeftSideMenu'
import { Wrapper } from '../../lib/wrapper'
import {Select} from '../../lib/select'

export const FlexView = styled.div`
  display: flex;
`

const FlexDiv = styled.div`
  display: flex;
  padding: 50px 30px 30px;
  & > div {
    p {
      color: #333330;
      font-size: 12px;
      line-height: 20px;
      font-weight: 400;
    }
    select {
      border: none;
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
    }
  }
  & > div:first-child {
    width: calc(50% - 15px);
    margin-right: 30px;
  }
`

export const LeftPanel = styled(Wrapper)`
  margin-right: 30px;
  min-width: 263px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 600px;
  padding: 0;
`

export const RightPanel = styled(Wrapper)`
  &&& {
    position: relative;
    width: 100%;
    min-height: 600px;
    max-height: none;
    padding: 0;
  }  
`

const KeyLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none !important;
  padding: 1rem 25px;
  border-bottom: 2px solid #F4F5FA;
  i {
    font-size: 32px;
    padding-right: 20px;
  }
  span {
    font-size: 14px;
    line-height: 20px;
    color: #333333;
    font-weight: bold;
  }
`

export default class AddApiKey extends Component {

  constructor(props,context) {

    super(props,context);

    this.userId = props.userId
    this.state = {

      'userProfile': [],
      isSaveSuccessfully: false,
      apiType: 'Shopify'
    };
    //this.setState(mapStateToProps(this.state));
    console.log(this.state);
    this.formField = {
      store_url: '',
      shopify_apikey: '',
      shopify_password: '',
      store_id: '',
      cart_id: '',
      userId: this.userId,
      request_type: ""
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange(event){
    this.setState({apiType: event.target.value, value: event.target.value});
  }


componentWillReceiveProps(nextProps) {
    this.setState({'userProfile':nextProps.userInfo || '' })
  }


  handleInputChange = (event) => {
      const target = event.target,
          value = target.type ===
          'checkbox' ? target.checked : target.value,
        name = target.name
      this.setState({
          [name]: value
      });
  }

  render() {
    const errors = this.props.errors || {}
      return (
        <div className="container">
          <FlexView>
            <LeftPanel>
              <LeftSideMenu key={3} data={this.props} />
            </LeftPanel>
            <RightPanel>
              <KeyLink href="#">
                <i class="fa fa-cog"></i><span>API Keys</span>
              </KeyLink>
              <FlexDiv>
                <div>
                  <p>Select Your Store API To Connect To</p>
                  <Select value={this.state.value} onChange={this.onChange}>
                    <option value="Shopify">Shopify</option>
                    <option value="Magento">Magento</option>
                    <option value="Woocommerce">Woocommerce</option>
                  </Select>
                </div>
                <div>
                  {this.state.apiType === 'Shopify' && (
                    <ShopifyForm 
                      testConnection={this.testConnection}
                      updateConnection={this.updateConnection}
                      formField={this.formField}>
                    </ShopifyForm>
                  )}

                  {this.state.apiType === 'Magento' && (
                    <MagentoForm
                      testConnection={this.testConnection}
                      updateConnection={this.updateConnection}
                      formField={this.formField}>
                    </MagentoForm>
                  )}
                  
                  {this.state.apiType === 'Woocommerce' && (
                    <WooCommerceForm
                      testConnection={this.testConnection}
                      updateConnection={this.updateConnection}
                      formField={this.formField}>
                    </WooCommerceForm>
                  )}
                </div>
              </FlexDiv>              
            </RightPanel>
          </FlexView>
        </div>
      )
    }
  }