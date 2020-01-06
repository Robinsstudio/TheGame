import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link, withRouter } from "react-router-dom";
import "./Navbar.css";
import Account from "./Account/Account";
import Request from "../../js/request.js";
import RouteBuilder from "../../js/RouteBuilder";
import { withSnackbar } from "notistack";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.disconnect = this.disconnect.bind(this);
    this.changeSnackbar = this.changeSnackbar.bind(this);
  }

  ////////////////////////////////////////////////////////////
  ///// Fonction pour ouvrir les snackbars
  changeSnackbar() {
    this.props.closeSnackbar();
    this.props.enqueueSnackbar("Déconnexion réussie.", { variant: "success" });
  }

  disconnect() {
    new Request("/api/authentication")
      .delete()
      .send()
      .then(res => {
        if (this.props.onDisconnect !== undefined) this.props.onDisconnect(res);
      });
  }

  render() {
    if (this.props.location.pathname === RouteBuilder.get("/login")) {
      return (
        <div className="HomeTypo" id="myNavbarDark">
          <AppBar position="static" className="myNavbarSilver" id="myNavbar">
            <Toolbar>
              <Link to={RouteBuilder.get("/")} className="linkHome ConnexionTypo">
                <Typography variant="h6" className="ConnexionTypo">
                  The Game
                </Typography>
              </Link>
            </Toolbar>
          </AppBar>
        </div>
      );
    }
    if (
      this.props.location.pathname === RouteBuilder.get("/") &&
      this.props.login === undefined
    ) {
      return (
        <div className="HomeTypo" id="myNavbarDark">
          <AppBar position="static" className="myNavbarDark">
            <Toolbar>
              <Link to={RouteBuilder.get("/")} className="linkHome HomeTypo">
                <Typography variant="h6" className="HomeTypo">
                  The Game
                </Typography>
              </Link>
              <div>
                <Link to={RouteBuilder.get("/login")} className="linkHome">
                  <Button color="inherit" className="HomeButton">
                    Connexion
                  </Button>
                </Link>
                <Link to={RouteBuilder.get("/login")} className="linkHome" visible="false">
                  <Button color="inherit" className="HomeButton">
                    Inscription
                  </Button>
                </Link>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      );
    }
    if (this.props.login !== undefined) {
      return (
        <div className="HomeTypo" id="myNavbarDark">
          <AppBar position="static" className="myNavbarDark">
            <Toolbar>
              <Link to={RouteBuilder.get("/")} className="linkHome HomeTypo">
                <Typography variant="h6" className="HomeTypo">
                  The Game
                </Typography>
              </Link>
              <Link to={RouteBuilder.get("/lobby")} className="linkHome" visible="false">
                <Button color="inherit" className="HomeButton">
                  Jouer
                </Button>
              </Link>
              <Account
                login={this.props.login}
                disconnect={this.disconnect}
                snackbar={this.changeSnackbar}
              />
            </Toolbar>
          </AppBar>
        </div>
      );
    } else {
      return (
        <div className="HomeTypo" id="myNavbarDark">
          <AppBar position="static" className="myNavbarDark">
            <Toolbar>
              <Link to={RouteBuilder.get("/")} className="linkHome ConnexionTypo">
                <Typography variant="h6" className="ConnexionTypo">
                  The Game
                </Typography>
              </Link>
            </Toolbar>
          </AppBar>
        </div>
      );
    }
  }
}

export default withRouter(withSnackbar(Navbar));
