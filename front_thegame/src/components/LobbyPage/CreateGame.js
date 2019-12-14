import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Request from "../../js/request";

export default class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idGame: ""
    };
    this.createGame = this.createGame.bind(this);
  }

  createGame() {
    new Request("/api/game")
      .post()
      .body({})
      .send()
      .then(res => res.json(res))
      .then(res => this.setState({ idGame: res.id }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
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
