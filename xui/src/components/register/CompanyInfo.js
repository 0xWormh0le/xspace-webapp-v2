import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';
import {updateCompanyProfile} from  '../../actions/profile'

export default class CompanyInfo extends Component {

  constructor (props) {
    super(props);
    this.state = {
      companyName: '',
      industry: '',
      companyRole: '',
      error: '',
      enabled: true};

      this.registerCompanyInfo = this.registerCompanyInfo.bind(this);
      this.inputIndustryChange = this.inputIndustryChange.bind(this);
      this.inputCompanyNameChange = this.inputCompanyNameChange.bind(this);
      this.inputCompanyRoleChange = this.inputCompanyRoleChange.bind(this);

  }
  componentDidMount() {

  }

  registerCompanyInfo(evt) {
    let {companyName, industry, companyRole} = this.state;
    if(companyName != '' && industry != '' && companyRole != ''){
      this.setState({'enabled': false});

      this.props.onSubmit(companyName, industry, companyRole).then((res)=> {
        this.props.nextStep()
      }).catch((err) => {
        this.setState({'error':err,'enabled':true})
      });
    }
    else{
      this.setState({'error':'All fields are required.','enabled':true})
    }
  }

  inputIndustryChange(evt) {
    this.setState({"industry": evt.target.value});
  }

  inputCompanyNameChange(evt) {
    this.setState({"companyName": evt.target.value});
  }

  inputCompanyRoleChange(evt) {
    this.setState({"companyRole": evt.target.value});
  }

  render() {
    const { error, enabled } = this.state;
    let errorView = (<div></div>)
    let enabledView = (<a class="btn btn-lg btn-primary">Please wait...</a>)
    const errors = this.props.errors || {}
    if (error) {
      errorView = (<div class="animated fadeIn"><br /><p style={{color: 'red'}}>{error}</p><br /></div>);
    }
    //if the submit button is enabled
    if (enabled) {
      enabledView = (<a onClick={ this.registerCompanyInfo } class="btn btn-lg btn-primary">Continue</a>)
    }
    return (
      <div class="animated fadeInLeft">
        <h3>Step 2 / 3</h3>
        <p>Tell Us About Yourself</p>
        {errorView}
        <Input value={this.state.companyName} onChange={this.inputCompanyNameChange} label="Company Name" group type="text" validate error="wrong" success="right"/>
        <Input value={this.state.industry} onChange={this.inputIndustryChange} label="Industry" group type="text" validate error="wrong" success="right"/>
        <Input value={this.state.companyRole} onChange={this.inputCompanyRoleChange} label="Company Role" group type="text" validate error="wrong" success="right"/>
        <br />
        <hr />
        <div className="text-center">
          <a onClick={ this.props.previousStep } class="btn btn-lg btn-primary">Go Back</a>
          {enabledView}
        </div>
      </div>
    );
  }
}
