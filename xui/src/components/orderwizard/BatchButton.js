import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';

import './BatchButton.css';

export default class BatchButton extends Component {

  constructor(props) {
    super(props)
    this.state = {
      imageUrl: "",
    }

    this.selectButton = this.selectButton.bind(this)
  }

  selectButton() {
    this.props.setCustomServices(!this.props.selected)
  }

  render() {

    let { selected } = this.props

    let buttonView = (
      <div class="batch-button" onClick={this.selectButton}>
        <p>{this.props.text}</p>
      </div>
    )

    if (selected) {
      buttonView = (
        <div class="batch-button batch-button-selected"  onClick={this.selectButton}>
          <p>{this.props.text}</p>
        </div>
      )
    }

    return buttonView
  }
}
