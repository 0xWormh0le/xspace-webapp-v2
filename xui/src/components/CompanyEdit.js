import React, {Component} from 'react';
import styled from 'styled-components'

import {Container,} from 'mdbreact';
import TextInput from '../lib/TextInput';
import {RegionDropdown} from 'react-country-region-selector';
import {CountryList} from '../constants'
import {Select} from '../lib/select'
import CompanyLogoUploader from './OrganizationViewCompanyLogoDragNDrop'

const Wrapper = styled(Container)`
  .button-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 25px 0;
    button {
      width: 133px;
      height: 38px;
      border: 2px solid #F4F5FA;
      color: #333330;
      font-size: 14px;
      line-height: 20px;
      background-color: white;
      border-radius: 19px;
      font-weight: bold;
      :hover {
        color: white;
        background-color: #00A3FF;
        border: none;
      }
    }
  }
`

export default class CompanyEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
            dropdownOpen: false,
            dropdownOpenCat: false,
            editing: true,
            modal: false,
            company:[],
            companyName: '',
            companyEmail: '',
            companyWebsiteURL: '',
            companyPhoneNumber: '',
            companyLogoURL: '',
            countryListOptions:[],
            address1:'',
            address2:'',
            poBoxNum:'',
            city:'',
            state: '',
            zipcode:'',
            country:'',
            industry: '',
            uploadedFile: null,
            error: {
                companyName: '',
                companyEmail: '',
                companyWebsiteURL: '',
                companyPhoneNumber: '',
                companyLogoURL: '',
                industry: '',
            }
        };
        this.submit = this.submit.bind(this);
        this.updateCompanyName = this.updateCompanyName.bind(this);
        this.updateCompanyEmail = this.updateCompanyEmail.bind(this);
        this.updateCompanyWebsiteURL = this.updateCompanyWebsiteURL.bind(this);
        this.updateCompanyPhoneNumber = this.updateCompanyPhoneNumber.bind(this);
        this.updateCompanyIndustry = this.updateCompanyIndustry.bind(this);

        this.handleOnChangeAddress1 = this.handleOnChangeAddress1.bind(this)
        this.handleOnChangeAddress2 = this.handleOnChangeAddress2.bind(this)
        this.handleOnChangePOBox = this.handleOnChangePOBox.bind(this)
        this.handleOnChangeCity = this.handleOnChangeCity.bind(this)
        this.handleOnChangeState = this.handleOnChangeState.bind(this)
        this.handleOnChangeZipCode = this.handleOnChangeZipCode.bind(this)
        this.handleFileSubmit = this.handleFileSubmit.bind(this)
    }

    componentDidMount() {
        if (this.props.company) {
            // console.log('initial props.company', this.props)
            const company = this.props
            // console.log('fieldValues', company.fieldValues)
            this.setState({
                "company": company["companyName"],
            }, function () {
                console.log('setting state1', this.state)
            });

            this.setState({
                "companyName": company.fieldValues.companyName ? company.fieldValues.companyName : undefined,
                "companyEmail": company.fieldValues.companyEmail ? company.fieldValues.companyEmail : undefined,
                "companyWebsiteURL": company.fieldValues.companyWebsiteURL ? company.fieldValues.companyWebsiteURL : undefined,
                "industry": company.fieldValues.industry ? company.fieldValues.industry : undefined,
                "companyPhoneNumber": company.fieldValues.companyPhoneNumber ? company.fieldValues.companyPhoneNumber : undefined,
            }, function () {
                console.log('setting state2', this.state)
            });

            if (company.fieldValues.mainAddress == null) {
                this.setState({"address1": 'No Address 1'});
                this.setState({"address2": 'No Address 2'});
                this.setState({"poBoxNum": 'No PO Box Num'});
                this.setState({"city": 'No City'});
                this.setState({"state": 'No State'});
                this.setState({"zipcode": 'No Zip Code '});
                this.setState({"country": 'No Country'});
            } else {
                this.setState({
                    "address1": company.fieldValues.mainAddress.address1 ? company.fieldValues.mainAddress.address1 : undefined,
                    "address2": company.fieldValues.mainAddress.address2 ? company.fieldValues.mainAddress.address2 : undefined,
                    "poBoxNum": company.fieldValues.mainAddress.poBoxNum ? company.fieldValues.mainAddress.poBoxNum : undefined,
                    "city": company.fieldValues.mainAddress.city ? company.fieldValues.mainAddress.city : undefined,
                    "state": company.fieldValues.mainAddress.state ? company.fieldValues.mainAddress.state : undefined,
                    "zipcode": company.fieldValues.mainAddress.zipcode ? company.fieldValues.mainAddress.zipcode : undefined,
                    "country": company.fieldValues.mainAddress.country ? company.fieldValues.mainAddress.country : undefined,
                })
            }
        }
    }

    // selectCountry (event) {
    //     this.setState({ country: event.target.value });
    // }

    selectRegion (val) {
        this.setState({region: val});
    }

    checkValidity() {
        let namePass, companyEmailPass, companyWebsiteURLPass, companyPhoneNumberPass, industryPass;
        let {companyName, companyEmail, companyWebsiteURL, companyPhoneNumber, industry} = this.state;
        let pass = true
        if (companyName === '') {
            namePass = 'Company Name field cannot be empty'
            pass = false
        } else {
            namePass = companyName
        }
        if (companyEmail === '') {
            companyEmailPass = 'Company Email field cannot be empty'
            pass = false
        } else {
            companyEmailPass = companyEmail
        }
        if (companyWebsiteURL === '') {
            companyWebsiteURLPass = 'Company Website URL field cannot be empty'
            pass = false
        } else {
            companyWebsiteURLPass = companyWebsiteURL
        }
        if (companyPhoneNumber === '') {
            companyPhoneNumberPass = 'Phone Number field cannot be empty'
            pass = false
        } else {
            companyPhoneNumberPass = companyPhoneNumber
        }
        if (industry === '') {
            industryPass = 'Phone Number field cannot be empty'
            pass = false
        } else {
            industryPass = industry
        }


        if (pass === false) {
            this.setState(
                {
                    'error':
                        {
                            'companyName': namePass,
                            'companyEmail': companyEmailPass,
                            'companyWebsiteURL': companyWebsiteURLPass,
                            'companyPhoneNumber': companyPhoneNumberPass,
                            'industry': industryPass,
                        }
                }
            )
        }
        return pass
    }

    handleOnChangeAddress1(evt){
        this.setState({
            'address1':evt.target.value
        });

        this.props.fieldValues.newAddressData.address1 = evt.target.value
        //console.log(this.props.fieldValues.newAddressData.address1)
    }

    handleOnChangeAddress2(evt){
        this.setState({
            'address2':evt.target.value
        });
        this.props.fieldValues.newAddressData.address2 = evt.target.value
        //console.log(this.props.fieldValues.newAddressData.address2)
    }
    handleOnChangePOBox(evt){
        this.setState({
            'poBoxNum':evt.target.value
        });
        this.props.fieldValues.newAddressData.poBoxNum = evt.target.value
        //console.log(this.props.fieldValues.newAddressData.poBoxNum)
    }
    handleOnChangeCity(evt){
        this.setState({
            'city':evt.target.value
        });
        this.props.fieldValues.newAddressData.city = evt.target.value
        //console.log(this.props.fieldValues.newAddressData.city)
    }
    handleOnChangeState(evt){
        this.setState({
            'state':evt.target.value
        });
        this.props.fieldValues.newAddressData.state = evt.target.value
        //console.log(this.props.fieldValues.newAddressData.state)
    }
    handleOnChangeZipCode(evt){
        this.setState({
            'zipcode':evt.target.value
        });
        this.props.fieldValues.newAddressData.zipcode = evt.target.value
        //console.log(this.props.fieldValues.newAddressData.zipcode)
    }
    handleOnChangeCountry = (evt) => {
        this.setState({
            'country':evt.target.value
        });
        this.props.fieldValues.newAddressData.country = evt.target.value
        //console.log(this.props.fieldValues.newAddressData.country)
    }

    updateCompanyName(evt) {
        this.setState({
            'companyName':evt.target.value
        });
        this.props.fieldValues.companyName = evt.target.value
    }

    updateCompanyEmail(evt) {
        this.setState({
            'companyEmail':evt.target.value
        });
        this.props.fieldValues.companyEmail = evt.target.value
    }

    updateCompanyWebsiteURL(evt) {
        this.setState({
            'companyWebsiteURL':evt.target.value
        });
        this.props.fieldValues.companyWebsiteURL = evt.target.value
    }

    updateCompanyPhoneNumber(evt) {
        this.setState({
            'companyPhoneNumber':evt.target.value
        });
        this.props.fieldValues.companyPhoneNumber = evt.target.value
    }

    updateCompanyIndustry(evt) {
        this.setState({
            'industry':evt.target.value
        });
        this.props.fieldValues.industry = evt.target.value
    }


    submit() {
        let { companyName, companyEmail, companyWebsiteURL, companyPhoneNumber, address1, address2, poBoxNum, city, state, zipcode, country, industry, uploadedFile } = this.state
        // var selectedCategory = $("#categoryList option:selected").attr('id');

        let mainAddressSubmit = {
            "address1": address1,
            "address2": address2,
            "poBoxNum": poBoxNum,
            "city": city,
            "state": state,
            "zipcode": zipcode,
            "country": country,
        }

        let companySubmit = {
            "companyName": companyName,
            "companyEmail": companyEmail,
            "companyWebsiteURL": companyWebsiteURL,
            "companyPhoneNumber": companyPhoneNumber,
            "industry":industry,
            "mainAddress": mainAddressSubmit,
        }

        // if there is an uploaded file then let's upload it
        if (uploadedFile) {
            this.props.uploadHandler(uploadedFile)
        }
        // if there was adjusted information, let's adjust it in the database
        console.log("companySubmit", companySubmit)
        this.props.updateCompany(companySubmit)
        this.props.notify('success2')
        this.props.cancel();
    }

    handleFileSubmit(dataTransfer) {
        // console.log("hadleFileSubmit receieved:", dataTransfer)
        // console.log('target that was transferred', target)
        this.setState({uploadedFile: dataTransfer})
        this.props.fieldValues.companyLogoURL = this.state.uploadedFile
        // console.log('target that was recorded', this.state.uploadedFile)
    }

    render() {
        const errors = this.props.errors || {}
        const { modal } = this.state
        const region = this.props.country !== '' ? (<RegionDropdown
            country={this.state.country}
            value={this.state.region}
            onChange={(val) => this.selectRegion(val)} />) : <br />

        let inputName =  <TextInput name="Company Name" label="Company" error={this.state.error.companyName}
                                    onChange={this.updateCompanyName} value={this.state.companyName}/>
        let inputURL = <TextInput name="Company Website URL" label="Company Website URL"
                                  onChange={this.updateCompanyWebsiteURL} error={this.state.error.companyWebsiteURL}
                                  value={this.state.companyWebsiteURL}/>
        // let inputLogoURL = <TextInput name="Company Logo URL" label="Company Logo URL" onChange={this.updateCompanyLogoURL} error={this.state.error.companyLogoURL} value={this.state.companyLogoURL}/>
        let inputPhone = <TextInput name="Company Phone Number" label="Company Phone Number"
                                    onChange={this.updateCompanyPhoneNumber} error={this.state.error.companyPhoneNumber}
                                    value={this.state.companyPhoneNumber}/>
        let inputEmail = <TextInput name="Company Admin Email" label="Company Admin Email"
                                    onChange={this.updateCompanyEmail} error={this.state.error.companyEmail}
                                    value={this.state.companyEmail}/>
        let inputIndustry = <TextInput name="Company Industry" label="Company Industry"
                                       onChange={this.updateCompanyIndustry} error={this.state.error.industry}
                                       value={this.state.industry}/>

        let companyLogoInput = <CompanyLogoUploader fieldValues={this.fieldValues}
                                                    handleFileSubmit={this.handleFileSubmit}/>

        return (
            <Wrapper>
                <div className="animated">
                    <div className="row">
                        <div className="col-sm-6">
                            {inputName}
                            {inputEmail}
                        </div>
                        <div className="col-sm-6">
                            {inputPhone}
                            {inputIndustry}
                            <br />
                        </div>
                    </div>
                    {inputURL}
                    <TextInput name="Address 1" label="Address 1" onChange={this.handleOnChangeAddress1}
                               error={this.state.error.address1} value={this.state.address1}/>
                    <TextInput name="Address 2" label="Address 2" outline onChange={this.handleOnChangeAddress2}
                               error={this.state.error.address2} value={this.state.address2}/>
                    <TextInput name="City" label="City" onChange={this.handleOnChangeCity}
                               error={this.state.error.city} value={this.state.city}/>
                    <TextInput name="State" label="State" onChange={this.handleOnChangeState}
                               error={this.state.error.state} value={this.state.state}/>
                    <TextInput name="Zip Code" label="Zip Code" onChange={this.handleOnChangeZipCode}
                               error={this.state.error.zipcode} value={this.state.zipcode}/>
                    <label className="mt-3">Country</label>
                    <Select onChange={this.handleOnChangeCountry}>
                        <option selected>United States</option>
                        {CountryList.map((item, idx) => <option value={item.country}>{item.country}</option>)}
                    </Select>
                    <br/>
                    <div>
                        {companyLogoInput}
                    </div>

                    <div className='button-wrapper'>
                        <button onClick={this.submit}>Save</button>
                        <button onClick={this.props.cancel}>Cancel</button>
                    </div>
                </div>
            </Wrapper>
        );
    }
}
