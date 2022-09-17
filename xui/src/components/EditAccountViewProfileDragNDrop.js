import React, { Component } from 'react';
import styled from 'styled-components'
const Wrapper = styled.div`
  padding: 4px 30px 30px;
  h3, h5 {
    font-size: 18px;
    line-height: 26px;
    color: #333330;
    font-weight: 400;
  }
  h5 {
    font-size: 18px;
    line-height: 20px;
    opacity: .5;
    max-width: 65%;
    margin-bottom: 35px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
  a {
    margin-top: 85px;
    margin-bottom: 29px;
    // background-color: #00A3FF;
    background-color: #3eb2ff;
    width: 255px;
    height: 45px;
    border-radius: 30px;
    color: white;
    font-size: 18px;
    font-weight: normal;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    margin-left: auto;
    margin-right: auto;
    :hover {
      box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
    }
  }
  .upload-img {
    margin-right: 10px;
    width: 32px;
    height: 32px;
  }
  input {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    display: block;
    :hover {
      cursor: pointer;
    }
  }
  span {
    font-size: 14px;
    color: #333330;
    opacity: .5;
    line-height: 20px;
  }
`

export default class ProfilePictureUploader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overlayColor: 'rgba(255, 255, 255, 0.3)',
      active: false,
      activeColor: '#00A3FF',
      baseColor: 'FF9B9B9B',
      selectedFile: null,
      selected: false,
    }

    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onDragEnter(e) {
    e.preventDefault();
    this.setState({ active: true });
  }

  onDragLeave(e) {
    e.preventDefault();
    this.setState({ active: false });
  }

  onDragOver(e) {
    e.preventDefault();
    this.setState({ active: true });
  }

  onDrop(e) {
    e.preventDefault();
    let target = e.dataTransfer.files[0]
    console.log('fired onDrop')
    console.log("OVCLD registered this as the target:", target)
    if (target) {
      // this.props.handleFileSubmit(target)
      this.setState({selectedFile: target})
      this.setState({active: true})
      this.setState({selected: true})
      this.props.handleFileSubmit(target)
      console.log("OVCLD sent this up and then saved this locally:", target)
    } else {
      this.setState({active: false})
      this.setState({selected: false})
    }
  }

  render() {
    let state = this.state,
    labelClass  = `uploader`,
    borderColor = state.active ? state.activeColor : state.baseColor,
    boxText = state['selected'] ?  state['selectedFile']['name'] : 'Drag and drop your profile picture here'
    console.log('inside the upload box');
    return (
        <Wrapper>
            <div
                className={labelClass}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
                style={{outlineColor: borderColor, height: "149px", borderRadius: 30}}>
                {/*<img src={state.imageSrc} className={`uploadImg ${state.loaded && 'loaded'}`} alt=''/>*/}
                {/*<img className='upload-img' src={uploadImg} alt=''/>*/}
                <span> {boxText} </span>
                <input type="file"
                       accept="image/png, image/jpeg"
                       onChange={this.onDrop}/>
            </div>
        </Wrapper>
    );
  }
}