import React, {Component} from 'react'
import styled from 'styled-components'
import { testEmail } from '../util/RegexTest'

import TextInput from '../lib/TextInput'
import { API_ROOT } from '../index'

const Logo = styled.div`
  padding: 50px;
  display: flex;
  justify-content: center;
`

const Specs = styled.ul`
  padding: 30px;
  margin: 0;
  li {
    padding-bottom: 10px;
  }
`

export default class LoginView extends Component {
  state = {
    username: '',
    password: '',
    error: '',
    processing: false,
    fieldErrors: {
      username: '',
      password: ''
    }
  }

  componentWillMount() {
    document.title = 'XSPACE | Login'
    //we will use this to check the API to see if it's connected
    this.props.statusCheck()
  }

  handleEmailInputChange = (event) => {
    const target = event.target,
          value = target.type ===
            'checkbox' ? target.checked : target.value,
          name = target.name
    this.setState({
      [name]: value
    });
    if (!testEmail(event.target.value)) {
      this.setState({fieldErrors: {username : 'Please enter in a valid e-mail address'}});
    } else {
      this.setState({fieldErrors: {username : ''}});
    }
  }

  handlePasswordInputChange = (event) => {
    const target = event.target,
          value = target.type ===
            'checkbox' ? target.checked : target.value,
          name = target.name
    this.setState({
      [name]: value
    });
    // if (event.target.value.length < 8) {
    //   this.setState({fieldErrors: {password: 'Please enter in a valid password.'}});
    // }
  }

/*check user is active or not*/
  userCheck(data){
    fetch(API_ROOT + '/api/usercheck/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'email':data})
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        //console.log(response['status']);
        if(response['status']===false)
        {
          this.setState({"error": "Your account is not verified. Please verify your account to login."});
        }else{
          this.setState({"error": "Please check your e-mail or password and try again."});
        }

    });
  }

  onSubmit = (event) => {
    event.preventDefault()
    let { username, password } = this.state;
    if (username.length < 1 && password.length < 8) {
        this.setState({fieldErrors:
          {username : 'Please enter in a valid e-mail address',
          password: 'Please enter in a valid password.'}
        });
    } else {
      this.setState({"processing":true})
      this.props.onSubmit(this.state.username, this.state.password).then((res) => {
        if (res.error) {
          this.userCheck(username);
        }
        this.setState({"processing":false})
        // else {
        //   this.setState({"error": "An unknown error has occured. Please contact support@xspaceapp.com"});
        // }
      }).catch((err)=> {
        this.setState({"processing":false})
        // if (err) {
        //   this.setState({"error": "Your e-mail or password is incorrect. Please try again."});
        // }
      })
    }
  }

  render() {
    const { error, fieldErrors, processing } = this.state;
    let signInButton = (<a className="btn btn-lg btn-primary" disabled>PLEASE WAIT...</a>)
    if (!processing)
      signInButton = (<button className="btn btn-lg btn-primary" type="submit">SIGN IN</button>)
    return (
      <div className={"container"}>
        <Logo><img className="mainLogo"  alt="logo" /></Logo>
        <br />
        <br />
        <div className="row">
          <div className="col-md-6 override-right">
            <div className="panel-graphic">
              <div className="panel-shade-graphic">
                <form className="form-signin" id="login_form" onSubmit={this.onSubmit}>
                  <h2 className="form-signin-heading">SIGN IN</h2>
                  <br />
                    <TextInput name="username" label="EMAIL"
                                          error={fieldErrors.username}
                                          onBlur={this.handleEmailInputChange} />
                    <TextInput name="password" label="PASSWORD"
                                error={fieldErrors.password} type="password"
                                onChange={this.handlePasswordInputChange}/>
                  <p style={{color: 'red'}}>{error}</p>
                  <div className="text-center">
                    {signInButton}
                  </div>
                  <br />
                  <a className="btn-block text-center underline spaced" href="/#/forgot">FORGOT YOUR PASSWORD&#63;</a>
                  <input type="hidden" name="submit" value="submit" />
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-6 override-left">
            <div className="panel-graphic">
              <div className="panel-shade-graphic">
                  <p className="lead">Don&apos;t have an account&#63; Register now for <span className="text-success">FREE</span></p>
                  <Specs className="list-unstyled" >
                      <li><span className="fa fa-check text-success"/> Manage Product Visuals <span>(3D &amp; 2D)</span></li>
                      <li><span className="fa fa-check text-success"/> Communicate With Product Partners </li>
                      <li><span className="fa fa-check text-success"/> Integrate easily into Shopify, Magento, WooCommerce or your own web app.</li>
                      <li><span className="fa fa-check text-success"/> Developer Friendly API</li>
                      <li><span className="fa fa-check text-success"/>Automatically Update Product Information</li>
                  </Specs>
                  <p><a href="/#/register" className="btn btn-lg btn-primary btn-block">Sign Me Up!</a></p>
              </div>
          </div>
        </div>
      </div>
      <br />
     </div>
    )
  }
}
