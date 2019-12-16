import React from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
// Input
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
// Dialog
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Request from "../../../../js/request.js";

export default class PasswordModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      newPassword: "",
      newPasswordConfirm: "",

      showCurrentPassword: false,
      showNewPassword: false,

      validForm: false
    };
    this.handleClickShowCurrentPassword = this.handleClickShowCurrentPassword.bind(
      this
    );
    this.handleClickShowNewPassword = this.handleClickShowNewPassword.bind(
      this
    );
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.sendNewData = this.sendNewData.bind(this);
  }

  componentDidUpdate() {
    if (
      this.state.newPassword !== "" &&
      this.state.newPassword === this.state.newPasswordConfirm
    ) {
      if (this.state.validForm === false) {
        this.setState({
          validForm: true
        });
      }
    } else {
      if (this.state.validForm === true) {
        this.setState({
          validForm: false
        });
      }
    }
  }

  sendNewData() {
    if (this.state.validForm === true) {
      this.props.snackbar("Modification en cours...", "info");
      new Request("/api/account/")
        .put()
        .body({
          oldPassword: this.state.password,
          newPassword: this.state.newPassword
        })
        .send()
        .then(res => {
          if (res.ok) return res;
          return res.text().then(r => {
            this.props.snackbar("Mot de passe incorrect !", "error");
            throw new Error(r);
          });
        })
        .then(res => this.props.snackbar("Mot de passe modifié.", "success"))
        .catch(err => console.log(err));
    }
  }

  ///////////////////////////////////////////////////////////////////
  ///// Fonctions pour afficher le mot de passe
  handleClickShowCurrentPassword() {
    this.setState({
      showCurrentPassword: !this.state.showCurrentPassword
    });
  }
  handleClickShowNewPassword() {
    this.setState({
      showNewPassword: !this.state.showNewPassword
    });
  }
  handleMouseDownPassword = event => {
    event.preventDefault();
  };
  /////////////////////////////////////////////////////////////////
  handleChangePassword() {
    this.props.toggle();
    this.props.snackbar();
  }
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.toggle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle
          id="alert-dialog-title"
          className="h2ProfileDialog h3Profile"
        >
          {"Modifier votre mot de passe"}
        </DialogTitle>
        <Divider></Divider>
        <DialogContent>
          <div
            id="alert-dialog-description"
            className="bigSizeProfile"
            style={{ margin: "1em", textAlign: "center" }}
          >
            <FormControl className="inputMarginProfile">
              <InputLabel htmlFor="current-password" className="bigSizeProfile">
                Mot de passe actuel
              </InputLabel>
              <Input
                id="current-password"
                type={this.state.showCurrentPassword ? "text" : "password"}
                className="bigSizeProfile widthInputProfile"
                autoComplete="current-password"
                value={this.state.password}
                onChange={evt => this.setState({ password: evt.target.value })}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleClickShowCurrentPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showCurrentPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <div></div>

            <FormControl className="inputMarginProfile">
              <InputLabel htmlFor="new-password" className="bigSizeProfile">
                Nouveau mot de passe
              </InputLabel>
              <Input
                id="new-password"
                type={this.state.showNewPassword ? "text" : "password"}
                className="bigSizeProfile widthInputProfile"
                autoComplete="new-password"
                value={this.state.newPassword}
                onChange={evt =>
                  this.setState({
                    newPassword: evt.target.value
                  })
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleClickShowNewPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showNewPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText
                id="component-helper-text"
                className="mediumSizeProfile"
              >
                8 caractères minimum
              </FormHelperText>
            </FormControl>
            <div></div>

            <FormControl>
              <InputLabel htmlFor="confirm-password" className="bigSizeProfile">
                Confirmation
              </InputLabel>
              <Input
                id="confirm-password"
                type={this.state.showNewPassword ? "text" : "password"}
                className="bigSizeProfile widthInputProfile"
                autoComplete="new-password"
                value={this.state.newPasswordConfirm}
                onChange={evt =>
                  this.setState({
                    newPasswordConfirm: evt.target.value
                  })
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleClickShowNewPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showNewPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText
                id="component-helper-text"
                className="mediumSizeProfile"
              >
                8 caractères minimum
              </FormHelperText>
            </FormControl>
          </div>
        </DialogContent>
        <Divider></Divider>
        <DialogActions>
          <Button
            onClick={this.props.toggle}
            color="primary"
            style={{ fontSize: "14px" }}
          >
            Annuler
          </Button>
          <Tooltip
            title={
              this.state.validForm === true ? (
                ""
              ) : (
                <span className="tooltipPerso">
                  Confirmer le nouveau mot de passe.
                </span>
              )
            }
            placement="top"
          >
            <span>
              <Button
                color="secondary"
                style={{ fontSize: "14px" }}
                onClick={this.sendNewData}
                disabled={!this.state.validForm}
              >
                Modifier
              </Button>
            </span>
          </Tooltip>
        </DialogActions>
      </Dialog>
    );
  }
}
