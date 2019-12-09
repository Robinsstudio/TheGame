import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home/Home";
import NavBar from "./components/MyNavbar/Navbar";
import Connexion from "./components/ConnexionPage/ConnexionPage";
import Lobby from "./components/LobbyPage/LobbyPage";
import Profile from "./components/MyNavbar/Account/Profile/Profile";
import Settings from "./components/MyNavbar/Account/Settings";
import Game from "./components/LobbyPage/Game";
import Request from './js/request.js';
class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      id : "",
      login : undefined,
      mail : undefined
    }
  }
  
  componentDidMount(){
    new Request('/api/authentication')
    .get()
    .send()
    .then(res=>{if(res.ok)return res.json(res);return res.text()})
    .then(res=>{this.setState({login : res.login,id : res.id,mail : res.mail});})
    .catch(err=>this.setState({id:undefined}));
  }

  disconnect(){
    this.setState({login : undefined, id : undefined,mail : undefined});
  }

  render(){
    console.log(this.state);
    return (
      <Router>
        <div className="App">
          <NavBar onDisconnect={()=>this.disconnect()} login={this.state.login}></NavBar>
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute test={this.state.id === undefined} props={{onRequestReceived:({id,login,mail})=>this.setState({id : id, login : login,mail : mail})}} component={Connexion} path="/login"/>
            <PrivateRoute path="/lobby" test={this.state.id !== undefined} component={Lobby} />
            <PrivateRoute test={this.state.id !== undefined} props={{onRequestReceived:({login,mail})=>this.setState({login : login,mail : mail}),disconnect:()=>this.disconnect(),login : this.state.login,mail : this.state.mail}} component={Profile} path="/profile"/>
            <PrivateRoute test={this.state.id !== undefined} component={Settings} path="/settings"/>
            <PrivateRoute test={this.state.id !== undefined} props={{login : this.state.login,mail : this.state.mail}} component={Game} path="/game"/>
          </Switch>
        </div>
      </Router>
    );
  }
}

const PrivateRoute = ({component: Component, props, test, ...rest}) => {
  return ((test)?
      <Route {...rest} render={() => (
              <Component {...props} />
      )} />
      :
      <Redirect to="/"/>
  );
};
//<Connexion onRequestReceived={({id,login})=>this.setState({id : id, login : login})}/>


//const PrivateRoute = ({component : Component,...rest})=> (<Route {...rest} render={()=>(<Component/>)}/>);

export default App;
