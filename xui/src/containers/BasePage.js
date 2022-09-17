import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import BaseView from '../components/BasePageView'

import Navbar from './Navbar';
import Footer from './Footer'

import {login} from  '../actions/auth'

const Dashboard = (props) => {
  return (
    <div>
      <Navbar></Navbar>
      <BaseView></BaseView>
      <Footer></Footer>
    </div>
  )
}


export default Dashboard;
