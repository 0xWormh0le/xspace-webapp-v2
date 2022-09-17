import React, {Component} from 'react'
import { Alert, Button, Jumbotron,  Form } from 'mdbreact'

import TextInput from '../lib/TextInput'
import ReactHtmlParser from 'react-html-parser';

export default class UploaderView extends Component {
  state = {
    uploading: false,
    modalmessage: ''
  }

  constructor(props) {
    super(props)
    this.handleFileUpload = this.handleFileUpload.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props)
    let { counter, total, progress } = this.props
    if (progress > 0 && progress < 0.999) {
      var elem = document.getElementById("uploadProgressBar");
      var width = (progress) * 100
      elem.style.width = width + '%';
    }
    if (progress > 0.999) {
      console.log("FINISH")
    }
  }

  handleFileUpload(event) {
    event.preventDefault()

    var userData = JSON.parse(localStorage.getItem('persist:root'));
    var data = JSON.parse(userData['auth']);
    var user_id = this.props.userId;
    var fileToRead = '';
    var files = '';
    var len = '';

    fileToRead = document.getElementById("myFileUploader");
    files = fileToRead.files;
    len = files.length;
    if (len != 0) {
      this.setState({
        uploading: true,
        modelmessage: '<h5 id="uploadstatus" style="margin-right:180px;">Uploading files ...</h5>'
      });

      var promisifiedHandle = []
      this.props.setCounter(len)
      for (var i = 0; i < len; i++){
        let file = files[i]
        this.props.createAssets(file)
        // promisifiedHandle.push(this.props.createAssets(file))
      }

      // Promise.all(promisifiedHandle).then((res) => {
      //   console.log(res)
      //   this.setState({"uploading": false})
      // }).catch((err) => {
      //   this.setState({"uploading": false})
      // });


      // .then((res)=> {
    //     this.setState({"uploading":false})
    //   }).catch((err)=> {
    //     this.setState({"uploading":false},()=> {
    //       alert("An unknown error as occured uploading file.")
    //     })
    //   });
    //
    // } else {
    //   this.setState({
    //     modelmessage: '<h5 id="uploadstatus" style="color:red;margin-right:150px;">Please select files to upload.</h5>'
    //   });
    }

  }

  render() {
    const errors = this.props.errors || {}
    let progressBar = (<div></div>)
    let uploadButton = (<div><p>Please wait, file is uploading...</p></div>)
    // if (!this.state.uploading) {
    //   uploadButton = (
    //     <div>
    //       <input type="file" name="files[]" id="myFileUploader" accept="image/png, image/jpeg" multiple length="1024" />
    //       <button className="btn coolgreen" onClick={this.handleFileUpload}>Upload</button>{' '}
    //     </div>
    //   )
    // }
    progressBar = (
      <div id="uploadProgress">
        <div id="uploadProgressBar"></div>
      </div>
    )

    let totalView = (
      <div className="fixed-footer" >
      </div>
    )

    if (this.props.progress > 0 && this.props.progress < .999) {
      totalView = (
        <div className="fixed-footer" >
          <div className="row">
            <div className="col-md-12">
              {ReactHtmlParser(this.state.modalmessage)}
              {progressBar}
              {uploadButton}
            </div>
          </div>
          <br />
        </div>
      )
    }

    return totalView

  }
}
