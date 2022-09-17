import React, { Component } from 'react';
import { Button } from 'mdbreact';
import OrderConfirm from './ordercreate/OrderConfirm';
import OrderMethod from './ordercreate/OrderMethod';
import OrderAssets from './ordercreate/OrderAssets';
import OrderStandard from './ordercreate/OrderStandard';
import OrderProducts from './ordercreate/OrderProducts'

export default class OrderCreateView extends Component {
  state = {
    step: 0
  }
  fieldValues = {
    name     : null,
    email    : null,
    password : null,
    age      : null,
    colors   : [],
  }
  componentDidMount() {
    console.log(this.props.match)
  }
  componentWillMount() {
    document.title = 'XSPACE | Order Creation'
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

  nextStep = () => {
    if (this.state.step === 0) {

    } else if (this.state.step === 2) {

    }
    this.setState({
      step : this.state.step + 1
    })
  }

  // Same as nextStep, but decrementing
  previousStep = () => {
    this.setState({
      step : this.state.step - 1
    })
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmit(this.state.username, this.state.password)
  }

  render() {
    const errors = this.props.errors || {}
    let fragment = (<h2>None</h2>);
    let stepNumberDiv1 = <div className="product-circle">1</div>
    let stepNumberDiv2 = <div className="product-circle">2</div>
    let stepNumberDiv3 = <div className="product-circle">3</div>
    let stepNumberDiv4 = <div className="product-circle">4</div>
    let stepNumberDiv5 = <div className="product-circle">5</div>
    let nextButton = null;

    switch (this.state.step) {
      case 0:
        fragment = <OrderStandard
                    fieldValues={this.fieldValues}
                    nextStep={this.nextStep}>
                  </OrderStandard>
        stepNumberDiv1 = <div className="product-circle-focused animate fadeIn">1</div>
        nextButton = <Button color="light-green" onClick={ this.nextStep }>Get Started</Button>
        break;
      case 1:
        fragment = <OrderMethod
                    fieldValues={this.fieldValues}
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    step={this.state.step}>
                  </OrderMethod>
        stepNumberDiv2 = <div className="product-circle-focused animate fadeIn">2</div>
        nextButton = <Button color="light-green" onClick={ this.nextStep }>Next</Button>
        break;
      case 2:
        fragment = <OrderProducts
                  fieldValues={this.fieldValues}
                  nextStep={this.nextStep}
                  previousStep={this.previousStep}>
                </OrderProducts>
        stepNumberDiv3 = <div className="product-circle-focused animate fadeIn">3</div>
        nextButton = <Button color="light-green" onClick={ this.nextStep }>Next</Button>
        break;
      case 3:
        fragment = <OrderAssets
                    fieldValues={this.fieldValues}
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}>
                  </OrderAssets>
        stepNumberDiv4 = <div className="product-circle-focused animate fadeIn">4</div>
        nextButton = <Button color="light-green" onClick={ this.nextStep }>Next</Button>
        break;
      case 4:
        fragment = <OrderConfirm
                    fieldValues={this.fieldValues}
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}>
                  </OrderConfirm>
        stepNumberDiv5 = <div className="product-circle-focused animate fadeIn">5</div>
        nextButton = <Button color="light-green" onClick={ this.nextStep }>Next</Button>
        break;
      default:
        fragment = (<h2>Lets go to the Dashboard!</h2>);
        break;
    }

    return (
      <div className="top-content">
          <div className="inner-bg margin-breathe">
              <div className="panel-light-no-margin">
                  <div className="flex-container-row pcow-heading">
                    <div><h3 style={{fontWeight: 200}}>Product Capture Order Wizard</h3></div>
                    {stepNumberDiv1}
                    <div>
                      <p>Step 1:</p>
                      <p>Specify/Create Asset Standards</p>
                    </div>
                    <h2>&#x2192;</h2>
                    {stepNumberDiv2}
                    <div>
                      <p>Step 2:</p>
                      <p>Choose Ordering Method</p>
                    </div>
                    <h2>&#x2192;</h2>
                    {stepNumberDiv3}
                    <div>
                      <p>Step 3:</p>
                      <p>Select Product(s) To Order</p>
                    </div>
                    <h2>&#x2192;</h2>
                    {stepNumberDiv4}
                    <div>
                      <p>Step 4:</p>
                      <p>Specify Asset Order</p>
                    </div>
                    <h2>&#x2192;</h2>
                    {stepNumberDiv5}
                    <div>
                      <p>Step 5:</p>
                      <p>Review, Confirm, Add To Cart</p>
                    </div>
                    <h2>&#x2192;</h2>
                    <div className="product-circle">F</div>
                  </div>
                  <hr className="green-line"/>
                  <div className="row">
                      <div className="col-sm-12 form-box">
                        <br />
                        {fragment}
                      </div>
                  </div>
                  <div className="row" style={{background: "#444", marginTop: 10, paddingTop: 10, paddingBottom: 10, paddingLeft: 40, paddingRight: 40}}>
                    <div className="col-sm-6" style={{textAlign: "left"}}>

                    </div>
                    <div className="col-sm-6" style={{textAlign: "right"}}>
                      <Button color="elegant" onClick={ this.previousStep }>Back</Button>
                      {nextButton}
                    </div>
                  </div>

              </div>
          </div>

      </div>
    )
  }
}
