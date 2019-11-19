import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import NavBar from "./components/MyNavbar/Navbar";
import Connexion from "./components/ConnexionPage/ConnexionPage";
import Lobby from "./components/LobbyPage/LobbyPage";
import Profile from "./components/MyNavbar/Account/Profile/Profile";
import Settings from "./components/MyNavbar/Account/Settings";
import Game from "./components/LobbyPage/Game";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar></NavBar>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Connexion} />
          <Route path="/connected" component={Lobby} />
          <Route path="/profile" component={Profile}></Route>
          <Route path="/settings" component={Settings}></Route>
          <Route path="/game" component={Game}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
