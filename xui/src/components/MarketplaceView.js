import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Button, Jumbotron,  Form } from 'mdbreact'
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact';
import TextInput from '../lib/TextInput'
import store from '../store';

export default class Marketplace extends Component {
    state = {
        store_url: '',
        shopify_apikey: '',
        shopify_password: '',
        store_id: '',
        cart_id: 'Shopify'
    }

    componentWillMount() {
      document.title = 'XSPACE | Marketplace'
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
        let formData = new FormData()
        const cartData = {cart_id: this.state.cart_id, store_id: this.state.store_id, shopify_apikey: this.state.shopify_apikey, shopify_password:this.state.shopify_password, store_url: this.state.store_url}
        this.props.onSubmit(this.state.cart_id, this.state.store_id, this.state.shopify_apikey, this.state.shopify_password, this.state.store_url)
    }

    render() {
        const errors = this.props.errors || {}
        return (
            <div>Marketplace view</div>
    )
  }
}
