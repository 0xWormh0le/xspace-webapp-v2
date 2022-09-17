import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import  ContactusView  from '../components/ContactusView'
import {login} from  '../actions/auth'
import { Alert, Button, Jumbotron,  Form } from 'mdbreact'
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact';


const ContactUs = (props) => {
    if(props.isAuthenticated) {
        return (
            <Redirect to='/ContactUs' />
        )
    }
    return (
        <div>Contact Us</div>
)}

export default ContactUs;

