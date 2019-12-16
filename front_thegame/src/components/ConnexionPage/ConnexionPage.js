import React, { Component } from "react";
import "./ConnexionPage.css";
import $ from "jquery";
import { withRouter } from "react-router-dom";
import Request from "../../js/request.js";
import { withSnackbar } from "notistack";

class ConnexionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginConnexion: "",
      passwordConnexion: "",

      loginRegister: "",
      mailRegister: "",
      passwordRegister: "",
      passwordConfirmation: "",

      validForm: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.connect = this.connect.bind(this);
    this.register = this.register.bind(this);
    this.changeSnackbar = this.changeSnackbar.bind(this);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  // Fonction qui se lance à la création du composant pour pouvoir utiliser le jQuery
  componentDidMount() {
    $(document).ready(function() {
      $(".veen .rgstr-btn button").click(function() {
        $(".veen .wrapper").addClass("move");
        $(".body").css("background", "#700000");
        $("#myNavbar").removeClass("myNavbarSilver");
        $("#myNavbar").addClass("myNavbarRed");
        $(".veen .login-btn button").removeClass("active");
        $(this).addClass("active");
      });
      $(".veen .login-btn button").click(function() {
        $(".veen .wrapper").removeClass("move");
        $(".body").css("background", "#555555");
        $("#myNavbar").removeClass("myNavbarRed");
        $("#myNavbar").addClass("myNavbarSilver");
        $(".veen .rgstr-btn button").removeClass("active");
        $(this).addClass("active");
      });
    });
  }
  //////////////////////////////////////////////////////
  // Fonction pour modifier les valeurs des inputs
  handleInputChange = event => {
    let { value, name } = event.target;
    this.setState({
      [name]: value
    });
  };
  ///////////////////////////////////////////////////////////////////
  // Fonction regex pour valider un mot de passe de plus de 8 caractères
  validatePassword(mdp) {
    const regex = /^.{8,}$/;
    return regex.test(mdp) && mdp === this.state.passwordConfirmation;
  }
  ///////////////////////////////////////////////////////////////////
  // Fonction regex pour valider le pseudo
  validatePseudo() {
    return "[a-zA-Z0-9]{1,}";
  }
  /////////////////////////////////////////////
  // fonction pour vérifier le format du mail
  validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }
  ////////////////////////////////////////////////////////////
  ///// Fonction pour ouvrir les snackbars
  changeSnackbar(message, options) {
    this.props.closeSnackbar();
    this.props.enqueueSnackbar(message, { variant: options });
  }
  connect() {
    this.changeSnackbar("Connexion en cours...", "info");
    new Request("/api/authentication")
      .put()
      .body({
        login: this.state.loginConnexion,
        password: this.state.passwordConnexion
      })
      .send()
      .then(res => {
        if (res.ok) return res.json(res);
        return res.text().then(err => {
          console.log(err);
          this.changeSnackbar(err, "error");
          throw Error(err);
        });
      })
      .then(res => {
        this.changeSnackbar("Connexion réussie.", "success");
        if (this.props.onRequestReceived !== undefined)
          this.props.onRequestReceived(res);
      })
      .catch(err => console.log(err));
  }

  register() {
    this.changeSnackbar("Inscription en cours...", "info");
    new Request("/api/account")
      .post()
      .body({
        login: this.state.loginRegister,
        email: this.state.mailRegister,
        password: this.state.passwordRegister
      })
      .send()
      .then(res => {
        if (res.ok) return res;
        return res.text().then(err => {
          console.log(err);
          this.changeSnackbar(err, "error");
          throw Error(err);
        });
      })
      .then(res =>
        this.setState({
          loginConnexion: this.state.loginRegister,
          passwordConnexion: this.state.passwordRegister
        })
      )
      .then(() => this.connect())
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="body">
        <div className="veen">
          <div className="login-btn splits">
            <p>Déjà inscrit ?</p>
            <button className="active">Se connecter</button>
          </div>
          <div className="rgstr-btn splits">
            <p>Pas encore inscrit ?</p>
            <button>S'inscrire</button>
          </div>
          <div className="wrapper">
            <form
              id="login"
              tabIndex="1"
              autoComplete="on"
              onSubmit={evt => {
                evt.preventDefault();
                this.connect();
              }}
            >
              <h3>Connexion</h3>
              <div className="mail">
                <input
                  type="mail"
                  name="loginConnexion"
                  autoComplete="username"
                  onChange={this.handleInputChange}
                  required
                />
                <label>Mail ou Pseudo</label>
              </div>
              <div className="passwd">
                <input
                  type="password"
                  name="passwordConnexion"
                  autoComplete="current-password"
                  onChange={this.handleInputChange}
                  required
                />
                <label>Mot de passe</label>
              </div>
              <div className="submit">
                <button type="submit" className="dark">
                  Connexion
                </button>
              </div>
            </form>
            <form
              id="register"
              tabIndex="2"
              autoComplete="on"
              onSubmit={evt => {
                evt.preventDefault();
                this.register();
              }}
            >
              <h3>Inscription</h3>
              <div className="name">
                <input
                  type="text"
                  name="loginRegister"
                  autoComplete="username"
                  onChange={this.handleInputChange}
                  required
                  pattern={this.validatePseudo()}
                />
                <label>Pseudo</label>
              </div>
              <div className="mail">
                <input
                  type="mail"
                  name="mailRegister"
                  autoComplete="email"
                  onChange={this.handleInputChange}
                  required
                />
                <label>Mail</label>
              </div>
              <div className="uid">
                <input
                  type="password"
                  name="passwordRegister"
                  autoComplete="new-password"
                  onChange={this.handleInputChange}
                  required
                />
                <label>Mot de passe</label>
              </div>
              <div className="passwd">
                <input
                  type="password"
                  name="passwordConfirmation"
                  autoComplete="new-password"
                  onChange={this.handleInputChange}
                  required
                  pattern={this.state.passwordRegister}
                />
                <label>Confirmation</label>
              </div>
              <div className="submit">
                <button
                  type="submit"
                  className="dark" /*disabled={!this.state.validForm}*/
                >
                  S'inscrire
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withSnackbar(ConnexionPage));
