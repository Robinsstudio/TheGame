import React, { Component } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

export default class MySnackbar extends Component {
  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={this.props.open}
        autoHideDuration={2500}
        onClose={() => this.props.close(false)}
      >
        <SnackbarContent
          style={{ backgroundColor: green[600], margin: "0.01071em" }}
          aria-describedby="client-snackbar"
          message={
            <span
              id="client-snackbar"
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "16px"
              }}
            >
              <CheckCircleIcon
                style={{ fontSize: 20, opacity: 0.9, marginRight: "8px" }}
              />
              {this.props.message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => this.props.close(false)}
            >
              <CloseIcon style={{ fontSize: 20 }} />
            </IconButton>
          ]}
        />
      </Snackbar>
    );
  }
}
