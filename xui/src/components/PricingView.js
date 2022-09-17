import React, {Component} from 'react'
import {BrowserRouter as Link} from "react-router-dom";
import {
    Navbar,
    NavbarBrand,
    NavbarNav,
    NavItem,
    NavLink
} from 'mdbreact'

export default class Pricing extends Component {

    componentWillMount() {
        document.title = 'XSPACE | Pricing'
    }

    render() {
        const errors = this.props.errors || {}
        return (
            <div className="headdiv">
                <Navbar color="elegant-color" style={{marginBottom: 30}} expand="md" dark fixed="top">
                    <NavbarBrand href="#">
                        <img src="/media/img/logo.png" width="100" alt="prismalogo"/>
                    </NavbarBrand>

                    <form className="form-inline my-2 my-lg-0">
                        <li className="nav-item dropdown nav-all">
                            <a className="nav-link dropdown-toggle navdropdown-bar" href="#" id="navbarDropdown"
                               role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                All
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <div className="dropdown-divider"/>
                                <a className="dropdown-item" href="#">Something here</a>
                            </div>
                        </li>
                        <input type="text" placeholder="Search.." name="search2" className="headsearch-box"/>
                        <button type="submit" className="navsearch-btn"><i className="fa fa-search search-icon"/>
                        </button>
                    </form>

                    <NavbarNav right style={{marginRight: 88}}>
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
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fa fa-user" aria-hidden="true"/>
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a className="dropdown-item" href="#">Action</a>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <div className="dropdown-divider"/>
                                    <a className="dropdown-item" href="#">Something here</a>
                                </div>
                            </li>
                        </NavItem>
                    </NavbarNav>
                </Navbar>

                <div style={{marginTop: 137}}>
                    <div className="col-sm-12">
                        <div className="row">
                            <i className="fa fa-cog setting-icon" aria-hidden="true"/>
                            <h2 className="account-head" style={{marginTop: -1}}> Account Settings </h2>
                        </div>

                        <div className=" account-left myacc-left">
                            <ul className="list-unstyled" style={{paddingLeft: 2}}>
                                <li style={{
                                    backgroundColor: '#4F4F4F',
                                    color: '#fff',
                                    paddingTop: 20,
                                    paddingBottom: 25,
                                    paddingLeft: 61,
                                    paddingRight: 60
                                }} className="accountlistleft accountlist-redcell"><span className="fa fa-user-o"
                                                                                         aria-hidden="true"/><a
                                    href="/myaccount"> MY ACCOUNT</a>
                                    <div className="arrow-left"/>
                                </li>
                                <li style={{
                                    backgroundColor: '#4F4F4F',
                                    color: '#fff',
                                    paddingTop: 20,
                                    paddingBottom: 25,
                                    paddingLeft: 61,
                                    paddingRight: 60
                                }} className="accountlistleft"><span className="fa fa-th"
                                                                     aria-hidden="true"/> APPS
                                </li>
                                <li style={{
                                    backgroundColor: '#4F4F4F',
                                    color: '#fff',
                                    paddingTop: 20,
                                    paddingBottom: 25,
                                    paddingLeft: 61,
                                    paddingRight: 60
                                }} className="accountlistleft"><span
                                    className="fa fa-check text-success"/> PRODUCTS
                                </li>
                                <li style={{
                                    backgroundColor: '#4F4F4F',
                                    color: '#fff',
                                    paddingTop: 20,
                                    paddingBottom: 25,
                                    paddingLeft: 61,
                                    paddingRight: 60
                                }} className="accountlistleft"><span className="fa fa-check text-success"/> <Link
                                    style={{color: '#fff'}} to="/apisetting">API SETTINGS</Link></li>
                                <li style={{
                                    backgroundColor: '#4F4F4F',
                                    color: '#fff',
                                    paddingTop: 20,
                                    paddingBottom: 25,
                                    paddingLeft: 61,
                                    paddingRight: 60
                                }} className="accountlistleft"><span className="fa fa-check text-success"/>ORGANIZATION
                                </li>
                                <li style={{
                                    backgroundColor: '#4F4F4F',
                                    color: '#fff',
                                    paddingTop: 20,
                                    paddingBottom: 25,
                                    paddingLeft: 61,
                                    paddingRight: 60
                                }} className="accountlistleft"><span className="fa fa-check text-success"/>BILLING
                                </li>
                                <li style={{
                                    backgroundColor: '#4F4F4F',
                                    color: '#fff',
                                    paddingTop: 20,
                                    paddingBottom: 25,
                                    paddingLeft: 61,
                                    paddingRight: 60
                                }} className="accountlistleft"><span className="fa fa-check text-success"/>INVITATIONS
                                </li>
                                <li style={{
                                    backgroundColor: '#4F4F4F',
                                    color: '#fff',
                                    paddingTop: 20,
                                    paddingBottom: 25,
                                    paddingLeft: 61,
                                    paddingRight: 60
                                }} className="accountlistleft"><span className="fa fa-check text-success"/>SHARING
                                </li>
                            </ul>
                        </div>

                        <div className="account-right myacc-right">
                            <div>
                                <ul className="nav">
                                    <li className="nav-item navitem-edit1">
                                        <a className="nav-link active" href="#"><i className="fa fa-play"
                                                                                   style={{paddingRight: 8}}/>
                                                                                   Settings
                                        </a>
                                    </li>
                                    <li className="nav-item navitem-edit2">
                                        <Link className="nav-link" to="/editprofile">Edit Profile</Link>
                                    </li>
                                    <li className="nav-item navitem-edit3">
                                        <Link className="nav-link" style={{marginLeft: 88}}
                                              to="/notification">Notifications</Link>
                                    </li>
                                </ul>
                                <div className="underline-div"/>
                                <div className="row">
                                    <div className="col-md-9">
                                        <h3>Username <i className="fa fa-question-circle editquestion-mark"/></h3>
                                        <h5>Change your username here. Your current username is c.richards144 </h5>
                                    </div>
                                    <div className="downarrow-div myacc-downarrow"><i
                                        className="fa fa-angle-down edit-downarrow "/></div>
                                </div>
                            </div>
                            <div>
                                <div className="underline-div"/>
                                <div className="row">
                                    <div className="col-md-9">
                                        <h3>Email Address <i className="fa fa-question-circle editquestion-mark"/>
                                        </h3>
                                        <h5>Change your email here. Your current email is c.richards@xspaceapp.com</h5>
                                    </div>
                                    <div className="downarrow-div myacc-downarrow"><i
                                        className="fa fa-angle-down edit-downarrow "/></div>
                                </div>
                            </div>
                            <div>
                                <div className="underline-div"/>
                                <div className="row">
                                    <div className="col-md-9">
                                        <h3>Password <i className="fa fa-question-circle editquestion-mark"/></h3>
                                        <h5>Update your password here.</h5>
                                    </div>
                                    <div className="downarrow-div myacc-downarrow"><i
                                        className="fa fa-angle-down edit-downarrow  "/></div>
                                </div>
                            </div>
                            <div>
                                <div className="underline-div"/>
                                <div className="row">
                                    <div className="col-md-9">
                                        <h3>Two-Factor Authentication <i
                                            className="fa fa-question-circle editquestion-mark"/></h3>
                                        <h5>Enable or disable two-factor authentication for your account. You currently
                                            have two-factor auth enabled.</h5>
                                    </div>
                                    <div className=" downarrow-div myacc-downarrow"><i
                                        className="fa fa-angle-down edit-downarrow "/></div>
                                </div>
                            </div>
                            <div>
                                <div className="underline-div"/>
                                <div className="row">
                                    <div className="col-md-9">
                                        <h3>Time Zone <i className="fa fa-question-circle editquestion-mark"/></h3>
                                        <h5>Set your preferred time zone for notifications, activities, and emails. Your
                                            current time zone is set to:(UTC-06:00)Central Time(US and Canada) </h5>
                                    </div>
                                    <div className="downarrow-div myacc-downarrow"><i
                                        className="fa fa-angle-down edit-downarrow  "/></div>
                                </div>
                            </div>
                            <div>
                                <div className="underline-div"/>
                                <div className="row">
                                    <div className="col-md-9">
                                        <h3>Language <i className="fa fa-question-circle editquestion-mark"/></h3>
                                        <h5>Choose your preferred language for XSPACE. Your language is currently set
                                            to:English(US)</h5>
                                    </div>
                                    <div className=" downarrow-div myacc-downarrow"><i
                                        className="fa fa-angle-down edit-downarrow  "/></div>
                                </div>
                            </div>
                            <div>
                                <div className="underline-div"/>
                                <div className="row">
                                    <div className="col-md-8">
                                        <h3>Sign out all other sessions <i
                                            className="fa fa-question-circle editquestion-mark"/></h3>
                                        <h5>sign out of all your session online in case you lost a device,left yourself
                                            logged into to a public computer,etc We'll sign out of everything except
                                            this current browser.</h5>
                                    </div>
                                    <div><input type="submit" value="Sign out of all sessions"
                                                className="myacc-lastbtn"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
