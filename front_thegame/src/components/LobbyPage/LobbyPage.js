import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import "./LobbyPage.css";
import ButtonSection from "./ButtonSection";
import JoinGame from "./JoinGame";
import HistoryGame from "./HistoryGame";
import Request from "./../../js/request.js";
import { withSnackbar } from "notistack";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";

class LobbyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      idGame: undefined,
      gameSelected: false,
      JoinGame: [],
      HistoryGame: [],
    };
    this.selectGame = this.selectGame.bind(this);
    this.selectIdGame = this.selectIdGame.bind(this);
    this.fetchMyGames = this.fetchMyGames.bind(this);
    this.fetchPublicGames = this.fetchPublicGames.bind(this);
    this.changeSnackbar = this.changeSnackbar.bind(this);
    this.deleteAllGames = this.deleteAllGames.bind(this);
  }
  componentDidMount() {
    this.fetchMyGames();
    this.fetchPublicGames();
  }
  ////////////////////////////////////////////////////////////
  ///// Fonction pour ouvrir les snackbars
  changeSnackbar(message, snackType = "info", duration = 4000) {
    this.props.enqueueSnackbar(message, {
      variant: snackType,
      autoHideDuration: duration,
    });
  }
  //////////////////////////////////////////////////////////////////////
  // Fonction pour faire une requête pour récupérer les parties en publiques
  fetchPublicGames() {
    this.changeSnackbar("Chargement des parties", "info", 2000);
    new Request("/api/games/playable")
      .get()
      .send()
      .then((res) => {
        if (res.ok) return res.json();
        return res.text().then((err) => {
          throw new Error(err);
        });
      })
      .then((res) => this.setState({ JoinGame: res }))
      .catch((err) => console.log(err));
  }
  //////////////////////////////////////////////////////////////////////
  // Fonction pour faire une réqûete et récupérer l'historique des parties du joueur
  fetchMyGames() {
    new Request("/api/games/ended")
      .get()
      .send()
      .then((res) => {
        if (res.ok) return res.json();
        return res.text().then((err) => {
          throw new Error(err);
        });
      })
      .then((res) => this.setState({ HistoryGame: res }))
      .catch((err) => console.log(err));
  }
  //////////////////////////////////////////////////////////////////////
  // fonction pour dire si une partie a été sélectionnée dans le tableau
  selectGame(bool) {
    this.setState({
      gameSelected: bool,
    });
  }
  //////////////////////////////////////////////////////////////////////
  // fonction pour modifier l'id d'une game sélectionnée dans un tableau
  selectIdGame(id) {
    this.setState({
      idGame: id,
    });
  }
  //////////////////////////////////////////////////////////////////////
  // fonction pour supprimer toutes les parties dans la base de données
  deleteAllGames() {
    this.changeSnackbar("Suppression de toutes les parties", "info", 2000);
    new Request("/api/games/deleteAll")
      .delete()
      .send()
      .then((res) => {
        if (res.ok) {
          this.changeSnackbar(
            "Toutes les parties ont été supprimées",
            "success",
            2000
          );
          this.fetchMyGames();
          this.fetchPublicGames();
          return res.json();
        }
        return res.text().then((err) => {
          throw new Error(err);
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    let JoinGameComponent;
    let HistoryGameComponent;

    HistoryGameComponent = (
      <HistoryGame
        data={this.state.HistoryGame}
        fetch={() => this.fetchMyGames()}
      ></HistoryGame>
    );

    JoinGameComponent = (
      <JoinGame
        data={this.state.JoinGame}
        selectGame={(bool) => this.selectGame(bool)}
        selectIdGame={(id) => this.selectIdGame(id)}
        fetch={() => this.fetchPublicGames()}
      ></JoinGame>
    );

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
        <Grid container spacing={3}>
          <Grid item xs={12} className="gridButtonSection">
            <Button
              className="DeleteButton"
              onClick={() => this.deleteAllGames()}
            >
              <DeleteIcon className="lobbyIcon"></DeleteIcon> Supprimer toutes
              les parties
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withSnackbar(LobbyPage);
