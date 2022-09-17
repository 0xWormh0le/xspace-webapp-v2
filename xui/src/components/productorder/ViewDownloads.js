import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import  Loader from 'react-loader';
import { API_ROOT } from '../../index';
import axios from 'axios';
import { Alert, Button, Jumbotron, Form, Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Container, MDBDataTable ,Modal, ModalHeader, ModalBody, ModalFooter} from 'mdbreact'
import { StyledTable } from '../../lib/styled-table'


class ViewDownloads extends Component {
  constructor(props) {
      super(props);
      this.state = {
        'modal': this.props.modal,
        'dropdownOpen': false,
        'downloadLinkList':[],
        'downloadRows':[],
      }
      this.closeToggle = this.closeToggle.bind(this);
      this.assembleDownloads = this.assembleDownloads.bind(this);
    }

    componentDidMount() {
        console.log(this.props)
        this.props.getDownloads(this.props.orderId)
        .then((res) => {
            var files = res.payload.files;
            this.setState({"downloadLinkList": files})
            this.setState({"downloadRows": this.assembleDownloads()})

         }).catch((err) => {
          console.log(err)
        })

    }

    componentWillReceiveProps(nextProps, nextState) {

    }

    closeToggle() {
      this.props.closeToggle()
    }

    assembleDownloads = () => {
        let inv =this.state.downloadLinkList.map((download, index) => {
          return (
            {
              file: download.file_name,
              link:(<a className="green-text" href={download.link}><u>Download</u></a>)
            }
          )
        });
        return inv;
  }



  render() {
    let { downloadRows } = this.state
    let { modal, productList, orderId, isProductLoaded} = this.props

    let data = {
        columns: [
          {
            label: 'Collection',
            field: 'file',
            sort: 'asc'
          },
          {
            label: 'Download Link',
            field: 'link',
            sort: 'asc'
          },
        ],
        rows: this.state.downloadRows
      }

      return (
        <React.Fragment>
          <Container>
               <div className="row">
                    <div className="col-md-12">
                        <p>Download your order's files in bulk by downloading the collection. This is useful when you want to download lots of items at once.</p>
                        <br/>
                        <StyledTable>
                            <MDBDataTable btn searchLabel="Search by name, date" width="100%" data={data}></MDBDataTable>
                        </StyledTable>
                    </div>
               </div>
          </Container>
        </React.Fragment>
    )
  }
}

export default ViewDownloads;
