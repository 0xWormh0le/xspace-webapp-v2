import styled from 'styled-components'

export const StyledButton = styled.button`
  width: 213px;
  height: 58px;
  background-color: white;
  color: #00A3FF;
  font-size: 18px;
  line-height: 26px;
  font-weight: bold;
  border-radius: 29px;
  border: 2px solid #F4F5FA;
  :hover {
    background-color: #00A3FF;
    color: white;
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

export const StyledButton2 = styled.button`
  width: 213px;
  height: 58px;
  background-color: ${props => props.successColor ? "#00d138" : "#3eb2ff"};
  color: #ffffff;
  font-size: 24px;
  line-height: 26px;
  font-weight: normal;
  border-radius: 29px;
  border: 2px solid #F4F5FA;
  
  
  :hover {
    background-color: ${props => props.successColor ? "#00d138" : "#00A3FF"};
    color: white;
    border: none;
  }
  :focus {
    background-color: ${props => props.successColor ? "#00d138" : "#00A3FF"};
  }
  
  :disabled {
    background-color: #c1c1c1;
  }
  
  &.small-btn {
    width: 130px;
    height: 38px;
    border-radius: 19px;
    font-size: 14px;
  }
  &.filled-btn {
    background-color: ${props => props.successColor ? "#00d138" : "#00A3FF"};
    color: #ffffff;
  }
`