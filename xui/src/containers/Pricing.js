import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import  PricingView  from '../components/PricingView'
import {login} from  '../actions/auth'
import { Alert, Button, Jumbotron,  Form } from 'mdbreact'
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink} from 'mdbreact';


const Pricing = (props) => {
  if(props.isAuthenticated) {
    return (

      <Redirect to='/Pricing' />
    )
  }
  return (
  	<div class="headdiv">
    	<Navbar color="elegant-color" style={{marginBottom: 30}} expand="md" dark fixed="top">
                      <NavbarBrand href="#">
                        <img src="/media/logo.png" width="100" alt="prismalogo" />
                      </NavbarBrand>

				      <form className="form-inline my-2 my-lg-0">
				      	<li className="nav-item dropdown nav-all">
					        <a className="nav-link dropdown-toggle navdropdown-bar " href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					          All
					        </a>
					        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
					          <a className="dropdown-item" href="#">Action</a>
					          <a className="dropdown-item" href="#">Another action</a>
					          <div className="dropdown-divider"></div>
					          <a className="dropdown-item" href="#">Something here</a>
					        </div>
				       </li>
					      <input type="text" placeholder="Search.." name="search2" class="headsearch-box"/>
  							<button type="submit"class="navsearch-btn" ><i class="fa fa-search search-icon"></i></button>
					    </form>
                      <NavbarNav right style={{marginRight:88}} >
				       <NavItem>
                              <NavLink className="nav-link" to="/Dashboard">Dashboard</NavLink>
                          </NavItem>
                          <NavItem>
                              <NavLink className="nav-link" to="/marketplace">Create</NavLink>
                          </NavItem>
                          <NavItem>
                              <NavLink className="nav-link" to="/pricing">Connect</NavLink>
                          </NavItem>
                          <NavItem>
                              <NavLink className="nav-link" to="/about">Products</NavLink>
                          </NavItem>
                          <NavItem>
                              <li className="nav-item dropdown">
				        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				          <i class="fa fa-user" aria-hidden="true"></i>
				        </a>
				        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
				          <a className="dropdown-item" href="#">Action</a>
				          <a className="dropdown-item" href="#">Another action</a>
				          <div className="dropdown-divider"></div>
				          <a className="dropdown-item" href="#">Something here</a>
				        </div>
				      </li>
                          </NavItem>

                      </NavbarNav>
              </Navbar>

	<div style={{marginTop: 137}}>
			<div class="col-sm-12">
		 		 	<div class="row">
              			 <i class="fa fa-cog setting-icon" aria-hidden="true"></i>
             		 	<h2 class="account-head" style={{marginTop: -1}}> Account Settings </h2>

        	    	</div>
         	 <div class=" account-left myacc-left" >
         		 	<ul class="list-unstyled" style={{paddingLeft:2}}>
                      	<li style={{backgroundColor: '#4F4F4F',color:'#fff',paddingTop:20,paddingBottom:25,paddingLeft:61,paddingRight:60}} class="accountlistleft accountlist-redcell"><span class="fa fa-user-o" aria-hidden="true" ></span><a href="/#/ApimyAccount"> MY ACCOUNT</a><div class="arrow-left"></div></li>
                       	<li style={{backgroundColor: '#4F4F4F',color:'#fff',paddingTop:20,paddingBottom:25,paddingLeft:61,paddingRight:60}} class="accountlistleft"><span class="fa fa-th" aria-hidden="true"></span> APPS </li>
                      	 <li style={{backgroundColor: '#4F4F4F',color:'#fff',paddingTop:20,paddingBottom:25,paddingLeft:61,paddingRight:60}} class="accountlistleft"><span class="fa fa-check text-success"></span> PRODUCTS </li>
                       	<li style={{backgroundColor: '#4F4F4F',color:'#fff',paddingTop:20,paddingBottom:25,paddingLeft:61,paddingRight:60}} class="accountlistleft"><span class="fa fa-check text-success"></span> API SETTINGS</li>
                      	 <li style={{backgroundColor: '#4F4F4F',color:'#fff',paddingTop:20,paddingBottom:25,paddingLeft:61,paddingRight:60}} class="accountlistleft"><span class="fa fa-check text-success"></span>ORGANIZATION</li>
                      	 <li style={{backgroundColor: '#4F4F4F',color:'#fff',paddingTop:20,paddingBottom:25,paddingLeft:61,paddingRight:60}} class="accountlistleft"><span class="fa fa-check text-success"></span>BILLING</li>
                      	 <li style={{backgroundColor: '#4F4F4F',color:'#fff',paddingTop:20,paddingBottom:25,paddingLeft:61,paddingRight:60}} class="accountlistleft"><span class="fa fa-check text-success"></span>INVITATIONS</li>
                      	 <li style={{backgroundColor: '#4F4F4F',color:'#fff',paddingTop:20,paddingBottom:25,paddingLeft:61,paddingRight:60}} class="accountlistleft"><span class="fa fa-check text-success"></span>SHARING</li>
           	   	  </ul>
           	 </div>

              <div class="account-right myacc-right" >
              	<div>
              		<ul class="nav">
						  <li class="nav-item navitem-edit1">
						    <a class="nav-link active" href="#"><i class="fa fa-play" style={{paddingRight:8}}></i>Settings</a>
						  </li>
						  <li class="nav-item navitem-edit2">
						    <a class="nav-link" href="#">Edit Profile</a>
						  </li>
						  <li class="nav-item navitem-edit3">
						    <a class="nav-link" style={{marginLeft:88}} href="#">Notifications</a>
						  </li>
					</ul>
              		<div class="underline-div"></div>
              		<div class="row">
              		<div class="col-md-9">
              			<h5 class="myacc-h5">Username <i class="fa fa-question-circle editquestion-mark"></i></h5>
              		<p class="myacc-p">Change your username here. your current username is c.richards144 </p>
              		</div>
              		<div class="downarrow-div myacc-downarrow"><i class="fa fa-angle-down edit-downarrow "></i></div>
              		</div>
			</div>

			<div>
			<div class="underline-div"></div>
			<div class="row">
            <div class="col-md-9">
			<h5 class="myacc-h5">Email Address <i class="fa fa-question-circle editquestion-mark"></i></h5>
              		<p class="myacc-p">Change your email here. your current email is c.richards@xspaceapp.com</p>
         		  </div>
         		  <div class="downarrow-div myacc-downarrow"><i class="fa fa-angle-down edit-downarrow "></i></div>
              		</div>
				</div>
			<div>
				<div class="underline-div"></div>
				<div class="row">
            <div class="col-md-9">
			<h5 class="myacc-h5">Password <i class="fa fa-question-circle editquestion-mark"></i></h5>
              		<p class="myacc-p">Update your password here.</p>
         		   </div>
         		 <div class="downarrow-div myacc-downarrow"><i class="fa fa-angle-down edit-downarrow  "></i></div>
              		</div>
				</div>
				<div>
					<div class="underline-div"></div>
					<div class="row">
            	<div class="col-md-9">
					<h5 class="myacc-h5">Two-Factor Authentication <i class="fa fa-question-circle editquestion-mark"></i></h5>
              		<p class="myacc-p">Enable or disable two-factor authentication for your account. you currently have two-factor auth enabled.</p>
         		</div>
         		   <div class=" downarrow-div myacc-downarrow"><i class="fa fa-angle-down edit-downarrow "></i></div>
              	</div>
			</div>
			<div>
				<div class="underline-div"></div>
				<div class="row">
            	<div class="col-md-9">
					<h5 class="myacc-h5">Time Zone <i class="fa fa-question-circle editquestion-mark"></i></h5>
              		<p class="myacc-p">Set your preffered time zone For notifications, activities emails your current time zone is Set to:(UTC-06:00)central time(US and Canada) </p>
         		</div>
         		   <div class="downarrow-div myacc-downarrow"><i class="fa fa-angle-down edit-downarrow  "></i></div>
              	</div>
			</div>
			<div>
				<div class="underline-div"></div>
				<div class="row">
            	<div class="col-md-9">
					<h5 class="myacc-h5">Language <i class="fa fa-question-circle editquestion-mark"></i></h5>
              		<p class="myacc-p">choose your perferred language For XSPACE. your language is currently Set to:English(US)</p>
         		</div>
         		   <div class=" downarrow-div myacc-downarrow"><i class="fa fa-angle-down edit-downarrow  "></i></div>
              	</div>
			</div>
			<div>
				<div class="underline-div"></div>
				<div class="row">
            	<div class="col-md-8">
					<h5 class="myacc-h5">Sign out all other sessions <i class="fa fa-question-circle editquestion-mark"></i></h5>
              		<p class="myacc-p">sign out of all your session online in case you lost a device,left yourself logged into to a public computer,etc We'll sign out of everything except this current browser.</p>
         		</div>
         		   <div> <input type="submit" value="Sign out of all sessions" class="myacc-lastbtn"/></div>
              	</div>
			</div>

			 </div>

        </div>
        </div>
   </div>
)}

export default Pricing;
