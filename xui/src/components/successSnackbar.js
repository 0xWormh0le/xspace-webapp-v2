import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { Icon } from "@material-ui/core";


class SuccessSnackbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            message: props.message,
            variant: props.variant,
            vertical: props.vertical,
            horizontal: props.horizontal
        }
        this.handleClose = this.handleClose.bind(this)
    }

    handleClose() {
    this.setState({open: false})
    }

    render() {
        console.log('here monevi')
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: this.state.vertical,
                    horizontal: this.state.horizontal
                }}
                open={true}
                autoHideDuration={6000}
                onClose={this.handleClose}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar">
                      <Icon>check_circle</Icon>
                        {this.state.message}
                  </span>
                }
            />
        )
    }
}

export default SuccessSnackbar