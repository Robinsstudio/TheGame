import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import "./LobbyPage.css";
import ButtonSection from "./ButtonSection";
import JoinGame from "./JoinGame";
import HistoryGame from "./HistoryGame";

export default class LobbyPage extends Component {
  render() {
    return (
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} className="gridButtonSection">
            <ButtonSection></ButtonSection>
          </Grid>
          <Grid item xs={12} sm={6}>
            <h3>Parties en attente :</h3>
            <JoinGame></JoinGame>
          </Grid>
          <Grid item xs={12} sm={6}>
            <h3>Votre historique de parties :</h3>
            <HistoryGame></HistoryGame>
          </Grid>
        </Grid>
      </Container>
    );
  }
}
