import React from 'react';
import { Button, Card, CardBody, CardImage, CardTitle, CardText } from 'mdbreact';

import TextInput from '../lib/TextInput'

import { API_ROOT } from '../index';

export default class ProductPreviewView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products : ''
    }

    this.userData = JSON.parse(localStorage.getItem('persist:root'));
    var data = JSON.parse(this.userData['auth']);
    this.user_id = data['access']['user_id'];

    this.get_products();
    //this.user_id = 1;
  }

  componentWillMount() {
    document.title = 'XSPACE | Loading...'
  }

  get_products(){
    fetch(API_ROOT + '/api/products_list/'+'1'+'/'+'1'+'/'+'1'+'/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        // this.state.products = response;
        console.log(response)
        this.setState({'products': response})
    });
  }

  render() {
    let product = this.state.products[0];

    let btn2D = (<span className="btn2d " data-toggle="tooltip" data-placement="top" title="2D Assets Available">
        <b>2D</b>
    </span>);

    let btn3D = (<span className="btnoff" data-toggle="tooltip" data-placement="top" title="3D Assets Available">
        <b>3D</b>
    </span>);

    let btnVR = (<span className="btnoff" data-toggle="tooltip" data-placement="top" title="VR Assets Available">
        <b>VR</b>
    </span>);

    let btnAR = (<span className="btnoff" data-toggle="tooltip" data-placement="top" title="AR Assets Available">
        <b>AR</b>
    </span>);

    let target = "/product/" + product.productid + "/view"
    let link = (
      <h4 className="card-title"><strong><a href={ target }>{ product.name }</a></strong></h4>
    )


    // <Card key="{product.name}">
    //   <CardTitle>{product.name}</CardTitle>
    //   <CardImage></CardImage>
    //   <CardText>HELLO</CardText>
    // </Card>
    return (

      <div className="card wider card-height-crop">
          <br />
          <div className="view overlay hm-white-slight">
              <center><img src="/media/img/XSPACE-logo-watermark.png" className="img-fluid" alt="" style={{height:80}} /></center>
              <a>
                  <div className="mask"></div>
              </a>
          </div>
          <div className="card-body text-center no-padding">
              {link}
              <p className="card-text" style={{height: 60, overflow: "scroll"}}>{ product.description }
              </p>
              <div className="statusbox">
                  <span className="btnprice">${ product.price }</span>
              </div>
              <div className="statusbox">
                {btn2D}
                {btn3D}
                {btnAR}
                {btnVR}
              </div>
              <div className="card-footer">
                  <span className="right">
                  <a className="" data-toggle="tooltip" data-placement="top" title="Quick Look"><i className="fa fa-eye"></i></a>
                  <a className="" data-toggle="tooltip" data-placement="top" title="Add to Wishlist"><i className="fa fa-heart"></i></a>
                  </span>
              </div>

          </div>


      </div>
    );
  }
}
