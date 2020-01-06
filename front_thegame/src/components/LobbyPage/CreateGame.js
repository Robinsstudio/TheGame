import React, { Component } from "react";
import Request from "../../js/request";
import RouteBuilder from "../../js/RouteBuilder";
import { Redirect } from "react-router-dom";
import { withSnackbar } from "notistack";
// Container and button
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
// Input
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
// Divider & Switch
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
// CSS
import "./CreateGame.css";

const choixNbPiles = [
  {
    value: 2,
    label: "2 piles"
  },
  {
    value: 4,
    label: "4 piles"
  },
  {
    value: 6,
    label: "6 piles"
  }
];

class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idGame: undefined,
      nameGame: "Partie de The Game",
      nbPiles: 4,
      publicGame: true
    };
    this.createGame = this.createGame.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.pilesChange = this.pilesChange.bind(this);
    this.changeSwitch = this.changeSwitch.bind(this);
  }
  // Fonction qui créé la partie en faisant la requête au back
  createGame() {
    new Request("/api/game")
      .post()
      .body({ name: this.state.nameGame ,public : this.state.publicGame,nbPile : this.state.nbPiles})
      .send()
      .then(res => res.json(res))
      .then(res => this.setState({ idGame: res.id }))
      .catch(err => console.log(err));
  }
  // Change le nom de la partie
  nameChange(name) {
    this.setState({
      nameGame: name
    });
  }
  // Change le nombre de piles de la partie
  pilesChange(piles) {
    this.setState({
      nbPiles: piles
    });
  }
  // Définit si la partie sera publique ou privée
  changeSwitch() {
    this.setState({
      publicGame: !this.state.publicGame
    });
  }

  render() {
    let redirect;
    if (this.state.idGame !== undefined)
      redirect = <Redirect to={RouteBuilder.get("/game?id=" + this.state.idGame)} />;
    return (
      <Container maxWidth="lg">
        <Grid container spacing={3} className="gridProfile">
          <Grid item xs={3}></Grid>
          <Grid item xs={6} className="boxShadowProfile">
            <h3 className="h3Profile">Création d'une partie :</h3>

            <Divider />
            <form noValidate autoComplete="off" className="formMarginTop">
              <FormControl className="inputMarginCreate">
                <InputLabel
                  htmlFor="nom"
                  className="bigSizeProfile"
                  color="primary"
                >
                  Nom de la partie
                </InputLabel>
                <Input
                  id="nom"
                  className="bigSizeProfile widthInputProfile"
                  type="text"
                  value={this.state.nameGame}
                  color="primary"
                  onChange={evt => this.nameChange(evt.target.value)}
                />
              </FormControl>
              <div></div>

              <TextField
                id="select-piles"
                select
                label="Nombre de piles :"
                className="widthInputProfile inputMarginCreate"
                color="primary"
                value={this.state.nbPiles}
                onChange={evt => this.pilesChange(evt.target.value)}
              >
                {choixNbPiles.map(option => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    className="bigSizeProfile widthInputProfile"
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <div></div>

              <FormControlLabel
                className="inputMarginCreate bigSizeProfile"
                control={
                  <Switch
                    checked={this.state.publicGame}
                    onChange={this.changeSwitch}
                    value="public"
                    color="primary"
                  />
                }
                label={
                  this.state.publicGame === true
                    ? "Partie publique"
                    : "Partie privée"
                }
              />
              <div></div>
              <Divider style={{ marginBottom: "0.5em" }} />

              {redirect}
              <Button
                style={{ fontSize: "20px", marginTop: "12px" }}
                color="primary"
                onClick={this.createGame}
              >
                Créer la partie
              </Button>
            </form>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </Container>
    );
  }
}

export default withSnackbar(CreateGame);
