import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  select {
    -moz-appearance: window;
    -webkit-appearance: none;
    font-size: 12px;
    color: #333330;
    line-height: 20px;
    border: 2px solid #F4F5FA !important;
    display: block !important;
    outline: none;
    width: 100%;
    height: 38px;
    font-weight: bold;
    background-color: white;
    padding: 0 10px;
    border-radius: 10px;
  }
  i {
    font-size: 8px;
    position: absolute;
    top: 15px;
    right: 10px;
    opacity: .5;
    color: #333333;
  }
`

export const Select = ({onChange, children, value}) => {
  return (
    <Wrapper>
      <select value={value} onChange={onChange}>
        {children}
      </select>
      <i className="fa fa-chevron-down"/>
    </Wrapper> 
  )  
}