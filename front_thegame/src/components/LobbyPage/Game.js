import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import utils from "./utils.js";
import Request from "../../js/request";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId : undefined,
      playerId : undefined,
      ready : false,
      joined : false,
      players : [],
      game : "waitingPlayers",
      nowPlaying : false,
      version : 0
    };
    this.joinGame = this.joinGame.bind(this);
    this.getGameInfo = this.getGameInfo.bind(this);
    this.playerIsReady = this.playerIsReady.bind(this);
  }

  componentDidMount() {
    let searchParams = window.location.search;
    let urlSearchParams = new URLSearchParams(searchParams);
    if(urlSearchParams.has("id")){
      this.setState({gameId:urlSearchParams.get("id")})
    }
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps,prevState){
    if(this.props.id !== "" && this.state.playerId === undefined){
      this.setState({playerId : this.props.id});
    }
    if(this.state.playerId !== undefined && this.state.gameId !== undefined && !this.state.joined){
      this.joinGame();
    }
    if(prevState.game === "waitingPlayers" && this.state.game === "playing"){
      utils.init()
    }
  }

  joinGame() {
    new Request("/api/game/" + this.state.gameId)
      .put()
      .body({})
      .send()
      .then(res =>{ if(res.ok) return res.json(res); return res.text().then(err=>{throw new Error(err)})})
      .then(res => console.log(res))
      .then(res=> {this.interval = setInterval(() => this.getGameInfo(), 3000);this.setState({joined:true})})
      //.then(utils.init())
      .catch(err => console.log(err));
  }

  playerEndTurn(){
    new Request("/api/game/"+this.state.gameId + "/fintour")
    .put()
    .send()
    .then(res=>{if(res.ok)return res; return res.text().then(err=>{throw new Error(err)})})
    .then(res=>console.log(res))
    .catch(err=>console.log(err));
  }

  getGameInfo(){
    new Request("/api/game/" + this.state.gameId + "/" + this.state.version)
      .get()
      .send()
      .then(res =>{ if(res.ok) return res.json(res); return res.text()})
      .then(res => {
        this.setState({game:res.status,version : res.version,nowPlaying:res.nowPlaying===this.state.playerId,players: res.players})
        console.log(res)
      })
      //.then(utils.init())
      .catch(err => console.log(err));
  }

  playerIsReady(){
      new Request("/api/game/"+this.state.gameId+"/ready")
      .put()
      .send()
      .then(res=>{if(res.ok)return res; return res.text()})
      .then(res=>this.setState({ready:true}))
      .catch(err=>console.log(err));
  }

  render() {
    console.log(this.state);
    return (
      <div>
        {this.state.nowPlaying && <Button style={{ fontSize: "20px" }} color="primary" onClick={()=>this.playerEndTurn()}>
          Passer mon tour
        </Button>
        }
        {this.state.ready || <Button style={{ fontSize: "20px"}} color="primary"  onClick={()=>this.playerIsReady()}>
          Prêt ?
        </Button>
        }
        {this.state.game === "waitingPlayers" || <div id="card-table"></div>}
        {this.state.game === "waitingPlayers" && this.state.players.length >0 && 
          <Table style={{maxWidth : "600px",margin : "auto"}}aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id joueur</TableCell>
                <TableCell align="right">Prêts ?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.players.map(player => (
                <TableRow key={player._id}>
                  <TableCell component="th" scope="row">
                    {player._id}
                  </TableCell>
                  <TableCell align="right">{player.ready?
                    <DoneIcon fontSize="large" style={{color: "green"}}/>
                    :<CloseIcon fontSize="large" style={{color: "red"}}/>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
      </div>
    );
  }
}
