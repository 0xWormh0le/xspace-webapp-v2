import React, { Component } from 'react';
import styled from 'styled-components'
import uploadImg from '../../assets/img/upload.png'
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

export default class ProductExcelFileUploader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'overlayColor': 'rgba(255, 255, 255, 0.3)',
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
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.setState({'productUpload':this.props.upload})
    console.log("MOUNTED")
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
    if (target !== null) {
      this.props.handleFileSubmit(target)
      this.setState({selectedFile: target})
      this.setState({active: true})
      this.setState({selected: true})
    } else {
      this.setState({active: false})
      this.setState({selected: false})
    }
  }

  onClick(e) {
    console.log('fired onClick')
    if (this.state.active === false) {
      console.log('fired onClick returned True')
      return true
    } else {
      console.log('fired onClick returned False')
      e.preventDefault();
      return false}
  }


  render() {
    let state = this.state,
    labelClass  = `uploader`,
    borderColor = state.active ? state.activeColor : state.baseColor,
    boxText = state.selected ?  state.selectedFile.name : 'Drag and drop your file here'
    console.log('inside the upload box');
    return (
      <Wrapper>
        <div class="animated">
          <div className="row">
          <div className="col-md">
            <h5>Import your product data with ease by using our product import excel template.</h5>
            <a href="https://s3.amazonaws.com/storage.xspaceapp.com/media/xspace_product_import_template.xlsx"
               download target="_blank"
               role="button"
               onClick={this.onClick}
            >Download Excel Template</a>
          </div>
          <div className="col-md">
            <h5>Simply drop your excel sheet template file with your product data into the area below.</h5>
            <div
              className={labelClass}
              onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave}
              onDragOver={this.onDragOver}
              onDrop={this.onDrop}
              style={{outlineColor: borderColor, height: "149px"}}>
              {/*<img src={state.imageSrc} className={`uploadImg ${state.loaded && 'loaded'}`} alt=''/>*/}
              {/*<img className='upload-img' src={uploadImg} alt=''/>*/}
              <span> {boxText} </span>
              <input type="file"
                     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                     onChange={this.onDrop}/>
            </div>
          </div>
          </div>
          <br />
        </div>
      </Wrapper>
    );
  }
}