import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import init from "./example.js";
export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    init();
  }

  endTurn() {
    init.endTurn();
  }

  render() {
    return (
      <div>
        <Button id="deal" style={{ fontSize: "20px" }} color="primary">
          Commencer la partie
        </Button>
        <Button
          style={{ fontSize: "20px" }}
          color="primary"
          onClick={this.endTurn}
        >
          Passer mon tour
        </Button>
        <div id="card-table"></div>
      </div>
    );
  }
}
