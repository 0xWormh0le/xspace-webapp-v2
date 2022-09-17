import React, { Component } from 'react';
import { Button } from 'mdbreact';
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from "mdbreact";
import { MDBSelect, MDBSelectInput, MDBSelectOptions, MDBSelectOption} from "mdbreact";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';
import BatchButton from "./BatchButton";

import './BatchModal.css';

import axios from 'axios';

export default class BatchModal extends Component {

  constructor(props) {
    super(props)
    this.state = props.batchInfo
    this.setTitle = this.setTitle.bind(this)
    this.setText2DNotes = this.setText2DNotes.bind(this)
    this.setText3DNotes = this.setText3DNotes.bind(this)
    this.setText360Notes = this.setText360Notes.bind(this)
    this.setTextVRARNotes = this.setTextVRARNotes.bind(this)
  }

  setTitle(e) {
    this.setState({"title":e.target.value})
  }

  setText2DNotes(e) {
    this.setState({"text2DNotes":e.target.value})
  }

  setText3DNotes(e) {
    this.setState({"text3DNotes":e.target.value})
  }

  setText360Notes(e) {
    this.setState({"text360Notes":e.target.value})
  }

  setTextVRARNotes(e) {
    this.setState({"text3DVRARNotes":e.target.value})
  }

  render() {

    let { hasSingleShot, hasFourPackShot, hasFivePackShot, hasStandardHD,
      has4kProductVideo, hasVideoWalkthrough, has360View, has3DIntegratedModel,
      hasStandard3DModel, hasAdvanced3DModel, hasCinematic3DModel, title,
      text2DNotes, text3DNotes, text360Notes, text3DVRARNotes} = this.state

    return (
        <MDBContainer>
          <div className="animated">
            <MDBRow>
              <MDBCol sm="12">
                  Select the product content services you would like to order for this batch.
                  <MDBBtn rounded gradient="purple" className="mb-3 mt-3" href="https://xspaceapp.com/pricing" target="_blank"><i className="fa fa-question-circle" aria-hidden="true"></i>    Pricing</MDBBtn>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol sm="9">
                <MDBInput label="Batch Name" onChange={this.setTitle} value={title} />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol sm="6">
                <p className="batch-category">2D Photo Services</p>
                <BatchButton text="Single Shot" selected={hasSingleShot} setCustomServices={(selected)=>{this.setState({"hasSingleShot":selected})}}></BatchButton>
                <BatchButton text="4 Pack Shot" selected={hasFourPackShot} setCustomServices={(selected)=>{this.setState({"hasFourPackShot":selected})}}></BatchButton>
                <BatchButton text="5 Pack Shot" selected={hasFivePackShot} setCustomServices={(selected)=>{this.setState({"hasFivePackShot":selected})}}></BatchButton>
              </MDBCol>
              <MDBCol sm="6">
                <p className="batch-category">Video Services</p>
                <BatchButton text="Standard HD" selected={hasStandardHD} setCustomServices={(selected)=>{this.setState({"hasStandardHD":selected})}}></BatchButton>
                <BatchButton text="4K Product Video" selected={has4kProductVideo} setCustomServices={(selected)=>{this.setState({"has4kProductVideo":selected})}}></BatchButton>
                <BatchButton text="4K Walkthrough" selected={hasVideoWalkthrough} setCustomServices={(selected)=>{this.setState({"hasVideoWalkthrough":selected})}}></BatchButton>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol sm="6">
                <br />
                <p className="batch-category">360 / 3D Integrated View Services</p>
                <BatchButton text="360 View" selected={has360View} setCustomServices={(selected)=>{this.setState({"has360View":selected})}}></BatchButton>
                <BatchButton text="3D Integ. Model" selected={has3DIntegratedModel} setCustomServices={(selected)=>{this.setState({"has3DIntegratedModel":selected})}}></BatchButton>
              </MDBCol>
              <MDBCol sm="6">
                <br />
                <p className="batch-category">3D AR/VR Notes</p>
                <BatchButton text="Standard 3D Model" selected={hasStandard3DModel} setCustomServices={(selected)=>{this.setState({"hasStandard3DModel":selected})}}></BatchButton>
                <BatchButton text="Adv. 3D Model" selected={hasAdvanced3DModel} setCustomServices={(selected)=>{this.setState({"hasAdvanced3DModel":selected})}}></BatchButton>
                <BatchButton text="Cinema 3D Model" selected={hasCinematic3DModel} setCustomServices={(selected)=>{this.setState({"hasCinematic3DModel":selected})}}></BatchButton>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol sm="6">
                <MDBInput onChange={this.setText2DNotes} value={text2DNotes} icon="pen" label="2D Notes" type="textarea" rows="2" />
              </MDBCol>
              <MDBCol sm="6">
                <MDBInput onChange={this.setText3DNotes} value={text3DNotes} icon="pen" label="3D Notes" type="textarea" rows="2" />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol sm="6">
                <MDBInput onChange={this.setText360Notes} value={text360Notes} icon="pen" label="360 / 3D Integration Notes" type="textarea" rows="2" />
              </MDBCol>
              <MDBCol sm="6">
                <MDBInput onChange={this.setTextVRARNotes} value={text3DVRARNotes} icon="pen" label="3D AR/VR Notes" type="textarea" rows="2" />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol sm="6"></MDBCol>
              <MDBCol sm="6">
                <MDBBtn onClick={()=>{this.props.cancelModal()}} color="blue-grey">Cancel</MDBBtn>
                <MDBBtn onClick={()=>{this.props.saveBatchInfo(this.state)}}color="primary">Save Services</MDBBtn>
              </MDBCol>
            </MDBRow>
          </div>
        </MDBContainer>
    )
  }
}
