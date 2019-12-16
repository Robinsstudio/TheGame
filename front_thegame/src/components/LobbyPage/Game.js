import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import utils from "./utils.js";
import Request from "../../js/request";

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId : undefined,
      playerLogin : undefined
    };
    this.joinGame = this.joinGame.bind(this);
  }

  componentDidMount() {
    let searchParams = window.location.search;
    let urlSearchParams = new URLSearchParams(searchParams);
    if(urlSearchParams.has("id")){
      this.setState({gameId:urlSearchParams.get("id")})
    }
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  componentDidUpdate(){
    if(this.props.login !== undefined && this.state.playerLogin === undefined){
      this.setState({playerLogin : this.props.login});
    }
    if(this.state.playerLogin !== undefined && this.state.gameId !== undefined){
      this.joinGame();
    }
  }

  joinGame() {
    new Request("/api/game/" + this.state.gameId)
      .put()
      .body({})
      .send()
      .then(res =>{ if(res.ok) return res.json(res); return res.text()})
      .then(res => console.log(res))
      .then(res=> {this.interval = setInterval(() => this.getGameInfo(), 3000)})
      //.then(utils.init())
      .catch(err => console.log(err));
  }

  getGameInfo(){
    new Request("/api/game/" + this.state.gameId + "/" )
      .get()
      .send()
      .then(res =>{ if(res.ok) return res.json(res); return res.text()})
      .then(res => console.log(res))
      //.then(utils.init())
      .catch(err => console.log(err));
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Button style={{ fontSize: "20px" }} color="primary" id="buttonEndTurn">
          Passer mon tour
        </Button>
        <div id="card-table"></div>
      </div>
    );
  }
}
