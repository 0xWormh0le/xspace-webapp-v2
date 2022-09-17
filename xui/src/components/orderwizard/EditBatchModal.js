import React, { Component } from 'react';
import { Button } from 'mdbreact';
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from "mdbreact";
import { MDBSelect, MDBSelectInput, MDBSelectOptions, MDBSelectOption} from "mdbreact";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';
import BatchButton from "./BatchButton";

import './BatchModal.css';

import axios from 'axios';

export default class EditBatchModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        dropdownOpenCat: false,
        editing: true,
        tile:'',
        hasBackgroundRemoval: false,
        hasAutoCropAndCenter: false,
        hasRename: false,
        hasBlemishReduction: false,
        hasBarcodeDetection: false,
        renameNotes: ''
    };
    this.setTitle = this.setTitle.bind(this)
    this.setText2DNotes = this.setText2DNotes.bind(this)
    this.setRenameNotes = this.setRenameNotes.bind(this)

    this.setBackgroundRemoval = this.setBackgroundRemoval.bind(this)
    this.setAutoCropAndCenter = this.setAutoCropAndCenter.bind(this)
    this.setRename = this.setRename.bind(this)
    this.setBlemishReduction = this.setBlemishReduction.bind(this)
    this.setBarcodeDetection = this.setBarcodeDetection.bind(this)

  }

  componentDidMount(){
    this.setState({"hasBackgroundRemoval":this.props.fieldValues.hasBackgroundRemoval})
    this.setState({"hasAutoCropAndCenter":this.props.fieldValues.hasAutoCropAndCenter})
    this.setState({"hasRename":this.props.fieldValues.hasRename})
    this.setState({"hasBlemishReduction":this.props.fieldValues.hasBlemishReduction})
    this.setState({"hasBarcodeDetection":this.props.fieldValues.hasBarcodeDetection})
  }

  setTitle(e) {
    this.setState({"title":e.target.value})
  }

  setText2DNotes(e) {
    this.setState({"text2DNotes":e.target.value})
  }

  setRenameNotes(e) {
    this.setState({"renameNotes":e.target.value})
  }


  setBackgroundRemoval(selected){
    this.setState({"hasBackgroundRemoval":selected})
    this.props.fieldValues.hasBackgroundRemoval = selected
  }
  setAutoCropAndCenter(selected){
    this.setState({"hasAutoCropAndCenter":selected})
    this.props.fieldValues.hasAutoCropAndCenter = selected
  }
  setRename(selected){
    this.setState({"hasRename":selected})
    this.props.fieldValues.hasRename = selected
  }
  setBlemishReduction(selected){
    this.setState({"hasBlemishReduction":selected})
    this.props.fieldValues.hasBlemishReduction = selected
  }
  setBarcodeDetection(selected){
    this.setState({"hasBarcodeDetection":selected})
    this.props.fieldValues.hasBarcodeDetection = selected
  }
  renameNotes(){

  }



  render() {

    let { hasBackgroundRemoval, hasAutoCropAndCenter, hasRename, hasBlemishReduction,
      hasBarcodeDetection, title, text2DNotes, text3DNotes, text360Notes, text3DVRARNotes} = this.state

    return (
        <MDBContainer>
          <div className="animated">
            <MDBRow>
              <MDBCol sm="12">
                  Select the image editing services you would like to order for this batch.
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol sm="9">
                <MDBInput label="Batch Name" onChange={this.setTitle} value={title} />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol sm="12">
                <p className="batch-category">2D Photo Editing Services</p>
                <BatchButton text="Background Removal - $0.25/image" selected={hasBackgroundRemoval} setCustomServices={(selected)=>{this.setBackgroundRemoval(selected)}}></BatchButton>
                <BatchButton text="Auto Crop & Center - $0.10/image" selected={hasAutoCropAndCenter} setCustomServices={(selected)=>{this.setAutoCropAndCenter(selected)}}></BatchButton>
              </MDBCol>
              <MDBCol sm="12">
                <p className="batch-category">Other Editing Services</p>
                <BatchButton text="Rename - $0.05/image" selected={hasRename} setCustomServices={(selected)=>{this.setRename(selected)}}></BatchButton>
                <BatchButton text="Blemish Reduction - $0.15/image" selected={hasBlemishReduction} setCustomServices={(selected)=>{this.setBlemishReduction(selected)}}></BatchButton>
                <BatchButton text="Barcode Detection - $0.75/image" selected={hasBarcodeDetection} setCustomServices={(selected)=>{this.setBarcodeDetection(selected)}}></BatchButton>
              </MDBCol>
            </MDBRow>

            <MDBRow>
              <MDBCol sm="6">
                <MDBInput onChange={this.setText2DNotes} value={text2DNotes} icon="pen" label="2D Notes" type="textarea" rows="2" />
              </MDBCol>
              <MDBCol sm="6">
                <MDBInput onChange={this.setRenameNotes} value={text3DNotes} icon="pen" label="Rename Notes" type="textarea" rows="2" />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol sm="6"></MDBCol>
              <MDBCol sm="6">
                <MDBBtn onClick={this.props.cancelModal} color="blue-grey">Cancel</MDBBtn>
                <MDBBtn onClick={this.props.cancelModal}color="primary">Save</MDBBtn>
              </MDBCol>
            </MDBRow>
          </div>
        </MDBContainer>
    )
  }
}
