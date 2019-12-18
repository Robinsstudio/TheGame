import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import utils from "./utils.js";
import Request from "../../js/request";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";
export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
<<<<<<< HEAD
      gameId: undefined,
      playerId: undefined,
      ready: undefined,
      joined: false,
      players: [],
      piles: [],
      game: "waitingPlayers",
      nowPlaying: false,
      version: 0
=======
      gameId : undefined,
      playerId : undefined,
      ready : undefined,
      joined : false,
      players : [],
      game : "waitingPlayers",
      nowPlaying : false,
      version : 0
>>>>>>> 97b985cffbd3c67c9b3a8e1d941e76b6df0667ac
    };
    this.piles=[];
    this.players = {};
    this.joinGame = this.joinGame.bind(this);
    this.getGameInfo = this.getGameInfo.bind(this);
    this.playerIsReady = this.playerIsReady.bind(this);
    this.addPlayerLogin = this.addPlayerLogin.bind(this);
    this.whereToPlayCard = this.whereToPlayCard.bind(this);
    this.playCard = this.playCard.bind(this);
  }

  componentDidMount() {
    let searchParams = window.location.search;
    let urlSearchParams = new URLSearchParams(searchParams);
    if (urlSearchParams.has("id")) {
      this.setState({ gameId: urlSearchParams.get("id") });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /*   shouldComponentUpdate(nextProps, nextState) {
    return this.state!==nextState && this.props !== nextProps;
  } */

  componentDidUpdate(prevProps, prevState) {
    if (this.props.id !== "" && this.state.playerId === undefined) {
      this.setState({ playerId: this.props.id });
    }
    if (
      this.state.playerId !== undefined &&
      this.state.gameId !== undefined &&
      !this.state.joined
    ) {
      this.joinGame();
    }
<<<<<<< HEAD
    if (prevState.game === "waitingPlayers" && this.state.game === "playing") {
      utils.init(
        this.state.players.map(ele => ele._id.toString()),
        this.state.piles
      );
=======
    if(prevState.game === "waitingPlayers" && this.state.game === "playing"){
      utils.init(this.state.playerId,this.state.players.map(ele=>ele._id.toString()),this.piles);
>>>>>>> 97b985cffbd3c67c9b3a8e1d941e76b6df0667ac
    }
  }

  playCard(cardValue, pileId) {
    return new Request("/api/game/" + this.state.gameId + "/cartes")
      .put()
      .body({ cardValue: cardValue, pileId: pileId })
      .send()
      .then(res => {
        if (res.ok) return res.json();
        return res.text().then(err => {
          throw new Error(err);
        });
      });
  }

  whereToPlayCard(cardValue) {
    return new Request(
      "/api/game/" + this.state.gameId + "/cartes/where/" + cardValue
    )
      .get()
      .send()
      .then(res => {
        if (res.ok) return res.json();
        return res.text().then(err => {
          throw new Error(err);
        });
      });
  }

  joinGame() {
    new Request("/api/game/" + this.state.gameId)
      .put()
      .body({})
      .send()
      .then(res => {
        if (res.ok) return res.json(res);
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .then(res => console.log(res))
      .then(res => {
        this.interval = setInterval(() => this.getGameInfo(), 3000);
        this.setState({ joined: true });
        this.getGameInfo();
      })
      //.then(utils.init())
      .catch(err => console.log(err));
  }

  playerEndTurn() {
    new Request("/api/game/" + this.state.gameId + "/fintour")
      .put()
      .send()
      .then(res => {
        if (res.ok) return res;
        return res.text().then(err => {
          throw new Error(err);
        });
      })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

<<<<<<< HEAD
  getGameInfo() {
=======
  runActions(actions){
    for( let action of actions){
      console.log(action);
      if(action.type==="playCard"){
        utils.putCard(action.details.who,action.details.card.value,action.details.pile);
      }
      else if(action.type==="drawCard"){
        utils.drawCard(action.details.who,action.details.card.value);
      }
    }
  }

  getGameInfo(){
>>>>>>> 97b985cffbd3c67c9b3a8e1d941e76b6df0667ac
    new Request("/api/game/" + this.state.gameId + "/" + this.state.version)
      .get()
      .send()
      .then(res => {
<<<<<<< HEAD
        if (res.ok) return res.json(res);
        return res.text();
      })
      .then(res => {
        let ready = res.players.filter(
          ele => ele._id.toString() === this.state.playerId
        )[0];
        console.log(ready);
        if (ready !== undefined) ready = ready.ready;
        else ready = false;
        this.setState({
          piles: res.piles,
          game: res.status,
          version: res.version,
          nowPlaying: res.nowPlaying === this.state.playerId,
          players: res.players,
          ready: ready
        });
        console.log(res);
        return res;
      })
      .then(res => {
        for (let action of res.actions) {
          console.log(action);
          if (action.type === "playCard") {
            utils.putCard(
              action.details.who,
              action.details.card.value,
              action.details.pile
            );
          } else if (action.type === "drawCard") {
            utils.drawCard(action.details.who, action.details.card.value);
          }
        }
      })
=======
        let newState = {};
        let ready = res.players.filter(ele=>ele._id.toString() === this.state.playerId)[0];
        if(ready !== undefined)
          ready=ready.ready;
        else
          ready = false;
        if(ready !== this.state.ready)
          newState.ready = ready;
        this.piles=res.piles;
        if(this.state.game !== res.status)
          newState.game = res.status;
        if(this.state.version !== res.version)
          newState.version = res.version;
        if(this.state.nowPlaying !== (res.nowPlaying===this.state.playerId))
          newState.nowPlaying = (res.nowPlaying===this.state.playerId);
        if(this.state.game === "waitingPlayers")
          newState.players = res.players;
        if(this.state.ready !== ready)
          newState.ready = ready;
        if(Object.keys(newState).length > 0)
          this.setState(newState);
        //if(this.state.piles !== res.piles || this.state.game !== res.status || this.state.version !== res.version || this.state.nowPlaying !== (res.nowPlaying===this.state.playerId) || this.state.players !== res.players || this.state.ready !== res.ready)
        //  this.setState({piles:res.piles,game:res.status,version : res.version,nowPlaying:res.nowPlaying===this.state.playerId,players: res.players,ready:ready})
        console.log(res)
        this.runActions(res.actions)
        return res;
      })
>>>>>>> 97b985cffbd3c67c9b3a8e1d941e76b6df0667ac
      //.then(utils.init())
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

  render() {
    console.log(this.state);
    return (
      <div>
        {this.state.nowPlaying && (
          <Button
            style={{ fontSize: "20px" }}
            color="primary"
            onClick={() => this.playerEndTurn()}
          >
            Passer mon tour
          </Button>
        )}
        {this.state.ready === false && this.state.game === "waitingPlayers" && (
          <Button
            style={{ fontSize: "20px" }}
            color="primary"
            onClick={() => this.playerIsReady()}
          >
            Prêt ?
          </Button>
        )}
        {this.state.game === "waitingPlayers" || <div id="card-table"></div>}
        {this.state.game === "waitingPlayers" && (
          <Table
            style={{ maxWidth: "600px", margin: "auto" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Joueur</TableCell>
                <TableCell align="right">Prêts ?</TableCell>
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
                      <DoneIcon fontSize="large" style={{ color: "green" }} />
                    ) : (
                      <CloseIcon fontSize="large" style={{ color: "red" }} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  }
}
