import React, { Component } from 'react';

export default class ProductDone extends Component {

  state = {

  }

  componentDidMount() {

  }

  render() {
    const errors = this.props.errors || {}
    return (
      <div class="animated fadeIn">
        <h3>Done</h3>
      </div>
    );
  }
}
