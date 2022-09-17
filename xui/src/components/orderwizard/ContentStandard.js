import React, { Component } from 'react'
import { Button } from 'mdbreact'
import { MDBRow, MDBCol } from "mdbreact"
import ContentStandardStart from '../orderwizard/standards/Start'
import ContentStandardSettings from '../orderwizard/standards/ContentSettings'
import ContentStandardFormatting from '../orderwizard/standards/ContentFormatting'
import ContentStandardFileNaming from '../orderwizard/standards/ContentFileNaming'
import ContentStandardSave from '../orderwizard/standards/ContentSave'
import { Step } from '../ProductCreateView'

const STEP_1_STANDARD_START = 1
const STEP_2_STANDARD_SETTINGS = 2
const STEP_3_STANDARD_FORMATTING = 3
const STEP_4_STANDARD_FILENAMING = 4
const STEP_5_STANDARD_REVIEW = 5
const STEP_6_STANDARD_DONE = 6

export default class ContentStandard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      name:'',
      description:'',
      image_file_type: '.PNG',
      image_background_type: 'White',
      image_color_profile: 'sRGB',
      image_compression_type: 'Ready-For-Web',
      image_ideal_file_size: '2000x2000',
      image_width: '2000',
      image_height: '2000',
      image_margin_type: '%',
      image_margin_top: 5,
      image_margin_left: 5,
      image_margin_bottom: 5,
      image_margin_right: 5,
      threeSixtyImage_file_type: '.PNG',
      threeSixtyImage_background_type: 'White',
      threeSixtyImage_color_profile: 'sRGB',
      threeSixtyImage_compression_type: 'Ready-For-Web',
      threeSixtyImage_margin_type: '%',
      threeSixtyImage_margin_top: 5,
      threeSixtyImage_margin_left: 5,
      threeSixtyImage_margin_bottom: 5,
      threeSixtyImage_margin_right: 5,
      threeD_file_type: '.FX',
      threeD_compression_type: 'None',
      video_file_type: '.MOV',
      video_file_type_other: '',
      filename_prefix: '$NONE',
      filename_base: '$NAME',
      filename_delimiter: '_',
      filename_suffix: '$NONE',
      errors: {
        name: '',
        description: '',
        image_file_type: '',
        image_background_type: '',
        image_color_profile: '',
        image_compression_type: '',
        image_ideal_file_size: '',
        image_width: '',
        image_height: '',
        image_margin_type: '',
        image_margin_top: '',
        image_margin_left: '',
        image_margin_bottom: '',
        image_margin_right: '',
        threeSixtyImage_file_type: '',
        threeSixtyImage_background_type: '',
        threeSixtyImage_color_profile: '',
        threeSixtyImage_compression_type: '',
        threeSixtyImage_margin_type: '',
        threeSixtyImage_margin_top: '',
        threeSixtyImage_margin_left: '',
        threeSixtyImage_margin_bottom: '',
        threeSixtyImage_margin_right: '',
        threeD_file_type: '',
        threeD_compression_type: '',
        video_file_type_other: '',
        filename_prefix: '',
        filename_base: '',
        filename_delimiter: '',
        filename_suffix: '',
      }
    };    
  }

  finish = () => {
    this.setState({ step: STEP_6_STANDARD_DONE })
  }

  reset = () => {
    this.setState({ step: 1 })
  }

  resetStage = () => {
    this.setState({ step: 1 })
  }

  nextStep = () => {
    if(!this.validate()) return
    if (this.state.step === 5) {
      this.setState({
          step : this.state.step + 1
      })
    }
    else if (this.state.step === 1) {
      this.setState({
          step : this.state.step + 1
      })
    }
    else if(this.state.step === 2){
      this.setState({
        step : this.state.step + 1
      })
    }
    else if(this.state.step === 3){
      this.setState({
          step : this.state.step + 1
      })
    }
    else if(this.state.step === 4){
      this.setState({
          step : this.state.step + 1
      })
    }
    else if(this.state.step === 0){
      this.setState({
          step : this.state.step + 1
      })
    }
  }

  // Same as nextStep, but decrementing
  previousStep = () => {
    this.setState({ step: this.state.step === 1 ? this.state.step : this.state.step - 1 })
  }

  submit = (event) => {
    event.preventDefault()
    // this.props.onSubmit(this.state.username, this.state.password)
    // this.props.standardSubmit()
  }

  validate = () => {
    const {
      name,
      image_width,
      image_height,
      video_file_type,
      video_file_type_other,
    } = this.state
    
    this.setState({
      errors: {
        name: name === '' ? 'Content Standard Name field cannot be empty' : '',
        image_width: image_width === '' ? 'Image Width field cannot be empty' : '',
        image_height: image_height === '' ? 'Image Height field cannot be empty' : '',
        video_file_type_other: (video_file_type === 'Other' && video_file_type_other === '') ? 'Video File Type field cannot be empty' : '',
      }
    })
    return name !== '' && image_width !== '' && image_height !== '' && (video_file_type !== 'Other' || (video_file_type === 'Other' && video_file_type_other !== ''))
  }

  onChange = (event, selectName) => {
    const { name, value } = event.target
    // console.log(event.target, name, value)
    if (name) {
      this.setState({ [name]: value }, () => {
        this.validate()
      })
    } else {
      this.setState({ [selectName]: value }, () => {
        this.validate()
      })
    }
    
  }

  render() {

    const { step } = this.state

    let fragment = (<h2>None</h2>);
    let nextButton = null;

    switch (step) {
      case STEP_1_STANDARD_START:
        fragment = <ContentStandardStart
                    fieldValues={this.state}
                    errors={this.state.errors}
                    onChange={this.onChange} />
        nextButton = <Button color="get-started" onClick={ this.nextStep }>Next</Button>
        break;
      case STEP_2_STANDARD_SETTINGS:
       fragment = <ContentStandardSettings
                    fieldValues={this.state}
                    errors={this.state.errors}
                    onChange={this.onChange} />
        nextButton = <Button color="get-started" onClick={ this.nextStep }>Next</Button>
        break;
      case STEP_3_STANDARD_FORMATTING:
        fragment = <ContentStandardFormatting
                    fieldValues={this.state}
                    errors={this.state.errors}
                    onChange={this.onChange} />
        nextButton = <Button color="get-started" onClick={ this.nextStep }>Next</Button>
        break;
      case STEP_4_STANDARD_FILENAMING:
        fragment = <ContentStandardFileNaming
                    fieldValues={this.state}
                    errors={this.state.errors}
                    onChange={this.onChange} />
        nextButton = <Button color="get-started" onClick={ this.nextStep }>Create Standard</Button>
        break;
      case STEP_5_STANDARD_REVIEW:
        fragment = <ContentStandardSave
                    fieldValues={this.state}
                    errors={this.state.errors}
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    step={step}
                    accessToken={this.props.accessToken}
                    userInfo={this.props.userInfo}
                    standardSubmit={this.props.standardSubmit}
                    finish={this.finish}
                    cancel={this.props.cancel}>

                  </ContentStandardSave>
        break;
      default:
        fragment = (<h2>Lets go to the Dashboard!</h2>);
        break;
    }

    return (
      <MDBCol md="12">
        <div className="animated">
          <div class="flex-container-row">
            <Step isStep={step === 1} isPassed={step > 1}>
              <span>1</span>
              <p>Start</p>
            </Step>
            <Step isStep={step === 2} isPassed={step > 2}>
              <span>2</span>
              <p>Settings</p>
            </Step>
            <Step isStep={step === 3} isPassed={step > 3}>
              <span>3</span>
              <p>Formatting</p>
            </Step>
            <Step isStep={step === 4} isPassed={step > 4}>
              <span>4</span>
              <p>File Naming</p>
            </Step>
          </div>
          {fragment}
          <MDBRow>
            {step !== 5 &&  step > 1 && <Button onClick={ this.previousStep } color="get-started" style={{backgroundColor: step === 1 ? 'gray' : '#00A3FF'}} >Back</Button>}
            {step === 0 && <Button onClick={ this.props.cancel }>Cancel</Button>}
            {nextButton}
          </MDBRow>
        </div>
      </MDBCol>
    );
  }
}
