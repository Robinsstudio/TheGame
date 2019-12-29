import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import "./LobbyPage.css";
import ButtonSection from "./ButtonSection";
import JoinGame from "./JoinGame";
import HistoryGame from "./HistoryGame";
import Request from "./../../js/request.js";
export default class LobbyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      idGame: undefined,
      gameSelected: false,
      JoinGame: [],
      JoinGameLoad: false,
      HistoryGame: [],
      HistoryGameLoad: false
    };
    this.selectGame = this.selectGame.bind(this);
    this.selectIdGame = this.selectIdGame.bind(this);
  }
  componentDidMount() {
    new Request("/api/game/")
      .get()
      .send()
      .then(res => {
        if (res.ok) return res.json();
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .then(res =>
        this.setState({ JoinGame: res, JoinGameLoad: true }, console.log(res))
      )
      .catch(err => console.log(err));

    new Request("/api/playedgame/")
      .get()
      .send()
      .then(res => {
        if (res.ok) return res.json();
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .then(res =>
        this.setState(
          { HistoryGame: res, HistoryGameLoad: true },
          console.log(res)
        )
      )
      .catch(err => console.log(err));
  }

  selectGame(bool) {
    this.setState({
      gameSelected: bool
    });
  }

  selectIdGame(id) {
    this.setState({
      idGame: id
    });
  }

  render() {
    let JoinGameComponent;
    let HistoryGameComponent;

    if (this.state.JoinGameLoad === true) {
      JoinGameComponent = (
        <JoinGame
          data={this.state.JoinGame}
          selectGame={bool => this.selectGame(bool)}
          selectIdGame={id => this.selectIdGame(id)}
        ></JoinGame>
      );
    }

    if (this.state.HistoryGameLoad === true) {
      HistoryGameComponent = (
        <HistoryGame
          data={this.state.HistoryGame}
          selectGame={bool => this.selectGame(bool)}
          selectIdGame={id => this.selectIdGame(id)}
        ></HistoryGame>
      );
    }
    return (
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} className="gridButtonSection">
            <ButtonSection
              gameSelected={this.state.gameSelected}
              idGame={this.state.idGame}
            ></ButtonSection>
          </Grid>
          <Grid item xs={12} sm={6}>
            <h3>Parties en attente :</h3>
            {JoinGameComponent}
          </Grid>
          <Grid item xs={12} sm={6}>
            <h3>Votre historique de parties :</h3>
            {HistoryGameComponent}
          </Grid>
        </Grid>
      </Container>
    );
  }
}
