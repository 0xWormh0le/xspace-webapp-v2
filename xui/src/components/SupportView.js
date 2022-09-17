import React, {Component, Fragment } from 'react'
import styled from 'styled-components'
import { ToastContainer, toast, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact'
import LeftSideMenu from './menu/LeftSideMenu'
import { MDBBtn, MDBIcon } from "mdbreact";
import UpgradeView from './UpgradeView';
import CompanyEdit from './CompanyEdit';
import { API_ROOT } from '../index';
import { MDBDataTable  } from "mdbreact";
import { FlexView, LeftPanel, RightPanel } from './ecommerceapi/ApiKeyView'
import { StyledTable } from '../lib/styled-table'
import { SupportOptions } from '../constants'
import { css } from 'styled-components'
import './productprofile/productprofile.css';
import { format, render, cancel, register } from 'timeago.js';
import { Select } from '../lib/select'
import TextInput from '../lib/TextInput'


const RightPanelWrapper = styled(RightPanel)`
  &&& {
    padding: 50px;
    .company-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 25px;
      div:last-child {
        text-align: center;
      }
      img {
        width: 165px;
        display: block;
      }
      button {
        display: inline-block;
      }
      .profile-edit {
        position: relative;
        i {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 18px;
          :hover {
            cursor: pointer;
          }
        }
      }
    }
    .flex-div {
      display: flex;
      padding-bottom: 15px;
      > div {
        flex: 1;
      }
    }
    p {
      margin: 0;
      color: #333330;
      opacity: .5;
      font-size: 14px;
      line-height: 20px;
    }
    b {
      font-size: 14px;
      line-height: 20px;
      color: #333333;
    }
    h5 {
      font-size: 18px;
      margin-bottom: 10px;
      color: #333330;
      line-height: 26px;
      font-weight: 400;
    }
    button {
      width: 120px;
      height: 38px;
      border-radius: 19px;
      font-size: 14px;
      color: #333330;
      line-height: 20px;
      border: 2px solid #F4F5FA;
      background-color: transparent;
      border-radius: 19px;
      font-weight: bold;
      :hover {
        background-color: ${p => p.color};
        color: white;
        border: none;
      }
    }
  }
`

const Card = styled.div`
  border-radius: 6px;
  margin-right: 7px;
  padding: 2px;
  border: ${p => p.active ? `2px solid ${p.color}` : '2px solid white'};
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  :hover {
    border: ${p => `2px solid ${p.color}`};
    .card-header {
      background-color: white;
      border-bottom: ${p => `2px solid ${p.color}`};
      color: ${p => p.color};
    }
  }
  div.card-header {
    height: 70px;
    background-color: ${p => p.color};
    border-bottom: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    i {
      position: absolute;
      right: 8px;
      top: 8px;
      font-size: 14px;
      color: white;
    }
    span {
      font-size: 14px;
      line-height: 20px;
    }
    ${p => p.active && css`
      background-color: white;
      border-bottom: ${p => `2px solid ${p.color}`};
    `}
  }
  div.card-body {
    padding: 15px;
    text-align: center;
    position: relative;
    b, p {
      font-size: 14px;
      color: #333330;
      line-height: 20px;
      display: block;
    }
    b {
      padding-bottom: 25px;
    }
    p {
      opacity: .5;
      margin: 0;
    }
    span {
      font-size: 12px;
      color: #00A3FF;
      line-height: 20px;
      bottom: 60px;
      position: absolute;
      width: 100%;
      text-align: center;
      display: block;
      padding-right: 30px;
    }
    button {
      width: 120px;
      height: 38px;
      border-radius: 19px;
      font-size: 14px;
      color: #333330;
      line-height: 20px;
      border: 2px solid #F4F5FA;
      background-color: transparent;
      margin-top: 45px;
      border-radius: 19px;
      font-weight: bold;
      :hover {
        background-color: ${p => p.color};
        color: white;
        border: none;
      }
    }
  }
`

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


export default class SupportView extends Component {

  constructor(props, context) {
    super(props, context);
    this.fieldValues = {
      'newType': '',
      'newComment': '',
      'newSubject': '',
    }
    this.state = {
      'userProfile': [],
      'tickets': [],
      'ticketRows':[],
      'comments':[],
      'ticketViewModal':false,
      'modalinvitation': false,
      'modalWhitelabel':false,
      'message':'',
      'atSubLimit': false,
      'modal': false,
      createTicketViewModal:false,
      'newSubject': '',
      'newType': '',
      'newComment': '',
      'value':'',
      'errors': {
        'newSubject': false,
        'newType': false,
        'newComment': false,
      }
    };

    this.notify = this.notify.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this)
    this.viewTicketHelper = this.viewTicketHelper.bind(this)
    this.assembleTickets = this.assembleTickets.bind(this)
    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleTicketSubjectChange = this.handleTicketSubjectChange.bind(this);
    this.handleTicketDescChange = this.handleTicketDescChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleCreateDialog = this.toggleCreateDialog.bind(this);
  }

  toggle(event) {
    try{
      //console.log(event.currentTarget);
      this.setState({
        modal: !this.state.modal
      });
    }catch(err){
      this.setState({
        modal: !this.state.modal
      });
    }
  }

  componentWillReceiveProps(nextProps){

      this.setState({'userProfile':nextProps.userInfo || '' })
      let checkAgainstPrevious = JSON.stringify(nextProps.company) !== JSON.stringify(this.props.company)
      console.log(checkAgainstPrevious)

      if(checkAgainstPrevious){
        //Perform some operation

        var username = this.props.userInfo.userName

        this.setState({ "users": nextProps.company["users"] }, () => {
                this.setState({'usersRows':this.assembleUsers()});
            });
        this.setState({ "companyName": nextProps.company["companyName"]});
        this.setState({ "companyEmail": nextProps.company["companyEmail"]});
        this.setState({ "industry": nextProps.company["industry"]});
        this.setState({ "companyWebsite": nextProps.company["companyWebsiteURL"]});
        this.setState({ "companyPhoneNumber": nextProps.company["companyPhoneNumber"]});

        if(nextProps.company["mainAddress"] == null){
            this.setState({ "address1": 'No Address 1' });
            this.setState({ "address2": 'No Address 2'});
            this.setState({ "poBoxNum": 'No PO Box Num'});
            this.setState({ "city": 'No City'});
            this.setState({ "state": 'No State'});
            this.setState({ "zipcode": 'No Zip Code '});
            this.setState({ "country": 'No Country'});
        }
        else{
            this.setState({ "address1": nextProps.company["mainAddress"]["address1"]});
            this.setState({ "address2": nextProps.company["mainAddress"]["address2"]});
            this.setState({ "poBoxNum": nextProps.company["mainAddress"]["poBoxNum"]});
            this.setState({ "city": nextProps.company["mainAddress"]["city"]});
            this.setState({ "state": nextProps.company["mainAddress"]["state"]});
            this.setState({ "zipcode": nextProps.company["mainAddress"]["zipcode"]});
            this.setState({ "country": nextProps.company["mainAddress"]["country"]});
        }

        this.setState({ "company": nextProps.company }, () => {
                console.log(this.state.company)
            });

      }
  }

  toggleDialog() {
    this.setState({
      ticketViewModal: !this.state.ticketViewModal
    });
  }

  toggleCreateDialog() {
    this.setState({
      createTicketViewModal: !this.state.createTicketViewModal
    });
  }


  notify(type){
        switch (type) {
          case 'info':
            toast.info('Info message', {
              autoClose: 3000
            });
            break;
          case 'success':

            let msg = (<Fragment><i className="fa fa-envelope-open" style={{paddingRight:'10px', paddingLeft:'10px'}}/><p className="d-inline-block">   Your invitation was successfully sent.</p></Fragment>);
            toast.success(msg, {
              position: "top-right",
              autoClose: 7000,
              className: "notification-box",
              progressClassName: "notification-prog",
              closeButton: true,

            });
            break;
          case 'success2':
            let msg2 = (<Fragment><i className="fa fa-envelope-open" style={{paddingRight:'10px', paddingLeft:'10px'}}/><p className="d-inline-block">   Your company was successfully updated.</p></Fragment>);
            toast.success(msg2, {
              position: "top-right",
              autoClose: 7000,
              className: "notification-box",
              progressClassName: "notification-prog",
              closeButton: true,

            });
            break;
          case 'success3':
            let msg3 = (<Fragment><i className="fa fa-envelope-open" style={{paddingRight:'10px', paddingLeft:'10px'}}/><p className="d-inline-block">  Your ticket was successfully sent. Check your email for further updates.</p></Fragment>);
            toast.success(msg3, {
              position: "top-right",
              autoClose: 7000,
              className: "notification-box",
              progressClassName: "notification-prog",
              closeButton: true,

            });
            break;
          case 'warning':
            toast.warn('Warning message');
            break;
          case 'error':
            toast.error('Error message');
            break;
        }
    };

  getCompanyLogo(){
    if(this.state.companyLogo == ''){
        return 'icons8-customer-128.png'
    }
    else{
       return this.state.companyLogo
    }
  }

  getTickets() {

    var username = this.props.userInfo.userName

    this.setState({ tickets: this.props.tickets["tickets"] }, () => {
            this.setState({'ticketRows':this.assembleTickets()});
    });

  }


  viewTicketHelper = (ticket) => {

    this.setState({ comments: ticket.comments }, () => {
         this.toggleDialog();
    });

  }

  assembleTickets = () => {
    let inv;
    if(this.state.tickets){
        inv =this.state.tickets.map((ticket, index) => {
          return (
            {
              id: ticket.id,
              created: ticket.created_date,
              subject: ticket.subject,
              status: ticket.status,
              type: ticket.type,
              view_detail: <button className="" onClick={() => this.viewTicketHelper(ticket)}>View Ticket</button>,
            }
          )
        });

    }
    else{
        inv = (
            {
              id: '-',
              created: '-',
              subject: '-',
              status: '-',
              type: '-',
              view_detail: '-',
            }
          );
    }
    return inv;
  }

  componentWillMount() {
    document.title = 'XSPACE | Support'
  }

  componentDidMount(){
    this.props.getUserInfo();
    this.props.getOrganizationTicket().then((res) => {
      this.getTickets();
    }).catch((err) => {
      console.log(err)
    });
    }

  validate = () => {
    const { newSubject, newType, newComment } = this.state;

    this.setState({
      errors: {
        newSubject: newSubject === '' ? 'Subject field cannot be empty.' : '',
        newType: newType === '' ? 'Ticket type field cannot be empty.' : '',
        newComment: newComment === '' ? 'Comment field cannot be empty.' : ''
      }
    })
    return newSubject !== '' && newComment !== '' && newType !== ''
  }

  onChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleClick = (e) => {
    e.preventDefault();

    if(e.currentTarget.getAttribute('name') === "logout"){
      localStorage.clear();
      window.location.reload();
    }
  }

  handleTicketSubjectChange(evt){
    this.setState({
      'newSubject':evt.target.value
    });
    this.fieldValues.newSubject = evt.target.value
    //console.log(this.props.fieldValues.newAddressData.address1)
  }

  handleTicketDescChange(evt){
    this.setState({
      'newComment':evt.target.value
    });
    this.fieldValues.newComment = evt.target.value
    //console.log(this.props.fieldValues.newAddressData.address1)
  }

  handleSubmit(evt){
    this.props.createTicket(this.fieldValues.newSubject, this.fieldValues.newType, this.fieldValues.newComment).then((res) => {
      this.notify('success3');
      this.toggleCreateDialog();
    }).catch((err) => {
      console.log(err)
    });
  }

  render() {
    let {userProfile} = this.state;
    let {userInfo} = this.props
    const errors = this.props.errors || {}

    const onChange = this.props;
    const {
        newSubject,
        newComment,
        newType
    } = this.fieldValues;




    const data = {
    columns: [
      {
        label: 'ID #',
        field: 'id',
        sort: 'asc',
      },
      {
        label: 'Created',
        field: 'created',
        sort: 'asc',
      },
      {
        label: 'Subject',
        field: 'subject',
        sort: 'asc',
      },
      {
        label: 'Status',
        field: 'status',
        sort: 'asc',
      },
      {
        label: 'Type',
        field: 'type',
        sort: 'asc',
      },
      {
        label: 'View Details',
        field: 'view_detail',
        sort: 'asc',
      },
    ],
    rows: this.state.ticketRows
  };

    let pop = (<Fragment>
        <ToastContainer
          hideProgressBar={false}
          newestOnTop={true}
          autoClose={7000}
          bodyClassName="notification-body"
          className="animated fadeIn"
        />
      </Fragment>)

    let ticketView = (
      <Container>
      <Modal className="" contentClassName="card card-image" isOpen={this.state.ticketViewModal} toggle={this.toggleDialog} size="lg 12" centered>
        <ModalHeader toggle={this.toggleDialog}>View Ticket</ModalHeader>
        <ModalBody >
          <div className={'comment-view'}>
            <div className='comments' id='comments-div'>
              {this.state.comments.map(message => (
                <div className="chat-message">
                  {/* <img src={userInfo.profileURL} alt="Contact Person"/>  */}
                  <div className='message-info'>
                    <span>{message.author}</span>
                    <br/>
                    <small>{format(message.created_date)}</small>
                  </div>
                  <div className='user-message'>{message.body}</div>
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
      </Modal>
      </Container>
    );

    let createTicketView = (
      <Container>
      <Modal className="" contentClassName="card card-image" isOpen={this.state.createTicketViewModal} toggle={this.toggleCreateDialog} size="md" centered>
        <ModalHeader toggle={this.toggleCreateDialog}>Create New Ticket</ModalHeader>
        <ModalBody >
            <TextInput type="text" id="subject" name="subject" label='Ticket Subject' placeholder="Subject" onChange={this.handleTicketSubjectChange} />
            <label>Ticket Type</label>
            <Select onChange={this.onChange} value={this.state.value}>
                <option value="problem" name={'Problem'}>Problem</option>
                <option value="incident" name={'Incident'}>Incident</option>
                <option value="question" name={'Question'}>Question</option>
            </Select>
            <TextInput type="textarea" id="desc" name="desc" label='Message' placeholder="Ticket Message" onChange={this.handleTicketDescChange} />
            <Button color="warning" name="close" onClick={this.toggleCreateDialog}>Close</Button>
            <Button color="success" name="submit" onClick={this.handleSubmit}>Submit Ticket</Button>
        </ModalBody>
      </Modal>
      </Container>
    );

    return (
      <div className="container">
        {pop}
        {ticketView}
        {createTicketView}
        <FlexView>
          <LeftPanel>
            <LeftSideMenu key={6} data={this.props}/>
          </LeftPanel>
          <RightPanelWrapper>
            <div className='company-header'>
              <div>
                <h1>Support & Tickets</h1>
                <p>Need help with something? Contact us by telephone, create an open ticket for a specific file, or order.</p>
              </div>
              <div className='profile-edit'>
                <img src="https://i2.wp.com/xspaceapp.com/wp-content/uploads/2019/04/email-1346077-1009x1024.png?fit=296%2C300&ssl=1" alt=''/>
              </div>
            </div>
            <h5>How can we help?</h5>
            <div className='flex-div'>
                  {SupportOptions.map((item) =>
                    <Card color={item.color} key={item.id}>
                      <div className='card-header'>
                        <span><MDBIcon icon={item.icon} size="3x" /></span>
                        <span>{item.title}</span>
                        {item.id === 4 && <i className="fa fa-star" />}
                      </div>
                      <div className='card-body'>
                        <p>{item.desc}</p>
                        {item.id === 1 && <span>Best Support Value!</span>}
                        {item.id === 1 && <button onClick={this.toggleCreateDialog}>{item.buttontext}</button>}
                        {item.id === 2 && <a href={item.url}><button>{item.buttontext}</button></a>}
                        {item.id === 0 && <a href={item.url}><button>{item.buttontext}</button></a>}
                      </div>
                    </Card>
                  )}
            </div>
            <hr/>
            <h4 style={{paddingBottom: 25, paddingTop: 45}}>All Support Tickets</h4>
            <StyledTable>
              <MDBDataTable
                responsive
                hover
                data={data}
              />
            </StyledTable>
            <Modal backdrop="false" isOpen={this.state.modal} toggle={this.toggle} style={{top:'25%'}} centered>
              <ModalHeader toggle={this.toggle}>Change Company Logo</ModalHeader>
              <ModalBody>
                <div>{this.state.message}</div>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" name="close" onClick={this.toggle}>Close</Button>{' '}
              </ModalFooter>
            </Modal>
          </RightPanelWrapper>
        </FlexView>
      </div>
  )
  }
}
