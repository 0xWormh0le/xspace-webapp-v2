import React, {Component} from 'react'
import { Alert, Button, Jumbotron,  Form } from 'mdbreact'

import TextInput from './TextInput'

export default class ContactUs extends Component {
  state = {
    username: '',
    password: ''
  }
  handleInputChange = (event) => {
    const target = event.target,
          value = target.type ===
            'checkbox' ? target.checked : target.value,
          name = target.name
    this.setState({
      [name]: value
    });
  }
  onSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmit(this.state.username, this.state.password)
  }
  render() {
    const errors = this.props.errors || {}
    return (
      <div className="container text-center" >
        <div className="row">
            <div className="col-md-12">
                  <center><img src="/media/img/logo.png" width="50%" alt="prismalogo" /></center>
            </div>
        </div>
        <div className="row">
              <div className="col-md-6">
              <h1>Helloooooo</h1>
             </div>
             <div className="col-md-6">
               <p className="lead">Register now for <span className="text-success">FREEgfghfggf</span></p>
                      <ul className="list-unstyled" >
                          <li><span className="fa fa-check text-success"/> Manage Product Visuals <span>(3D &amp; 2D)</span></li>
                          <li><span className="fa fa-check text-success"/> Communicate With Product Partners </li>
                          <li><span className="fa fa-check text-success"/> Integrate easily into Shopify, Magento, WooCommerce or your own web app.</li>
                          <li><span className="fa fa-check text-success"/> Developer Friendly API</li>
                          <li><span className="fa fa-check text-success"/>Automatically Update Product Information</li>
                      </ul>
                      <p><a href="/#/register" className="btn btn-info btn-block">Sign Me Up!</a></p>

             </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-6">
          </div>
        </div>
     </div>
    )
  }
}
