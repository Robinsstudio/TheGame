import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import utils from "./utils.js";
import Request from "../../js/request";

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId : undefined,
      playerId : undefined,
      ready : false,
      joined : false,
      game : "waiting",
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
    if(this.props.id !== undefined && this.state.playerId === undefined){
      this.setState({playerId : this.props.id});
    }
    if(this.state.playerId !== undefined && this.state.gameId !== undefined && !this.state.joined){
      this.joinGame();
    }
    if(prevState.game === "waiting" && this.state.game === "playing"){
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
        this.setState({game:res.status,version : res.version,nowPlaying:res.nowPlaying===this.state.id})
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
    return (
      <div>
        {this.state.nowPlaying && <Button style={{ fontSize: "20px" }} color="primary" onClick={()=>this.playerEndTurn()}>
          Passer mon tour
        </Button>
        }
        {this.state.ready || <Button style={{ fontSize: "20px" }} color="primary"  onClick={()=>this.playerIsReady()}>
          Prêt ?
        </Button>
        }
        {this.state.game === "waiting" || <div id="card-table"></div>}
      </div>
    );
  }
}
