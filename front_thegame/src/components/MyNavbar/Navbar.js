import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link, withRouter } from "react-router-dom";
import "./Navbar.css";
import Account from "./Account/Account";
import Request from "../../js/request.js";

class Navbar extends Component {
  constructor(props){
    super(props);
    this.disconnect = this.disconnect.bind(this);
  }

  disconnect(){
    new Request('/api/authentication')
    .delete()
    .send()
    .then(res=>{if(this.props.onDisconnect!==undefined)this.props.onDisconnect(res);});
  }

  render() {
    if (this.props.location.pathname === "/login") {
      return (
        <div className="HomeTypo" id="myNavbarDark">
          <AppBar position="static" className="myNavbarSilver" id="myNavbar">
            <Toolbar>
              <Link to={"/"} className="linkHome ConnexionTypo">
                <Typography variant="h6" className="ConnexionTypo">
                  The Game
                </Typography>
              </Link>
            </Toolbar>
          </AppBar>
        </div>
      );
    }
    if (this.props.location.pathname === "/" && this.props.login === undefined) {
      return (
        <div className="HomeTypo" id="myNavbarDark">
          <AppBar position="static" className="myNavbarDark">
            <Toolbar>
              <Link to={"/"} className="linkHome HomeTypo">
                <Typography variant="h6" className="HomeTypo">
                  The Game
                </Typography>
              </Link>
                <div>
                  <Link to={"/login"} className="linkHome">
                    <Button color="inherit" className="HomeButton">
                      Connexion
                    </Button>
                  </Link>
                  <Link to={"/login"} className="linkHome" visible="false">
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
    if (this.props.login !== undefined ) {
      return (
        <div className="HomeTypo" id="myNavbarDark">
          <AppBar position="static" className="myNavbarDark">
            <Toolbar>
              <Link to={"/"} className="linkHome HomeTypo">
                <Typography variant="h6" className="HomeTypo">
                  The Game
                </Typography>
              </Link>
              <Link to={"/lobby"} className="linkHome" visible="false">
                <Button color="inherit" className="HomeButton">
                    Jouer
                </Button>
              </Link>
              <Account login={this.props.login} disconnect={this.disconnect}/>
            </Toolbar>
          </AppBar>
        </div>
      );
    } else {
      return (
        <div className="HomeTypo" id="myNavbarDark">
          <AppBar position="static" className="myNavbarDark">
            <Toolbar>
              <Link to={"/"} className="linkHome ConnexionTypo">
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

export default withRouter(Navbar);
