import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Request from "../../js/request";
import {
  Redirect
} from "react-router-dom";
export default class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idGame: undefined
    };
    this.createGame = this.createGame.bind(this);
  }

  createGame() {
    new Request("/api/game")
      .post()
      .body({name:"Jeu"})
      .send()
      .then(res => res.json(res))
      .then(res => this.setState({ idGame: res.id }))
      .catch(err => console.log(err));
  }

  render() {
    let redirect;
    if(this.state.idGame!==undefined)
      redirect=(<Redirect to={'/game?id='+this.state.idGame}/>)
    return (
      <div>
        {redirect}
        <Button
          id="deal"
          style={{ fontSize: "20px" }}
          color="primary"
          onClick={this.createGame}
        >
          Commencer la partie
        </Button>
      </div>
    );
  }
}
