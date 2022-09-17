import React from 'react'
import Navbar from './Navbar'
import OrderCreateView from '../components/OrderCreateView'

const OrderCreate = (props) => {
  return (
  <div>
    <Navbar {...props}></Navbar>
    <OrderCreateView {...props}/>
    </div>
  )
}

export default OrderCreate;
