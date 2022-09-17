import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'mdbreact/dist/css/mdb.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
//import './index.css';

import App from './App.jsx';

let backendHost;
const apiVersion = 'v1';

const hostname = window && window.location && window.location.hostname;
const protocol = window && window.location && window.location.protocol;

if (protocol === "https:" && hostname === 'app.xspaceapp.com') {
  backendHost = 'https://dev-api.xspaceapp.com'
} else if(hostname === 'dev-api.xspaceapp.com') {
  backendHost = 'http://52.41.200.41:8080'
} else if(hostname === '52.41.200.41') {
  backendHost = 'http://52.41.200.41:8080'
} else if(hostname === '54.191.102.47') {
  backendHost = 'http://54.191.102.47:8080'
} else {
  backendHost = 'http://127.0.0.1:8000'
}



export const API_ROOT = `${backendHost}`;
console.log(protocol, API_ROOT)


//mimic wait until page load
//setTimeout(function(){
  ReactDOM.render((
    <App></App>
  ), document.getElementById('root'));
//},1000)




