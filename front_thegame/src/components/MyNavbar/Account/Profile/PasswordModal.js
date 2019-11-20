import React from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
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
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default class PasswordModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      newPassword: "",
      newPasswordConfirm: "",

      validPassword: true,
      validNewPassword: false,
      validNewPasswordConfirm: false,

      validForm: false,
      showPassword: false
    };
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  ///////////////////////////////////////////////////////////////////
  ///// Fonctions pour afficher le mot de passe
  handleClickShowPassword() {
    this.setState({
      showPassword: !this.state.showPassword
    });
  }
  handleMouseDownPassword = event => {
    event.preventDefault();
  };

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
          <DialogContentText
            id="alert-dialog-description"
            className="bigSizeProfile"
            style={{ margin: "1em", textAlign: "center" }}
          >
            <FormControl className="inputMarginProfile">
              <InputLabel
                htmlFor="standard-adornment-password"
                className="bigSizeProfile"
              >
                Mot de passe actuel
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={this.state.showPassword ? "text" : "password"}
                className="bigSizeProfile widthInputProfile"
                autoComplete="current-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? (
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
              <InputLabel
                htmlFor="standard-adornment-password"
                className="bigSizeProfile"
              >
                Nouveau mot de passe
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={this.state.showPassword ? "text" : "password"}
                className="bigSizeProfile widthInputProfile"
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? (
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
              <InputLabel
                htmlFor="standard-adornment-password"
                className="bigSizeProfile"
              >
                Confirmation
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={this.state.showPassword ? "text" : "password"}
                className="bigSizeProfile widthInputProfile"
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? (
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
          </DialogContentText>
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
          <Button
            color="secondary"
            style={{ fontSize: "14px" }}
            onClick={this.handleChangePassword}
            //disabled={!this.state.validForm}
          >
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
