import React, { Component } from 'react';
import styled from 'styled-components'
import { Container } from './ContentSettings'
import { Select } from '../../../lib/select'
import TextInput from '../../../lib/TextInput';

const Wrapper = styled(Container)`
  h3 {
    color: #333330;
    max-width: 600px;
    font-size: 18px;
    line-height: 26px;
    text-align: center;
    margin: auto;
    margin-bottom: 20px;
    font-weight: 400;
  }
`

const ErrorLabel = styled.p`
  margin: 5px 0;
  color: red;
  font-size: 12px;
  line-height: 20px;
`

const ContentFileNaming = (props) => {
  const { errors, onChange } = props
  const {
    filename_delimiter,
    filename_prefix,
    filename_base,
    filename_suffix,
  } = props.fieldValues
  return (
    <Wrapper>
      <div className="animated">
        <h3>You may specify a custom file name structure for all your content. XSPACE ensures all files follow your custom filenames</h3>
        <div className="label-content">
          <label>Select Filename Seperator</label>
          <Select onChange={e => onChange(e, 'filename_delimiter')} value={filename_delimiter}>
            <option value="-">Hyphen ("-")</option>
            <option value="_">Underscore ("_")</option>
          </Select>
          <ErrorLabel>{errors.filename_delimiter}</ErrorLabel>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-4">
            <div className="label-content">
              <label>Select Filename Prefix</label>
              <Select onChange={e => onChange(e, 'filename_prefix')} value={filename_prefix}>
                <option value="None">No Prefix</option>
                <option value="$NAME">Product Name</option>
                <option value="$SKU">SKU</option>
                <option value="$UPC">UPC</option>
                <option value="$CUSTOM">Custom...</option>
              </Select>
              <ErrorLabel>{errors.filename_prefix}</ErrorLabel>
              <TextInput onChange={onChange} name={'filename_prefix'} value={filename_prefix} label={'Custom Prefix...(If Any)'} placeholder="Custom Prefix...(If Any)"/>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="label-content">
              <label>Select Filename Base</label>
              <Select onChange={e => onChange(e, 'filename_base')} value={filename_base}>
                <option value="$NAME">Product Name</option>
                <option value="$SKU">SKU</option>
                <option value="$UPC">UPC</option>
                <option value="$CUSTOM">Custom...</option>
              </Select>
              <TextInput onChange={onChange} name={'filename_base'} value={filename_base} label={'Custom Prefix...(If Any)'} placeholder="Custom Base Name...(If Any)"/>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="label-content">
              <label>Select Filename Suffix</label>
              <Select onChange={e => onChange(e, 'filename_suffix')} value={filename_suffix}>
                <option value="None">No Suffix</option>
                <option value="$NAME">Product Name</option>
                <option value="$SKU">SKU</option>
                <option value="$UPC">UPC</option>
                <option value="$CUSTOM">Custom...</option>
              </Select>
              <TextInput onChange={onChange} name={'filename_suffix'} value={filename_suffix} label={'Custom Suffix...(If Any)'} placeholder="Custom Suffix...(If Any)"/>
            </div>
          </div>
        </div>
        <br />
      </div>
    </Wrapper>
  )
}

export default ContentFileNaming
