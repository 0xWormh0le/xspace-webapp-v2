import React from 'react'
import styled from 'styled-components'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap';

const Wrapper = styled(FormGroup)`
  div.label-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      display: block;
      width: 6px;
      height: 6px;
      background-color: #EB5757;
      border-radius: 6px;
    }
    label {
      font-size: 12px;
      color: #333330;
      line-height: 20px;
      margin: 0;
      margin-top: 5px;
    }
  }
  input {
    font-size: 14px;
    line-height: 38px;
    font-weight: bold;
    height: 38px;
    color: #333333;
    border: 2px solid #F4F5FA !important;
    padding: 0 10px;
    border-radius: 10px;
    :focus {
      border: none !important;
    }
  }
`

export default ({name, label, error, type, required, placeholder, variation, ...rest}) => {
  const id = `id_${name}`,
        input_type = type?type:"text"
  return (
      <Wrapper color={error?"danger":""} style={variation ? {display: "inline-flex"} : {}}>
          <div className='label-wrapper'>
            {label && <Label htmlFor={id}>{label}</Label>}
            {!variation && required && <span />}
          </div>
          <Input
            type={input_type}
            name={name}
            id={id}
            className={error?"is-invalid":""}
            placeholder={placeholder}
            {...rest}
          />
          {error?
             <FormFeedback className="invalid-feedback">
               {error}
             </FormFeedback>
             : ""
          }
          { variation ? <div className='label-wrapper'> <span /> </div> : ""}
      </Wrapper>
  )
}
