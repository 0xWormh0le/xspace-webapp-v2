import React from 'react'
import styled, {keyframes} from 'styled-components'
import { StyledButton } from '../../lib/button'

const stroke = keyframes`{
  100% {
    stroke-dashoffset: 0;
  }
}`

const scale = keyframes`{
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}`

const fill = keyframes`{
  100% {
    box-shadow: inset 0px 0px 0px 100px #82FFB6;
  }
}`

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 350px;
  .container {
    text-align: center;
    position: relative;
    .checkmark__circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 2;
      stroke-miterlimit: 10;
      stroke: #82FFB6;
      fill: none;
      animation: ${stroke} 1.2s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    .checkmark {
      width: 200px;
      height: 200px;
      position: relative;
      border-radius: 50%;
      display: block;
      stroke-width: 2;
      stroke: #fff;
      stroke-miterlimit: 10;
      margin: 0 auto;
      margin-top: -30px;
      margin-bottom: 20px;
      background-color: white;
      box-shadow: inset 0px 0px 0px #82FFB6;
      animation: ${fill} .8s ease-in-out .8s forwards, ${scale} .6s ease-in-out 1.8s both;
    }

    .checkmark__check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: ${stroke} 0.6s cubic-bezier(0.65, 0, 0.45, 1) 1.6s forwards;
    }
    h5 {
      font-size: 18px;
      line-height: 26px;
      color: #333330;
      font-weight: 400;
    }
    p {
      color: #333330;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 30px;
      opacity: .5;
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 213px;
        height: 58px;
        background-color: white;
        color: #00A3FF;
        font-size: 18px;
        line-height: 26px;
        font-weight: bold;
        border-radius: 29px;
        border: 2px solid #F4F5FA;
        margin-left: 30px;
        text-decoration: none;
        :hover {
          box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
          background-color: #00A3FF;
          color: white;
          border: none;
        }
      }
    }    
  }
`

const ProductDone = ({reset,finish}) => {
  console.log('productdone', finish)
  return (
    <Wrapper>
      <div class="container animated fadeIn">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
        <h5>All Done! </h5>
        <p>Your product has been created successfully.</p>
        <div className='buttons'>
          <StyledButton onClick={reset}>Create Another</StyledButton>
          {/*<StyledButton onClick={finish}>Manage Products</StyledButton>*/}
          {/*<a href="/#/products/manage">Manage Products</a>*/}
          <a href="javascript:;" onClick={finish}>Manage Products</a>
        </div>
      </div>
    </Wrapper>
  )
}

export default ProductDone
