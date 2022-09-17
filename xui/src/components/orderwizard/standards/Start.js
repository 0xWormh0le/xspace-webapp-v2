import React from 'react';
import styled from 'styled-components'
import { MDBInput } from "mdbreact";
import TextInput from '../../../lib/TextInput'
const Container = styled.div`
  padding: 40px 65px;
  color: #333330;
  font-weight: 400;
  b {
    font-size: 18px;
    line-height: 26px;
    margin-bottom: 4px;
    font-weight: 400;
  }
  p {
    font-size: 14px;
    color: rgba(51, 51, 48, .5);
    line-height: 20px;
  }
  h5 {
    line-height: 20px;
    font-size: 12px;
  }
  ul {
    padding-inline-start: 20px;
  }
  li {
    font-size: 12px;
    line-height: 20px;
  }
  .md-form.md-outline {
    margin: 0;
    margin-bottom: 20px;
  }
  input, textarea, label {
    font-size: 14px;
  }
`

const Start = (props) => {
  console.log(props, props.errors)
  const {errors, onChange} = props
  const { name, description } = props.fieldValues
  return (
    <Container>
      <div className="animated">
        <div className="row">
          <div className="col-lg-6">
            <b class="animated fadeInDown">What Are Content Standards?</b>
            <p class="animated fadeInDown">
              Content Standards helps us define how your visuals should be formatted, & organized.
              <br />
              <br />
              By creating a content standard, we can ensure all product content created by XSPACE meets your brand's requirements. Sites like Amazon, Walmart, Target, etc. use content standards for consistent branding.
            </p>
          </div>
          <div className="col-lg-6">
            {/* <h5 class="animated fadeInDown">1. What would you like to name this content standard?</h5>
            <MDBInput label="Content Standard Name" outline onChange={this.updateStandardName} error={this.state.error.name} value={this.state.name}/> */}
            <TextInput name='name' label="1. What would you like to name this content standard?" required onChange={onChange} error={errors.name} value={name} placeholder='Content Standard Name'/>
            <h5>You may use content standard names such as:</h5>
            <ul>
              <li>“Fashion Clothing Content Standard”</li>
              <li>“My Shopify Store Content Standard”</li>
              <li>“Electronics Content Standards Q4 2018”</li>
            </ul>
            <h5 class="animated fadeInDown">2. Add a description (Optional)</h5>
            <MDBInput type="textarea" label="Description" name='description' outline onChange={onChange} value={description}/>
          </div>
        </div>
        <br />

      </div>
    </Container>
  );
}

export default Start
