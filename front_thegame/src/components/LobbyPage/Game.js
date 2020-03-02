import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import utils from "./utils.js";
import Request from "../../js/request";
// Tableau
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// Icons
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withSnackbar } from "notistack";
import RouteBuilder from "../../js/RouteBuilder";
import { Redirect } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import "./Game.css";

let cardsPile = 98;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: undefined,
      playerId: undefined,
      ready: undefined,
      joined: false,
      players: [],
      game: "waitingPlayers",
      nowPlaying: undefined,
      version: 0,
      message : ""
    };
    this.piles = [];
    this.players = {};
    this.joinGame = this.joinGame.bind(this);
    this.getGameInfo = this.getGameInfo.bind(this);
    this.playerIsReady = this.playerIsReady.bind(this);
    this.addPlayerLogin = this.addPlayerLogin.bind(this);
    this.whereToPlayCard = this.whereToPlayCard.bind(this);
    this.playCard = this.playCard.bind(this);
    this.changeSnackbar = this.changeSnackbar.bind(this);
    this.playerQuit = this.playerQuit.bind(this);
    this.runActions = this.runActions.bind(this);
  }

  componentDidMount() {
    Notification.requestPermission();
    let searchParams = window.location.search;
    let urlSearchParams = new URLSearchParams(searchParams);
    if (urlSearchParams.has("id")) {
      this.setState({ gameId: urlSearchParams.get("id") });
    }
  }

  ////////////////////////////////////////////////////////////
  ///// Fonction pour ouvrir les snackbars
  changeSnackbar(message, snackType = "info", duration = 5000) {
    this.props.enqueueSnackbar(message, {
      variant: snackType,
      autoHideDuration: duration
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.id !== "" && this.state.playerId === undefined) {
      this.setState({ playerId: this.props.id });
    }
    if (
      prevState.nowPlaying !== undefined &&
      prevState.nowPlaying !== this.state.nowPlaying
    ) {
      this.changeSnackbar(
        `Fin de tour de ${this.players[`${prevState.nowPlaying}`]}`,
        "info",
        2000
      );
      if (
        this.state.playerId === this.state.nowPlaying &&
        document.visibilityState !== "visible" &&
        Notification.permission === "granted"
      ) {
        new Notification("C'est à votre tour de jouer");
      }
    }
    if (
      this.state.playerId !== undefined &&
      this.state.gameId !== undefined &&
      !this.state.joined
    ) {
      this.joinGame();
    }
    if (!prevState.joined && this.state.joined) {
      utils.init(this.piles, this.whereToPlayCard, this.playCard);
    }
    if (
      prevState.game === "waitingPlayers" &&
      this.state.game !== "waitingPlayers"
    ) {
      utils.start(
        this.state.playerId,
        this.state.players.map(ele => ele._id.toString())
      );
    }
  }

  sendMessage() {
    return new Request("/api/game/" + this.state.gameId + "/message")
      .put()
      .body({ message: this.state.message })
      .send()
      .then(res => {
        this.setState({message:""});
        if (res.ok) return "";
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .catch(err => this.changeSnackbar(err.message, "error"));
  }


  playCard(cardValue, pileId) {
    return new Request("/api/game/" + this.state.gameId + "/card")
      .put()
      .body({ cardValue: cardValue, pileId: pileId })
      .send()
      .then(res => {
        if (res.ok) return res.json();
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .catch(err => this.changeSnackbar(err.message, "error"));
  }

  whereToPlayCard(cardValue) {
    return new Request(
      "/api/game/" + this.state.gameId + "/card?cardValue=" + cardValue
    )
      .get()
      .send()
      .then(res => {
        if (res.ok) return res.json();
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .then(res => {
        if (res.result === undefined) return [];
        return res.result;
      })
      .catch(err => this.changeSnackbar(err.message, "error"));
  }

  joinGame() {
    new Request("/api/game/" + this.state.gameId + "/player")
      .put()
      .body({})
      .send()
      .then(res => {
        if (res.ok) return res.json(res);
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .then(res => {
        this.interval = setInterval(() => this.getGameInfo(), 500);
        if (res.piles !== undefined) this.piles = res.piles;
        this.setState({ players: res.players, joined: true });
      })
      .catch(err => this.changeSnackbar(err.message, "error"));
  }

  playerEndTurn() {
    new Request("/api/game/" + this.state.gameId + "/tour")
      .put()
      .send()
      .then(res => {
        if (res.ok) return res;
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .catch(err => this.changeSnackbar(err.message, "error"));
  }

  runActions(actions) {
    for (let action of actions) {
      if (action.type === "playCard") {
        utils.putCard(
          action.details.who,
          action.details.card.value,
          action.details.pile
        );
      } else if (action.type === "drawCard") {
        utils.drawCard(
          action.details.who,
          action.details.card.value,
          this.state.players.length
        );
      } else if (action.type === "game over") {
        utils.CreateEndDiv();
        this.changeSnackbar("La partie est perdue !", "warning");
        window.launchAnimation("PARTIE PERDUE");
      } else if (action.type === "game won") {
        utils.CreateEndDiv();
        this.changeSnackbar("La partie est gagnée !", "success");
        window.launchAnimation("PARTIE GAGNEE");
      } else if (action.type === "message") {
        this.changeSnackbar(
          `${this.players[`${action.details.who}`]} : ${action.details.info}`,
          "info"
        );
      }
    }
  }

  displayMessages(messages) {
    for (let message of messages) {
      this.changeSnackbar(
        `${this.players[`${message.who}`]} : ${message.message}`,
        "alert",
        2000
      );
    }
  }

  getGameInfo() {
    new Request(
      "/api/game/" +
        this.state.gameId +
        "/actions?version=" +
        this.state.version
    )
      .get()
      .send()
      .then(res => {
        if (res.ok) return res.json();
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .then(res => {
        let newState = {};
        let ready = res.players.filter(
          ele => ele._id.toString() === this.state.playerId
        )[0];
        if (ready !== undefined) ready = ready.ready;
        else ready = false;
        if (ready !== this.state.ready) {
          newState.ready = ready;
        }
        if (this.state.game === "waitingPlayers") {
          newState.players = res.players;
        }
        if (this.state.version !== res.version) {
          this.piles = res.piles;
          newState.game = res.status;
          newState.version = res.version;
          newState.nowPlaying = res.nowPlaying;
          newState.ready = ready;
          this.setState({
            ready: ready,
            game: res.status,
            version: res.version,
            nomPlaying: res.nowPlaying
          });
        }
        this.runActions(res.actions);
        this.displayMessages(res.messages);
        if (Object.keys(newState).length > 0) {
          this.setState(newState);
          if (cardsPile !== res.deckPile && res.status === "playing") {
            cardsPile = res.deckPile;
            this.changeSnackbar(
              "Il reste " + cardsPile + " cartes dans la pile.",
              "info"
            );
          }
        }
        return res;
      })
      .catch(err => console.log(err));
  }
  addPlayerLogin(id) {
    new Request("/api/player/" + id + "/login")
      .get()
      .send()
      .then(res => {
        if (res.ok) return res.json();
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .then(res => (this.players[`${id}`] = res.login))
      .catch(err => console.log(err));
    return <CircularProgress />;
  }
  playerIsReady() {
    new Request("/api/game/" + this.state.gameId + "/ready")
      .put()
      .send()
      .then(res => {
        if (res.ok) return res;
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .then(res => this.setState({ ready: true }))
      .catch(err => console.log(err));
  }
  ///////////////////////////////////////////////////////////
  /// Fonction qui envoi une requête pour que le joueur quitte la partie (avant le début)
  playerQuit() {
    new Request("/api/game/" + this.state.gameId + "/player")
      .delete()
      .send()
      .then(res => {
        if (res.ok) return res;
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .then(res => this.setState({ gameId: "" }))
      .catch(err => console.log(err));
  }

  render() {
    let redirect;
    if (this.state.gameId === "")
      redirect = <Redirect to={RouteBuilder.get("/lobby")} />;
    return (
      <div className="parentContainer">
        <div className="gameContainer">
          <div className="buttonHeader">
            {this.state.game === "waitingPlayers" && (
              <Table
                style={{ maxWidth: "600px", margin: "auto" }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Joueur(s)</TableCell>
                    <TableCell align="right">Prêt(s)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.players.map(player => (
                    <TableRow key={player._id}>
                      <TableCell component="th" scope="row">
                        {this.players[`${player._id}`]
                          ? this.players[`${player._id}`]
                          : this.addPlayerLogin(player._id)}
                      </TableCell>
                      <TableCell align="right">
                        {player.ready ? (
                          <DoneIcon
                            fontSize="large"
                            style={{ color: "green" }}
                          />
                        ) : (
                          <CloseIcon
                            fontSize="large"
                            style={{ color: "red" }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="buttonLaunchGame">
              {redirect}
              {this.state.ready === false &&
                this.state.game === "waitingPlayers" && (
                  <Button
                    color="secondary"
                    className="buttonQuitGame"
                    onClick={() => this.playerQuit()}
                  >
                    Quitter la partie
                  </Button>
                )}
              {this.state.ready === false &&
                this.state.players.length > 1 &&
                this.state.game === "waitingPlayers" && (
                  <Button
                    color="primary"
                    className="buttonReady"
                    onClick={() => this.playerIsReady()}
                  >
                    Prêt
                  </Button>
                )}
              {this.state.ready === false &&
                this.state.players.length === 1 &&
                this.state.game === "waitingPlayers" && (
                  <Button
                    color="primary"
                    className="buttonReady"
                    onClick={() => this.playerIsReady()}
                  >
                    Lancer la partie
                  </Button>
                )}
              {this.state.ready === true &&
                this.state.players.length > 1 &&
                this.state.game === "waitingPlayers" && (
                  <Button
                    color="primary"
                    className="buttonReady"
                    onClick={() => this.playerIsReady()}
                  >
                    Pas Prêt
                  </Button>
                )}
            </div>
          </div>
          <div key="game" id="card-table" className="tableVisible">
            {this.state.game === "playing" && (
              <div className="containerEndTurn">
                {this.state.nowPlaying === this.state.playerId ? (
                  <Button
                    color="primary"
                    className="buttonEndTurn"
                    onClick={() => this.playerEndTurn()}
                  >
                    Finir mon tour
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="buttonEndTurn"
                    onClick={() => this.playerEndTurn()}
                  >
                    Ce n'est pas votre tour
                  </Button>
                )}
              </div>
            )}
          </div>
          {this.state.game === "playing" && this.state.players.filter(ele=>ele._id===this.state.playerId).length !== 0 && (
            <form className="chat" onSubmit={(e)=>{e.preventDefault();this.sendMessage();}}>
              <input placeholder="Ecrivez un message ..." className="chatInput" value={this.state.message} onChange={(e)=>this.setState({message:e.target.value})}/>
              <IconButton disabled={this.state.message===""} type="submit"><SendIcon color={(this.state.message==="")?"disabled":"primary"} fontSize="large"/></IconButton>
            </form>
        )}
        </div>
        {this.state.version > 0 && this.state.game !== "playing" && (
          <div className="buttonLaunchGame">
            <Button
              color="secondary"
              id="gameEnded"
              className="displayNone"
              onClick={() => this.playerQuit()}
            >
              Retourner à l'accueil
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withSnackbar(Game);
