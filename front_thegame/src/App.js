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
      id : undefined,
      login : undefined
    }
  }
  
  componentDidMount(){
    new Request('/api/authentication')
    .get()
    .send()
    .then(res=>res.json(res))
    .then(res=>{this.setState({login : res.login,id : res.id});});
  }

  render(){
    console.log(this.state);
    return (
      <Router>
        <div className="App">
          <NavBar onDisconnect={()=>this.setState({login : undefined, id : undefined})} login={this.state.login}></NavBar>
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute test={this.state.id === undefined} props={{onRequestReceived:({id,login})=>this.setState({id : id, login : login})}} component={Connexion} path="/login"/>
            <PrivateRoute path="/lobby" test={this.state.id !== undefined} component={Lobby} />
            <Route path="/profile" component={Profile}></Route>
            <Route path="/settings" component={Settings}></Route>
            <Route path="/game" component={Game}></Route>
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
