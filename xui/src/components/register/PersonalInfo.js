import React, {Component} from 'react'
import { Input, Button } from 'mdbreact';
import NumericInput from 'react-numeric-input';
import Phone from 'react-phone-number-input';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';



import 'react-phone-number-input/rrui.css';
import 'react-phone-number-input/style.css';

export default class PersonalInfo extends Component {

  constructor (props) {
    super(props);
    this.state = {
      phone:'',
      country: '',
      region: '',
      city: '',
      state: '',
      zip: '',
      address1: '',
      address2: '-',
      error: '',
      enabled: true};

      this.inputZipChange = this.inputZipChange.bind(this);
      this.inputAddress1Change = this.inputAddress1Change.bind(this);
      this.inputAddress2Change = this.inputAddress2Change.bind(this);
      this.inputCityChange = this.inputCityChange.bind(this);
      this.inputStateChange = this.inputStateChange.bind(this);
      this.inputPhoneChange = this.inputPhoneChange.bind(this);
      this.inputCountryChange = this.inputCountryChange.bind(this);
      this.registerUserInfo = this.registerUserInfo.bind(this);
  }

  selectCountry (val) {
    this.setState({ country: val });
  }

  selectRegion (val) {
    this.setState({ region: val });
  }

  componentDidMount() {

  }

  registerUserInfo(evt) {
    let { phone, country, region, city, state, zip, address1, address2} = this.state;

    this.setState({'enabled': false});

    this.props.onSubmit(phone, address1, address2, "0000", city, region, zip, country).then((res)=> {

    }).catch((err) => {
      this.setState({'error':err,'enabled': true});
    });

  }

  inputPhoneChange(evt) {
    this.setState({"phone": evt.target.value})
  }

  inputCountryChange(evt) {
    this.setState({"country": evt.target.value})
  }

  inputCityChange(evt) {
    this.setState({"city": evt.target.value})
  }

  inputStateChange(evt) {
    this.setState({"state": evt.target.value})
  }

  inputAddress1Change(evt) {
    this.setState({"address1": evt.target.value})
  }

  inputAddress2Change(evt) {
    this.setState({"address2": evt.target.value})
  }

  inputZipChange(evt) {
    this.setState({"zip": evt.target.value})
  }

  render() {
    const errors = this.props.errors || {}
    const region = this.props.country != '' ? (<RegionDropdown
                  country={this.state.country}
                  value={this.state.region}
                  onChange={(val) => this.selectRegion(val)} />) : <br />

    const {error, enabled} = this.state;
    let errorView = (<div></div>)
    let enabledView = (<a class="btn btn-lg btn-primary">Please wait...</a>)
    if (error) {
      errorView = (<div class="animated fadeIn"><br /><p style={{color: 'red'}}>{error}</p><br /></div>);
    }
    if (enabled) {
      enabledView = (<a onClick={ this.registerUserInfo } class="btn btn-lg btn-primary">Continue</a>)
    }
    return (

      <div class="animated fadeInLeft">
        <h3>Step 3 / 3</h3>
        <p>User Information</p>
        {errorView}
        <Phone
            label="Phone Number"
            placeholder="Enter phone number"
            value={ this.state.phone }
            onChange={ phone => this.setState({ phone }) } />
        <br />
        <br />
        <div class="row">
          <div class="col-sm-9">
            <CountryDropdown
              value={this.state.country}
              onChange={(val) => this.selectCountry(val)} />
          </div>
        </div>
        <br />
        <div class="row" >
          <div class="col-sm-9">
            {region}
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-sm-9">
            <Input label="Address" value={this.state.address1} group type="text" validate error="wrong" success="right" onChange={this.inputAddress1Change}/>
          </div>
          <div class="col-sm-3">
            <Input label="Apt/Ste" value={this.state.address2} group type="text" validate error="wrong" success="right" onChange={this.inputAddress2Change}/>
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-sm-6">
            <Input label="City" value={this.state.city} group type="text" validate error="wrong" success="right" onChange={this.inputCityChange} />
          </div>
          <div class="col-sm-3">
            <Input label="ZIP" value={this.state.zip} group type="text" validate error="wrong" success="right" onChange={this.inputZipChange} />
          </div>
        </div>
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
