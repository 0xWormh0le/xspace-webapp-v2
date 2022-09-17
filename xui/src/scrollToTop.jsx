import React from 'react'
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom'
ReactGA.initialize('UA-90551571-4'); //Unique Google Analytics tracking number

class ScrollToTop extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
      ReactGA.pageview(this.props.location.pathname);
    }
  }

  render () {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop)
