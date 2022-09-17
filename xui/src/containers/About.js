import React from 'react'
import { connect } from 'react-redux'
import AboutPage from '../components/AboutPageView'
import {login} from  '../actions/auth'

const About = (props) => {
  return (
    <AboutPage></AboutPage>
  )
}


export default About;
