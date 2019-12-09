import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import utils from "./utils.js";
import Request from "../../js/request";

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idGame: ""
    };
    this.joinGame = this.joinGame.bind(this);
  }

  componentDidMount() {
    new Request("/api/game")
      .post()
      .body({})
      .send()
      .then(res => res.json(res))
      .then(res => this.setState({ idGame: res.id }))
      .then(() => this.joinGame(this.state.idGame))
      .catch(err => console.log(err));
  }

  joinGame(id) {
    new Request("/api/game/" + id)
      .put()
      .body({})
      .send()
      .then(res => res.json(res))
      .then(res => console.log(res))
      .then(utils.init())
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <Button id="deal" style={{ fontSize: "20px" }} color="primary">
          Commencer la partie
        </Button>
        <Button style={{ fontSize: "20px" }} color="primary" id="buttonEndTurn">
          Passer mon tour
        </Button>
        <div id="card-table"></div>
      </div>
    );
  }
}
