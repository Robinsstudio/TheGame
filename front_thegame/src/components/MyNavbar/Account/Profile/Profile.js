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
import MySnackbar from "./MySnackbar";
import PasswordModal from "./PasswordModal";
// Dialog
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import "./Profile.css";
import Request from '../../../../js/request.js';
//var Request = require("../../../../js/request");

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      validForm: false,
      oldPseudo : "",
      oldMail : "",
      pseudo: "",
      mail: "",
      oldPassword : "",
      newPassword : "",
      newPasswordConfirm: "",

      openSnackbarInfo: false,
      openSnackbarPassword: false,
      openDialog: false,
      openModal: false
    };
    this.changeSnackbarInfo = this.changeSnackbarInfo.bind(this);
    this.changeSnackbarPassword = this.changeSnackbarPassword.bind(this);
    this.changeDialog = this.changeDialog.bind(this);
    this.changeModal = this.changeModal.bind(this);
  }

  sendNewData(){
    new Request('/api/account/')
    .put()
    .body({login : this.state.pseudo,mail:this.state.mail,oldPassword:this.state.oldPassword,newPassword : this.state.newPassword})
    .send()
    .then(res=>{if(res.ok)return res.json();return res.text().then(r=>{throw new Error(r)})})
    .then(res=>this.props.onRequestReceived({login : res.login,mail : res.mail}))
    .then(res=>this.changeSnackbarInfo())
    .catch(err=>console.log(err));
  }

  componentDidMount(){
    if(this.props.login !== undefined && this.props.mail !== undefined)
      this.setState({oldPseudo : this.props.login, oldMail : this.props.mail, pseudo : this.props.login,mail : this.props.mail})
  }

  componentDidUpdate(){
    if(this.state.oldPseudo === "" && this.state.mail === "" && this.props.login !== undefined && this.props.mail !== undefined)
      this.setState({oldPseudo : this.props.login, oldMail : this.props.mail, pseudo : this.props.login,mail : this.props.mail})
  }

  ////////////////////////////////////////////////////////////
  ///// Fonction pour ouvrir le snackbar après la sauvegarde des données
  changeSnackbarInfo() {
    this.setState({
      openSnackbar: !this.state.openSnackbar
    });
  }
  ////////////////////////////////////////////////////////////
  ///// Fonction pour ouvrir le snackbar après la modification du mot de passe
  changeSnackbarPassword() {
    this.setState({
      openSnackbarPassword: !this.state.openSnackbarPassword
    });
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
  pseudoChange(login){
    this.setState({pseudo : login});
  }

  emailChange(email){
    this.setState({mail : email})
  }

  deleteAccount(){
    new Request("/api/account")
    .delete()
    .send()
    .then(res=>{if(res.ok)return res; return res.text().then(err=>{console.log(err);throw Error(err)})})
    .then(res=>{if(this.props.disconnect !== undefined)this.props.disconnect()})
    .catch(err=>console.log(err));
  }

  render() {
    return (
      <Container maxWidth="lg">
        <Grid container spacing={3} className="gridProfile">
          <Grid item xs={3}></Grid>
          <Grid item xs={6} className="boxShadowProfile">
            <h3 className="h3Profile">Mes Informations :</h3>

            <FormControl className="inputMarginProfile">
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
                onChange={evt=>this.pseudoChange(evt.target.value)}
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
                onChange={evt=>this.emailChange(evt.target.value)}
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
            <Link to={"/"} className="linkHome HomeTypo">
              <Button className="bigSizeProfile buttonMarginProfile">
                Retour
              </Button>
            </Link>
              <Button
                className="bigSizeProfile buttonMarginProfile"
                color="primary"
                onClick={()=>this.sendNewData()}
                //disabled={!this.state.validForm}
              >
                Sauvegarder
              </Button>
            <MySnackbar
              message={"Informations modifées."}
              open={this.state.openSnackbar}
              close={this.changeSnackbarInfo}
            />
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
        <PasswordModal
          open={this.state.openModal}
          toggle={this.changeModal}
          snackbar={this.changeSnackbarPassword}
        />
        <MySnackbar
          message={"Mot de passe modifié."}
          open={this.state.openSnackbarPassword}
          close={this.changeSnackbarPassword}
        />
        {
          ///////////////////////////////////////////////////
          ////Dialogue de suppresion de compte
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
            <Button onClick={()=>this.deleteAccount()} color="secondary" style={{ fontSize: "13px" }}>
              Oui, supprimer mon compte
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
}
