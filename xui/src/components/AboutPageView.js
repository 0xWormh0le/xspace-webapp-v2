import React from 'react';

export default class AboutPageView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false
    };
  }

  componentWillMount() {
    document.title = 'XSPACE | Login'
  }

  render() {
    return (
        <p>HELLO WORLD</p>
    );
  }
}
