import React, {Component} from 'react'
import { NavLink} from 'mdbreact'
import './MenuBarCss.css'

function Admin(props){
  // console.log(props);
  const perms = props.data && props.data['permissions'];
  // console.log(perms);
  const isAdmin = (perms && perms.includes('ALL')) || false;

  if (isAdmin) {
    return (
      <div>
        <NavLink to="/myaccount/billing" className="left-menu-bar menu-inactive" activeClassName="menu-active">
            <span className="menu-font">Billing</span>
        </NavLink>
        <NavLink to="/myaccount/invitations" className="left-menu-bar menu-inactive" activeClassName="menu-active">
            <span className="menu-font">Invitations</span>
        </NavLink>
      </div>
    )
  }
  return <div></div>;
}
export default class LeftSideMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
        activeURL :'',
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log(this.props.location, nextProps.location)
    if (nextProps.location !== this.props.location) {

      // navigated!


      //Set the state of the selected Menu location


      //Set CSS class state for the list

    }

  }



  returnActiveLink = (key) =>{
    var className = null;

    switch(key){
        case 1:
            className = null;
            break;
        case 2:
            className = null;
            break;
        case 3:
            className = null;
            break;
        case 4:
            className = null;
            break;
        case 5:
            className = null;
            break;
        case 6:
            break;
        default:
            break;

    }

  }

  render() {

    return (
      <div>
        <NavLink to="/myaccount/setting" className="left-menu-bar menu-inactive" activeClassName="menu-active">
            <span className="menu-font">My Account</span>
        </NavLink>
        <NavLink to="#" className="left-menu-bar menu-inactive">
            <span className="menu-font grey-text">Apps</span>
        </NavLink>
        <NavLink to="/myaccount/organization" className="left-menu-bar menu-inactive" activeClassName="menu-active">
            <span className="menu-font">Organization</span>
        </NavLink>
        <Admin data={this.props.data.userInfo} />
            <div className="left-menu-bar menu-inactive" activeClassName="menu-active">
                <a href="https://xapphelp.zendesk.com/hc/en-us/requests/new">
                    <span className="menu-font">Support</span>
                </a>
            </div>
      </div>
    )
  }
}
