import React, { Component } from "react";
import "./ConnexionPage.css";
import $ from "jquery";
import { Link, withRouter } from "react-router-dom";

class ConnexionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mailConnexion: "",
      passwordConnexion: "",

      validForm: false
    };
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
            <form id="login" tabIndex="1">
              <h3>Connexion</h3>
              <div className="mail">
                <input type="mail" name="" />
                <label>Mail ou Pseudo</label>
              </div>
              <div className="passwd">
                <input type="password" name="" />
                <label>Mot de passe</label>
              </div>
              <div className="submit">
                <Link to={"/connected"} className="linkHome">
                  <button className="dark">Connexion</button>
                </Link>
              </div>
            </form>
            <form id="register" tabIndex="2">
              <h3>Inscription</h3>
              <div className="name">
                <input type="text" name="" />
                <label>Prénom</label>
              </div>
              <div className="mail">
                <input type="mail" name="" />
                <label>Mail</label>
              </div>
              <div className="uid">
                <input type="text" name="" />
                <label>Pseudo</label>
              </div>
              <div className="passwd">
                <input type="password" name="" />
                <label>Mot de passe</label>
              </div>
              <div className="submit">
                <button className="dark">S'inscrire</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ConnexionPage);
