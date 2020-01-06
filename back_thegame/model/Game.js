const mongoose = require("mongoose");
const Card = require("./Card");
const Pile = require("./Pile");
const Action = require("./Action");
const Player = require("./Player.js");
//-----Schéma du jeu -----//

const GameSchema = new mongoose.Schema({
  name: String,
  players: [
    {
      _id: String,
      login: String,
      hand: [Card.schema],
      ready: {
        type: Boolean,
        default: false
      }
    }
  ],
  deckPile: [Card.schema],
  piles: [Pile.schema],
  nowPlaying: String, //Le joueur du tour
  actions: [Action.schema],
  public : {
    type : Boolean,
    default : true
  },
  status: {
    type: String,
    enum: ["playing", "waitingPlayers", "ended", "won", "game over"],
    default: "waitingPlayers"
  }
});

//------Méthodes utilisées par l'objet Game ------//

let shuffle = function(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

GameSchema.statics.checkGameOver = function(game, playerId){
  if (
    Game.hasToPlayAgain(game, playerId) &&
    !Game.canPlayAgain(game, playerId)
  )
    game.status = "game over";
}

GameSchema.statics.checkGameWon = function(game){
  if (game.deckPile.length === 0 && !Game.playersStillHaveCards(game))
    game.status = "won";
}

GameSchema.statics.getPlayer = function(game, playerId) {
  let player = game.players.filter(ele => ele._id === playerId)[0];
  if (player === undefined) {
    throw Error("Le joueur n'existe pas");
  }
  return player;
};

GameSchema.statics.getCardFromPlayerHand = function(game, playerId, cardValue) {
  let player = Game.getPlayer(game, playerId);
  let card = player.hand.filter(ele => ele.value == cardValue)[0];
  if (card === undefined) {
    throw Error("La carte n'est pas présente dans le jeu du joueur");
  }
  return card;
};

GameSchema.statics.removeCardFromPlayerHand = function(game, playerId, cardId) {
  let player = Game.getPlayer(game, playerId);
  player.hand = player.hand.filter(ele => ele._id !== cardId);
};

GameSchema.statics.putCardOnPile = function(game, playerId, pile, card) {
  if (pile.cards.length === 0) {
    Game.removeCardFromPlayerHand(game, playerId, card._id);
    pile.cards.push(card);
  } else {
    if (Game.canBePlaced(pile, card)) {
      Game.removeCardFromPlayerHand(game, playerId, card._id);
      pile.cards.push(card);
    } else {
      throw Error("Impossible de poser cette carte sur la pile");
    }
  }
};

GameSchema.statics.canBePlaced = function(pile, card) {
  return (
    (pile.orientation === "down" &&
      pile.cards[pile.cards.length - 1].value > card.value) ||
      (pile.orientation === "down" &&
      pile.cards[pile.cards.length - 1].value+10 === card.value) ||
    (pile.orientation === "up" &&
      pile.cards[pile.cards.length - 1].value < card.value) ||
      (pile.orientation === "up" &&
      pile.cards[pile.cards.length - 1].value-10 === card.value)
  );
};

GameSchema.statics.canBePlacedOnAtLeastOne = function(piles, card) {
  if (piles === undefined) throw Error("Il n'y a pas de piles");
  return piles.reduce(
    (prev, pile) => prev || (pile.cards.length===0 || Game.canBePlaced(pile, card)),
    false
  );
};

GameSchema.statics.getNextPlayer = function(game) {
  let playerPos =
    game.players.map(ele => ele._id.toString()).indexOf(game.nowPlaying) + 1;
  if (playerPos === game.players.length) playerPos = 0;
  return game.players[playerPos]._id;
};

GameSchema.statics.hasToPlayAgain = function(game, playerId) {
  if (game.nowPlaying !== playerId) {
    throw Error(`Ce n'est pas à ${playerId} de jouer`);
  }
  let player = Game.getPlayer(game, playerId);
  let nbCardPlayed = Game.countCardPlayedThisTurn(game);
  return (
    player.hand.length !== 0 &&
    ((nbCardPlayed < 2 && game.deckPile.length > 0) ||
      (nbCardPlayed < 1 && game.deckPile.length === 0))
  );
};

GameSchema.statics.countCardPlayable = function(game, hand) {
  return hand.filter(card => {return Game.canBePlacedOnAtLeastOne(game.piles, card)})
    .length;
};

GameSchema.statics.canPlayAgain = function(game, playerId) {
  if (game.nowPlaying !== playerId) {
    throw Error(`Ce n'est pas à ${playerId} de jouer`);
  }
  let player = Game.getPlayer(game, playerId);
  return !(
    player.hand.length === 0 ||
    Game.countCardPlayable(game, player.hand) === 0
  );
};

GameSchema.statics.countCardPlayedThisTurn = function(game) {
  if (game.actions === undefined) throw Error("Aucune action à traiter");
  let nbCardPlayed = game.actions.filter(
    ele => ele.type === "endTurn" || ele.type === "playCard"
  );
  nbCardPlayed = nbCardPlayed.reduce(
    (prev, ele) => (ele.type === "endTurn" ? 0 : prev + 1),
    0
  );
  return nbCardPlayed;
};

GameSchema.statics.playersStillHaveCards = function(game) {
  return game.players.filter(player => player.hand.length > 0).length > 0;
};

GameSchema.statics.drawCard = function(game) {
  let maxCard = 6;
  switch (game.players.length) {
    case 1:
      maxCard = 8;
      break;
    case 2:
      maxCard = 7;
      break;
    default:
      maxCard = 6;
  }
  game.players.map(player => {
    const numCardsToDraw = maxCard - player.hand.length;
    const drawCards = game.deckPile.splice(
      game.deckPile.length - numCardsToDraw,
      numCardsToDraw
    );
    drawCards.map(card =>
      game.actions.push(
        new Action({
          type: "drawCard",
          details: { who: player._id.toString(), card: card }
        })
      )
    );
    player.hand.push(...drawCards);
  });
};

//------Méthodes statiques de l'objet Game ------//

//Création d'une nouvelle partie
GameSchema.statics.createGame = function(name,public=true,nbPile=4) {
  if (name === undefined || name === "")
    throw new Error("Un nom de partie doit être fourni");
  if( public !== true && public !== false)
    throw new Error("Paramètre public invalide");
  if(isNaN(nbPile))
    throw new Error("Paramètre nbPile invalide");
  let piles = Array.from({length:nbPile},(v,k)=>(k%2===0)?new Pile({orientation : "down"}):new Pile({orientation:"up"}));
  return Card.find(/*{value:{$gte: 2, $lte : 11}}*/).then(result => {
    return new Game({
      name: name,
      deckPile: shuffle(result),
      public : public,
      piles: piles,
    }).save();
  });
};

GameSchema.statics.joinGame = function(gameId, playerId) {
  let playerLogin;
  return Game.findOne({ _id: gameId }).then(res => {
    if (res === null) throw Error("La partie n'existe pas");
    if (res.status === "waitingPlayers" && res.players === undefined)
      res.players = [{ _id: playerId, login: playerLogin, hand: [] }];
    else {
      if (
        res.status === "waitingPlayers" &&
        res.players.filter(ele => ele._id.toString() === playerId).length === 0
      )
        res.players.push({ _id: playerId, login: playerLogin, hand: [] });
    }
    return res.save();
  });
  /*return Game.findOneAndUpdate({_id : gameId, status : 'waitingPlayers'},{$addToSet : {players : {_id : playerId}} })
	.then(res=>{
		if(res === null)
			throw Error("La partie n'existe pas");
		return res;
	});*/
};

GameSchema.statics.ready = function(gameId, playerId) {
  return Game.findOne({ _id: gameId }).then(res => {
    if (res === null) throw Error("La partie n'existe pas");
    if (res.players === undefined)
      throw Error("Il n'y a pas de joueurs dans cette partie");
    if (res.players.filter(ele => ele._id.toString() === playerId).length === 0)
      throw Error("Ce joueur n'est pas dans la partie");
    if (res.status !== "waitingPlayers")
      throw Error("Cette action ne peut être exécutée actuellement");
    res.player = res.players.map(ele => {
      if (ele._id.toString() === playerId) ele.ready = true;
      return ele;
    });
    if (res.players.filter(ele => !ele.ready).length === 0) {
      res.status = "playing";
      res.nowPlaying = res.players[0]._id;
      Game.drawCard(res);
    }
    return res.save();
  });
};

//Quitter une partie n'ayant pas commencé
GameSchema.statics.leaveGame = function(gameId, playerId) {
  return Game.findOne({ _id: gameId }).then(res => {
    if (res === null) throw Error("La partie n'existe pas");
    if (res.players === undefined)
      throw Error("Il n'y a pas de joueurs dans cette partie");
    if (res.status === "waitingPlayers")
      res.players = res.player.filter(ele => ele._id.toString() !== playerId);
    return res.save();
  });
};

//Jouer une carte
GameSchema.statics.playCard = function(gameId, playerId, cardValue, pileId) {
  return Game.findOne({ _id: gameId }).then(game => {
    if (game) {
      if (game.status !== "playing") {
        throw Error("Cette action ne peut pas être réalisée actuellement");
      }

      if (game.nowPlaying !== playerId) {
        throw Error("Ce n'est pas le tour de " + playerId);
      }

      let pile = game.piles.filter(ele => ele._id == pileId)[0];

      if (pile === undefined) {
        throw Error("La pile n'existe pas");
      } else {
        let card = Game.getCardFromPlayerHand(game, playerId, cardValue);
        Game.putCardOnPile(game, playerId, pile, card);
        game.actions.push(
          new Action({
            type: "playCard",
            details: {
              who: playerId,
              pile: pileId,
              card: card
            }
          })
        );
        Game.checkGameOver(game,playerId);
        Game.checkGameWon(game);
        if (game.deckPile.length === 0 && !Game.playersStillHaveCards(game))
          game.status = "won";
      }
      return game.save();
    } else {
      throw Error("Partie introuvable");
    }
  });
};

//finir son tour
GameSchema.statics.endTurn = function(gameId, playerId) {
  return Game.findOne({ _id: gameId }).then(game => {
    if (game.status !== "playing") {
      throw Error("Cette action ne peut pas être réalisée actuellement");
    }

    if (game.nowPlaying !== playerId) {
      throw Error("Ce n'est pas le tour de " + playerId);
    }
    if (Game.hasToPlayAgain(game, playerId)) {
      throw Error("Vous n'avez pas joué assez de cartes");
    }
    game.nowPlaying = Game.getNextPlayer(game);
    Game.drawCard(game);
    game.actions.push(
      new Action({ type: "endTurn", details: { who: playerId } })
    );
    Game.checkGameOver(game,game.nowPlaying);
    Game.checkGameWon(game);
    return game.save();
  });
};

//récupérer les actions précédentes et l'état de jeu actuel
GameSchema.statics.getActions = function(gameId, playerId, version){
	return Game.findOne({_id : gameId})
	.then(game=>{
		let players;
		if(game.players !== undefined){
			players = game.players.map(ele=>{
				if(ele._id != playerId){
					ele.hand.map(card => {
							card.value = 0;
							card._id="0";
							return card;
						})
				}
				return ele;
			});
		}
		let gameInfo = {
			players : players,
			piles : game.piles,
			version : game.actions.length,
			nowPlaying : game.nowPlaying,
			deckPile : game.deckPile.length,
			status : game.status
		};

		if(version !== undefined)
			gameInfo.actions = game.actions.slice(version).map(act=>{
				if(act.type==="drawCard" && act.details.who !== playerId)
				{ 
					act.details.card={_id:"0",value:0};
				} 
				return act;});
		return gameInfo;
	});
}


//Connaitre les piles sur lesquelles le joueur peut jouer
GameSchema.statics.whereToPlay = function(gameId, cardValue, playerId) {
  return Game.findOne({ _id: gameId }).then(game => {
    if (game.status !== "playing") return [];
    if (game.nowPlaying !== playerId) return [];
    if (game.piles !== undefined) {
      return game.piles
        .filter(
          pile =>pile.cards.length === 0 ||
            (pile.orientation === "up" &&
              cardValue > pile.cards[pile.cards.length - 1].value) ||
              (pile.orientation === "up" &&
              ( pile.cards[pile.cards.length - 1].value-10==cardValue)) ||
            (pile.orientation === "down" &&
              cardValue < pile.cards[pile.cards.length - 1].value) ||
              (pile.orientation === "down" &&
              ( pile.cards[pile.cards.length - 1].value+10==cardValue))
        )
        .map(pile => pile._id);
    }
    return [];
  });
};

GameSchema.statics.getGamePlayerCanJoin = function(playerId){
  return Game.find({$or: [{status: "waitingPlayers",public : true},{status : "waitingPlayers","players._id":playerId},{status: "playing","players._id":playerId}]})
  .then(res=>res.map(ele=>{return {status : ele.status,id:ele._id,name : ele.name,version : ele.actions.length, piles : ele.piles.length, players : ele.players.length}}))
}

GameSchema.statics.getEndedGamePlayerPlayed = function(playerId){
  return Game.find({$or: [{status: "won"}, {status: "game over"}],"players._id":playerId})
  .then(res=>res.map(ele=>{return {status : ele.status,id:ele._id,name : ele.name,remaining:ele.players.reduce((prev,player)=> prev+player.hand.length,ele.deckPile.length), piles : ele.piles.length, players : ele.players.length}}))
}

const Game = mongoose.model("Game", GameSchema);

module.exports = Game;
