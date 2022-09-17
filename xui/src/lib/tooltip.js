import React from 'react'
import styled, { keyframes, css } from 'styled-components'

const showing = keyframes`
  from {opacity: 0;}
  to {opacity: 1;}
`

const Wrapper = styled.div`
  position: relative;
  img:hover {
    cursor: pointer;
  }
  .tooltip-txt {
    opacity: ${p => p.h ? 1 : 0};
    position: absolute;
    z-index: 1;
    left: 18px;
    top: 18px;
    padding: 10px;
    font-size: 12px;
    background: #00A3FF;
    min-width: 140px;
    border-radius: 5px;
    color: white;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    ${p => p.h && css`
      animation-name: ${showing};
      animation-duration: 1s;
    `}    
  }
`

class StyledTooltip extends React.PureComponent {
  state = {
    hoverd: false
  }

  handleHover = () => {
    this.setState({ hoverd: true })
  }

  handleLeave = () => {
    this.setState({ hoverd: false })
  }

  render() {
    const { children, txt } = this.props
    const { hoverd } = this.state
    return (
      <Wrapper h={hoverd}>
        <div onMouseOver={this.handleHover} onMouseLeave={this.handleLeave}>{children}</div>
        {<div className='tooltip-txt'>{txt}</div>}
      </Wrapper>
    )
  }
}

export default StyledTooltip