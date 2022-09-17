import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';

import { API_ROOT } from '../../index';

export default class Files extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      productupload: {}
    };
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.userData = JSON.parse(localStorage.getItem('persist:root'));
    var data = JSON.parse(this.userData['auth']);
    this.user_id = data['access']['user_id'];

  }



  async componentDidMount() {

  }

 /*  handleFileUpload(event) {
   event.preventDefault()

   var uploadName = event.currentTarget.getAttribute('name');
   var fileToRead='';
   var files='';
   var len='';

   if(uploadName=='2D')
   {
    fileToRead = document.getElementById("file1");
    files = fileToRead.files;
    len = files.length;
   }
   else if(uploadName=='3D')
   {
    fileToRead = document.getElementById("file2");
    files = fileToRead.files;
    len = files.length;
   }
   else
   {
    fileToRead = document.getElementById("file3");
    files = fileToRead.files;
    len = files.length;
   }

   if (len) {

       var link = window.location.href;
       link = link.split("/");

       var data = new FormData();
       data.append('upload_file', files[0]);
       if(uploadName=='2D')
       {
          data.append('location', link[5]+'/'+link[6]+'/2D');
       } else if(uploadName=='3D')
       {
          data.append('location', link[5]+'/'+link[6]+'/3D');
       } else
       {
          data.append('location', link[5]+'/'+link[6]+'/360');
       }


       fetch(API_ROOT + '/api/upload/'+this.user_id+'/', {
        method: 'post',
        body: data
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        this.componentDidMount();
        document.getElementById("file1").value="";
        document.getElementById("file2").value="";
        document.getElementById("file3").value="";
    });
   }

  } */

  render() {
   const errors = this.props.errors || {}


    return (
      <div class="animated fadeIn">
        <br />
        <div class="row">
          <div class="col-sm-3">
            <h3>Upload a 2D Image</h3>
            <p>Image Upload Area. Upload JPG/PNG</p>

              <div class="box__input">
                <input class="box__file" type="file" name="files[]" id="file1" data-multiple-caption="{count} files selected" multiple />
                <label for="file"><strong>Choose a file</strong><span class="box__dragndrop"> or drag it here</span>.</label>
                <button class="box__button" onClick={this.handleFileUpload} name="2D" type="submit">Upload</button>
              </div>

            <br />
            <br />
            <h3>Upload a 3D Image</h3>
            <p>Image Upload Area. Upload JPG/PNG</p>

              <div class="box__input">
                <input class="box__file" type="file" name="files[]" id="file2" data-multiple-caption="{count} files selected" multiple />
                <label for="file"><strong>Choose a file</strong><span class="box__dragndrop"> or drag it here</span>.</label>
                <button class="box__button" onClick={this.handleFileUpload} name="3D" type="submit">Upload</button>
              </div>



          </div>
          <br />
          <div class="col-sm-9">
            <h2>Content Management</h2>
            <div class="carousel-container" >


            </div>
            <br />
            <br />
          </div>
        </div>
      </div>
    );
  }
}
