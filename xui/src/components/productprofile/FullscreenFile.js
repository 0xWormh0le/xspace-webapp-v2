import React, { Component } from 'react';
import styled from 'styled-components'
import { format, render, cancel, register } from 'timeago.js';
import { Input, MDBProgress, MDBChip, MDBButton, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader, ModalFooter, Button, MDBCardFooter, MDBCardHeader } from 'mdbreact';
import { MDBCardText, MDBCardTitle, MDBCardImage, MDBModalFooter, MDBScrollbar, MDBModal, MDBIcon, MDBAvatar, MDBListGroup, MDBModalBody, MDBModalHeader, MDBFormInline, MDBBtn, MDBCard, MDBBtnGroup, MDBCardBody, MDBRow, MDBCol, MDBBadge } from 'mdbreact';
import './productprofile.css';
import downloadImg from '../../assets/img/download.png'

const Container = styled.div`
  .flex-div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 30px;
    border-bottom: 2px solid #F4F5FA;
    & > div {
      background-color: rgba(244, 245, 250, .4);
      border-radius: 20px;
      border: 2px solid #F4F5FA;
    }
    button {
      background-color: white;
      color: #333333;
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
      width: 96px;
      height: 30px;
      border-radius: 15px;
      border: 2px solid #F4F5FA;
      background-color: white;
      margin: 4px;
      :hover {
        background-color: #00A3FF;
        color: white;
        border: none;
      }
    }
    button.active {
      background-color: #00A3FF;
      color: white;
      border: none;
    }
  }
  .comment-view {
    .comments {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding: 35px;
      max-height: 550px;
      overflow-y: scroll;
      .chat-message {
        .message-info {
          text-align: right;
          span, small {
            font-size: 14px;
            line-height: 20px;
            font-weight: 400;
            color: #000000;
          }
          small {
            opacity: .5;
          }
        }
        .user-message {
          min-width: 150px;
          max-width: 250px;
          min-height: 60px;
          text-align: left;
          padding: 20px;
          background-color: #00A3FF;
          color: white;
          font-size: 14px;
          line-height: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          position: relative;
          ::after {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            background: #00A3FF;
            bottom: -5px;
            right: 25px;
            transform: rotate(45deg);
          }
        }
      }
    }
    .message-box {
      display: flex;
      padding: 50px;
      textarea {
        height: 40px;
        padding: 10px 20px;
        font-size: 14px;
        line-height: 20px;
        color: #333333;
        margin-right: 25px;
        border: 2px solid #F4F5FA;
        border-radius: 10px;
        ::placeholder {
          opacity: .5;
        }
      }
      button {
        width: 133px;
        height: 38px;
        background-color: #00A3FF;
        color: white;
        font-size: 14px;
        font-weight: bold;
        border-radius: 19px;
      }
    }
  }
  .image-view {
    .view-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 50px;
      a {
        img {
          width: 18px;
          margin-right: 15px;
        }
      }
      span {
        font-size: 12px;
        color: #333333;
        line-height: 20px;
      }
      i {
        font-size: 18px;
        color: #EB5757;
        :hover {
          cursor: pointer;
        }
      }
    }
    .image-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: calc(100% - 100px);
      margin: 50px;
      margin-top: 0;
      border: 2px solid #F4F5FA;
      border-radius: 10px;
      img {
        max-height: 530px;
      }
      i:hover {
        cursor: pointer;
      }
    }
  }
`

export default class FullscreenFile extends Component {

  constructor(props) {
    super(props);

    this.link = window.location.href;
    this.link = this.link.split("/");
    console.log(this.link);


    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        dropdownOpenCat: false,
        editing: true,
        modal: false,
        sending: false,
        commentThreadOpen: false,
        deletePermission: false,
        fullscreenFileOpen: true,
        assets: this.props.assets2d,
        asset: false,
        view: this.props.activeItem,
        productThread:false,
        messages: [],
        participants: [],
        dmessage:"",
        error: {
          message: '',
        }
    };
    this.submitMessage = this.submitMessage.bind(this);
    this.updateMessageValue = this.updateMessageValue.bind(this);
    this.checkValidity = this.checkValidity.bind(this);

    this.deleteDialog = this.deleteDialog.bind(this);
    this.removeImage = this.removeImage.bind(this);

