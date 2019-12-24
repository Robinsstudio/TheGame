import React from "react";
import { Link } from "react-router-dom";
// Container and button
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
// Input
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
// Icons
import AccountCircle from "@material-ui/icons/AccountCircle";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
// My Components
import PasswordModal from "./PasswordModal";
// Dialog
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import { withSnackbar } from "notistack";
import "./Profile.css";
import Request from "../../../../js/request.js";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oldPseudo: "",
      oldMail: "",
      pseudo: "",
      mail: "",

      openDialog: false,
      openModal: false
    };
    this.changeSnackbar = this.changeSnackbar.bind(this);
    this.changeDialog = this.changeDialog.bind(this);
    this.changeModal = this.changeModal.bind(this);
  }

  sendNewData() {
    this.changeSnackbar("Modification en cours...", "info");
    new Request("/api/account/")
      .put()
      .body({ login: this.state.pseudo, mail: this.state.mail })
      .send()
      .then(res => {
        if (res.ok) return res.json();
        return res.text().then(r => {
          this.changeSnackbar(r, "error");
          throw new Error(r);
        });
      })
      .then(res =>
        this.props.onRequestReceived({
          login: res.login,
          mail: res.mail
        })
      )
      .then(res => this.changeSnackbar("Modifications effectuées.", "success"))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    if (this.props.login !== undefined && this.props.mail !== undefined)
      this.setState({
        oldPseudo: this.props.login,
        oldMail: this.props.mail,
        pseudo: this.props.login,
        mail: this.props.mail
      });
  }

  componentDidUpdate() {
    if (
      this.state.oldPseudo === "" &&
      this.state.mail === "" &&
      this.props.login !== undefined &&
      this.props.mail !== undefined
    )
      this.setState({
        oldPseudo: this.props.login,
        oldMail: this.props.mail,
        pseudo: this.props.login,
        mail: this.props.mail
      });
  }

  ////////////////////////////////////////////////////////////
  ///// Fonction pour ouvrir les snackbars
  changeSnackbar(message, options) {
    this.props.closeSnackbar();
    this.props.enqueueSnackbar(message, { variant: options });
  }
  ////////////////////////////////////////////////////////////////
  ////// Fonction pour ouvrir le dialogue de suppression de compte
  changeDialog() {
    this.setState({
      openDialog: !this.state.openDialog
    });
  }
  ////////////////////////////////////////////////////////////////
  ////// Fonction pour ouvrir le modal de modification du password
  changeModal() {
    this.setState({
      openModal: !this.state.openModal
    });
  }
  pseudoChange(login) {
    this.setState({ pseudo: login });
  }

  emailChange(email) {
    this.setState({ mail: email });
  }

  deleteAccount() {
    new Request("/api/account")
      .delete()
      .send()
      .then(res => {
        if (res.ok) return res;
        return res.text().then(err => {
          console.log(err);
          this.changeSnackbar(err, "error");
          throw Error(err);
        });
      })
      .then(res => {
        this.changeSnackbar("Suppresion du compte effectué.", "success");
        if (this.props.disconnect !== undefined) this.props.disconnect();
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Container maxWidth="lg">
        <Grid container spacing={3} className="gridProfile">
          <Grid item xs={3}></Grid>
          <Grid item xs={6} className="boxShadowProfile">
            <h3 className="h3Profile">Mes Informations :</h3>
            <Divider />

            <FormControl className="inputMarginProfile formMarginTop">
              <InputLabel
                htmlFor="pseudo"
                className="bigSizeProfile"
                color="primary"
              >
                Pseudo
              </InputLabel>
              <Input
                id="pseudo"
                className="bigSizeProfile widthInputProfile"
                type="text"
                value={this.state.pseudo}
                color="primary"
                onChange={evt => this.pseudoChange(evt.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <AccountCircle
                      fontSize="large"
                      style={{ color: "rgba(0,0,0,0.60)" }}
                    />
                  </InputAdornment>
                }
              />
            </FormControl>
            <div></div>

            <FormControl className="inputMarginProfile">
              <InputLabel htmlFor="mail" className="bigSizeProfile">
                Email
              </InputLabel>
              <Input
                id="mail"
                className="bigSizeProfile widthInputProfile"
                type="email"
                value={this.state.mail}
                onChange={evt => this.emailChange(evt.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <EmailIcon
                      style={{ color: "rgba(0,0,0,0.60)" }}
                      fontSize="large"
                    />
                  </InputAdornment>
                }
              />
            </FormControl>
            <div></div>

            <Button
              className="mediumSizeProfile buttonMargintopProfile"
              color="primary"
              onClick={this.changeModal}
            >
              <LockIcon /> Modifier mon mot de passe
            </Button>
            <div></div>

            <Button
              className="bigSizeProfile deleteButtonProfile"
              color="secondary"
              onClick={this.changeDialog}
            >
              Supprimer mon compte
            </Button>
            <div></div>
            <Divider />

            <Link to={"/"} className="linkHome HomeTypo">
              <Button className="bigSizeProfile buttonMarginProfile">
                Retour
              </Button>
            </Link>
            <Button
              className="bigSizeProfile buttonMarginProfile"
              color="primary"
              onClick={() => this.sendNewData()}
            >
              Sauvegarder
            </Button>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
        <PasswordModal
          open={this.state.openModal}
          toggle={this.changeModal}
          snackbar={(message, options) => this.changeSnackbar(message, options)}
        />
        {
          ///////////////////////////////////////////////////
          //// Dialogue de suppresion de compte
        }
        <Dialog
          open={this.state.openDialog}
          onClose={this.changeDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogTitle
            id="alert-dialog-title"
            className="h2ProfileDialog h3Profile"
          >
            {"Voulez-vous supprimer votre compte ?"}
          </DialogTitle>
          <Divider></Divider>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              className="bigSizeProfile"
              style={{ margin: "1em", textAlign: "center" }}
            >
              Attention, toute suppression est définitive !
            </DialogContentText>
          </DialogContent>
          <Divider></Divider>
          <DialogActions>
            <Button
              onClick={this.changeDialog}
              color="primary"
              style={{ fontSize: "13px" }}
            >
              Non, annuler
            </Button>
            <Button
              onClick={() => this.deleteAccount()}
              color="secondary"
              style={{ fontSize: "13px" }}
            >
              Oui, supprimer mon compte
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
}

export default withSnackbar(Profile);
