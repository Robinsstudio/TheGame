import React, { Component } from "react";
import "./ConnexionPage.css";
import $ from "jquery";
import { withRouter } from "react-router-dom";
import Request from '../../js/request.js';
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
  validatePseudo(pseudo) {
    const regex = /^.{1,}$/;
    return regex.test(pseudo);
  }
  /////////////////////////////////////////////
  // fonction pour vérifier le format du mail
  validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  connect(){
    new Request('/api/authentication')
    .put()
    .body({login : this.state.loginConnexion,password : this.state.passwordConnexion})
    .send()
    .then(res=>{if(res.ok)return res.json(res); throw Error("Erreur de connexion")})
    .then(res=>{console.log(res);if(this.props.onRequestReceived!==undefined)this.props.onRequestReceived(res);})
    .catch(err=>console.log(err));
    /*fetch('http://localhost:8080/api/authentication',{
            method : 'PUT',
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body : JSON.stringify({login : this.state.loginConnexion,password : this.state.passwordConnexion}) 
        })
    .then(res=>console.log(res)).catch(err=>console.log(err))*/
  }

  register(){
    new Request('/api/account')
    .post()
    .body({login : this.state.loginRegister,email : this.state.mailRegister,password : this.state.passwordRegister})
    .send()
    .then(res=>{if(res.ok)return res; return res.text().then(err=>{console.log(err);throw Error(err)})})
    .then(res=>this.setState({loginConnexion : this.state.loginRegister,
                            passwordConnexion : this.state.passwordRegister }))
    .then(()=>this.connect())
    .catch(err=>console.log(err));
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
            <form id="login" tabIndex="1" autoComplete="on">
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
                <button type="button" className="dark" onClick={this.connect}>Connexion</button>
              </div>
            </form>
            <form id="register" tabIndex="2" autoComplete="on">
              <h3>Inscription</h3>
              <div className="name">
                <input
                  type="text"
                  name="loginRegister"
                  autoComplete="username"
                  onChange={this.handleInputChange}
                  required
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
                />
                <label>Confirmation</label>
              </div>
              <div className="submit">
                <button type="button" onClick={this.register}className="dark" /*disabled={!this.state.validForm}*/>
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

export default withRouter(ConnexionPage);