    this.updateThread = this.updateThread.bind(this);
    this.determineAsset = this.determineAsset.bind(this);
    this.fullCycle = this.fullCycle.bind(this);

    this.nextItem = this.nextItem.bind(this);
    this.previousItem = this.previousItem.bind(this);
  }

  nextItem() {
    let view = this.state.view;
    if (this.props.assets2d.length > view){
      this.setState({"view":view+1}, function() { this.fullCycle(); console.log("setState completed, next", this.state.view) })
    } else if (this.props.assets2d.length >= view) {
      this.setState({"view":1}, function() { this.fullCycle(); console.log("setState completed, first", this.state.view) })
    }
  }

  previousItem() {
    let view = this.state.view;
    let check = this.props.assets2d.length;

    if (view > 1){
      this.setState({"view":view-1}, function() { this.fullCycle(); console.log("setState completed, prev", this.state.view) })

    } else if (view == 1){
      this.setState({"view":check}, function() { this.fullCycle(); console.log("setState completed, wrap to last", this.state.view) })
    }
  }

  removeImage() {
    const { deleteFilesRSAA } = this.props;
    let lk = this.state.asset.link;
    var slug = this.link[5];
    let cd = this.state.asset.lastModified
    deleteFilesRSAA(slug, lk, cd);
    this.props.cancel();
  }

  deleteDialog(event) {
    if (event.target.id === 'no') {
      this.setState({
        deletePermission: !this.state.deletePermission,
        dmessage: ''
      })
    } else {
      this.setState({
        deletePermission: !this.state.deletePermission,
        dmessage: 'Do you really want to delete files ?'
      })
    }
  }

  determineAsset() {
    let key = this.state.view-1;
    var ast = this.props.assets2d[key];

    this.setState({
      "asset":ast,
    });

  }

  updateThread() {
    console.log("OK")

    if (this.state.view > 0) {

      const { findMessageThread } = this.props;
      let key = this.state.view-1;
      var asset = this.props.assets2d[key];
      var slug = this.link[5];
      var itype = "2D";
      let split = asset.link;
      let parts = split.split("/");
      console.log(parts)
      let filename = null;
      if (parts[8] === undefined) {
        filename = parts[7];
      } else {
        filename = parts[8];
      }
      console.log(filename)

      findMessageThread(slug, itype, filename).then((res) => {

        console.log(res);

        let { id, product, messages, lastUpdateDateTime, creationDateTime, messageThreadName, messageThreadID, product2DImage, participants} = res.payload[0];
        
        
        if (participants.length > 0){ 
          for(let i = 0; i < participants.length; i++){

            let fll = participants[i].first_name +" "+ participants[i].last_name;
            let userid = participants[i].participant;
    
            for(let j = 0; j < messages.length; j++){
              let mx = messages[j]['sender'];
              if (mx === userid ){
                let mms = messages[j];
                mms['fullName'] = fll;
              }
            }
          }
        } 
        

        let productThread = {
          "id": id,
          "product": product,
          "product2DImage": product2DImage,
          "messageThreadID": messageThreadID,
          "messageThreadName": messageThreadName,
          "creationDateTime": creationDateTime,
          "lastUpdateDateTime": lastUpdateDateTime,
          "messages": messages,
          "participants": participants,
        }
        
        this.setState({
          "productThread":productThread,
          "messages":productThread.messages,
        });

      }).catch((err) => {
        console.error(err);
      });


    }
  }

  fullCycle() {
    this.determineAsset();
    this.updateThread();
  }

  componentDidMount() {
    console.log("mounted")
    this.fullCycle();
  }

  checkValidity() {
    let messagePass;
    let {message} = this.state;
    let pass = true
    if (message == '') {
      messagePass = 'Message cannot be empty'
      pass = false
    }

    if (pass == false) {
      this.setState(
        {'error':
          {
            'message':messagePass,
          }
        }
      )
    }

    return pass
  }

  updateMessageValue(evt) {
    this.setState({
      'message':evt.target.value
    });
  }

  toggleCommentThreadDialog = (flag) => {
    this.setState({ commentThreadOpen: flag })
  }

  submitMessage() {
    const { createMessage } = this.props;
    let productThread = this.state.productThread;
    console.log(productThread)
    let threadId = productThread.messageThreadID;

    let payload ={
      "productMessageThread": productThread.id,
      "message": this.state.message,
    }

    if(this.checkValidity()) {
        this.setState({ message: '', sending: true })
        
        createMessage(threadId, payload).then((res) => {
          console.log(res);
          this.updateThread();
          this.setState({"sending": false})
        }).catch((err) => {
          this.setState({"sending": false})
          console.error(err);
        });
    } else {
      console.log("INVALID")
    }

  }


  render() {
    const { commentThreadOpen, participants} = this.state
    const { format } = require('timeago.js');
    let {userInfo} = this.props


    const errors = this.props.errors || {};


    let {asset} = this.state;
    let {productThread} = this.state;

    let deletePermission = (
      <MDBModal isOpen={this.state.deletePermission} centered>
        <MDBModalHeader toggle={this.deleteDialog}><div className="row" style={{ marginLeft: '120px' }}>Action Permission</div></MDBModalHeader>
        <MDBModalBody>
          <div className="container">
            <div className="row">
              <b>Would you like to delete these Files?</b>
            </div>
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="green" id="deleteOption" onClick={this.removeImage}>Yes</Button>
          <Button color="red" id="no" onClick={this.deleteDialog}>No</Button>
        </MDBModalFooter>
      </MDBModal>
    )

    let imgView = (
      <div></div>
    )

    if (this.props.assets2d.length > 1) {
       imgView = (

        <div className='image-view'>
          <div className='view-header'>
            <div>
              <a href={asset.link} target="_blank"><img src={downloadImg} alt=''/></a>
              <span>{productThread.messageThreadName} ({asset.size})</span>
            </div>
            <i class="fa fa-trash-o" onClick={this.deleteDialog}/>
          </div>
          {deletePermission}
          <div className='image-container'>
            <MDBIcon icon="chevron-circle-left" onClick={this.previousItem}/>
            <img cascade className="media img-fluid" src={asset.link} alt=''/>
            <MDBIcon icon="chevron-circle-right" onClick={this.nextItem}/>
          </div>
        </div>
      )
    } else {
       imgView = (

        <img cascade className="media img-fluid" src={asset.link} />

      )
    }


    let commentView = (
      <div>
      </div>
    )
    let sendButton = (<button className="send-btn" onClick={this.submitMessage}>Send</button>)

    if (this.state.sending) {
      sendButton = (<MDBProgress material preloader />)
    }

    if (this.state.messages){
      
      commentView = (
        <div className={'comment-view'}>
          <div className='comments' id='comments-div'>
            {this.state.messages.map(message => (
              <div className="chat-message" key={message.timestamp}>
                {/* <img src={userInfo.profileURL} alt="Contact Person"/>  */}
                <div className='message-info'>
                  <span>{message.fullName}</span>
                  <small>{format(message.timestamp)}</small>
                </div>
                <div className='user-message'>{message.message}</div>
              </div>
            ))}
          </div>
          <div className="message-box">
            <textarea
              className="form-control pl-2 my-0"
              id="exampleFormControlTextarea2"
              rows="3"
              placeholder="Type your message here..."
              error={this.state.error.message}
              onChange={this.updateMessageValue}
              value={this.state.message}
            />
          {sendButton}
          </div>
        </div>
      )
    } else {
      commentView = (
        <div className={'comment-view'}>
          <div className="message-box">
            <textarea
              className="form-control pl-2 my-0"
              id="exampleFormControlTextarea2"
              rows="3"
              placeholder="Type your message here..."
              error={this.state.error.message}
              onChange={this.updateMessageValue}
              value={this.state.message}
            />
            <button className="send-btn" onClick={this.submitMessage}>Send</button>
          </div>
        </div>
      )
    };




    return (
      <Container>
        <div className={'flex-div'}>
          <div>
            <button onClick={() => this.toggleCommentThreadDialog(false)} className={!commentThreadOpen && 'active'}>Photo</button>
            <button onClick={() => this.toggleCommentThreadDialog(true)} className={commentThreadOpen && 'active'}>Comments</button>
          </div>
          <button onClick={this.props.cancel}>Close</button>
        </div>
        {imgView}
        {this.state.commentThreadOpen ? commentView : null}
      </Container>

    );
  }
}
