const mongoose = require('mongoose');
const Card = require('./Card');
const Pile = require('./Pile');
const Action = require('./Action');

//-----Schéma du jeu -----//

const GameSchema = new mongoose.Schema({
	players : [ {
		_id : String,
		hand : [ Card.schema ]
	} ],
	deckPile : [ Card.schema ],
	piles : [ Pile.schema ],
	nowPlaying : String, //Le joueur du tour
	actions : [ Action.schema ],
	status : {
		type : String,
		enum : [ 'playing' , 'waitingPlayers','ended' ],
		default : 'waitingPlayers'
	}
});

//------Méthodes utilisées par l'objet Game ------//

let shuffle = function (a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
};

GameSchema.methods.getPlayer = function(game, playerId){
	let player = game.players.filter(ele => ele._id === playerId)[0];
	if(player === undefined){
		throw Error("Le joueur n'existe pas");
	}
	return player;
}

GameSchema.methods.getCardFromPlayerHand = function(game, playerId, cardId){
	let player = Game.getPlayer(game, playerId);
	let card = player.hand.filter(ele => ele._id == cardId)[0];
	if(card === undefined){
		throw Error("La carte n'est pas présente dans le jeu du joueur");
	}
	return card;
}

GameSchema.methods.removeCardFromPlayerHand = function(game, playerId, cardId){
	let player = Game.getPlayer(game,playerId);
	player.hand = player.hand.filter(ele => ele._id !== cardId);
}

GameSchema.methods.putCardOnPile = function(game, playerId, pile, card){
	if(pile.cards.length === 0){
		Game.removeCardFromPlayerHand(game, playerId, card._id);
		pile.cards.push(card);
	}
	else{

		if(Game.canBePlaced(pile,card)){
			Game.removeCardFromPlayerHand(game, playerId, card._id);
			pile.cards.push(card);
		}
		else{
			throw Error("Impossible de poser cette carte sur la pile");
		}

	}
}

GameSchema.methods.canBePlaced = function(pile,card){
	return (pile.orientation === 'down' && pile.cards[pile.cards.length-1].value > card.value || 
	pile.orientation === 'up' && pile.cards[pile.cards.length-1].value < card.value);
}

GameSchema.methods.canBePlacedOnAtLeastOne = function(piles,card){
	if(piles === undefined)
		throw Error("Il n'y a pas de piles");
	return piles.reduce((prev,pile)=>(prev || Game.canBePlaced(pile,card)),false);
}

GameSchema.methods.getNextPlayer = function(game){
	let playerPos = game.players.map(ele => ele._id.toString()).indexOf(game.nowPlaying)+1;
	if(playerPos === game.players.length)
		playerPos=0;
	return game.players[playerPos]._id;
}

GameSchema.methods.hasToPlayAgain = function(game, playerId){
	if(game.nowPlaying !== playerId){
		throw Error(`Ce n'est pas à ${playerId} de jouer`);
	}
	let player = Game.getPlayer(game, playerId);
	let nbCardPlayed = Game.countCardPlayedThisTurn(game);
	return (player.hand.length!==0 && (nbCardPlayed >= 2 && game.deckPile.length > 0) || (nbCardPlayed >= 1 && game.deckPile.length === 0));
}

GameSchema.methods.countCardPlayable = function(game,hand){
	return hand.filter(card=>Game.canBePlacedOnAtLeastOne(game.piles,card)).length;
}

GameSchema.methods.canPlayAgain = function(game,playerId){
	if(game.nowPlaying !== playerId){
		throw Error(`Ce n'est pas à ${playerId} de jouer`);
	}
	let player = Game.getPlayer(game, playerId);
	return !(player.hand.length===0 || Game.countCardPlayable(game,player.hand).length===0);	
}

GameSchema.methods.countCardPlayedThisTurn = function(game){
	if(game.actions === undefined)
		throw Error("Aucune action à traiter")
	let nbCardPlayed = game.actions.filter(ele=>(ele.type==="endTurn" || ele.type==="playCard"));
	nbCardPlayed = nbCardPlayed.reduce((prev,ele)=>(ele.type==="endTurn")?0:prev+1,0);
	return nbCardPlayed;
}

GameSchema.methods.playersStillHaveCards = function(game){
	return game.players.filter((player)=>player.hand.length>0).length>0;
}

//------Méthodes statiques de l'objet Game ------//

//Création d'une nouvelle partie
GameSchema.statics.createGame = function(){
	return Card.find(/*{value:{$gte: 2, $lte : 99}}*/)
	.then(result => {
		return new Game({
			deckPile:shuffle(result),
			piles : [ new Pile({orientation:'down'}),new Pile({orientation : 'down'}),new Pile({}),new Pile({}) ]
		}).save();
	});
}

GameSchema.statics.joinGame = function(playerId, gameId){
	return Game.findOneAndUpdate({_id : gameId, status : 'waitingPlayers','players.id' : playerId},{$addToSet : {players : {_id : playerId}} })
	.then(res=>{
		if(res === null)
			throw Error("La partie n'existe pas");
		return res;
	});
}

GameSchema.statics.drawCard = function(game){
	return game.deckPile.pop();
}

//Remplit la main d'un joueur jusqu'à ce que celui ci ait 5 cartes
GameSchema.statics.refillPlayerHand = function(gameId, playerId){
	return Game.findOne({_id : gameId, 'players._id': playerId})
	.then(res => {
		console.log(res);
		if(res !== null && res.players !== null){
			res.players.filter((ele)=>ele._id==playerId && ele.hand.length<5).map(player=>{
				const numCardsToDraw = 5-player.hand.length;
				const drawCards = game.deckPile.splice(game.deckPile.length-numCardsToDraw,numCardsToDraw);
				player.hand.push(...drawCards);
			});
			return res.save();
		}
		throw Error("players devrait être un tableau pour "+gameId);
	});
}

//Jouer une carte
GameSchema.statics.playCard = function(gameId, playerId, cardId, pileId){
	return Game.findOne({_id : gameId})
	.then(game => {
		if(game){

			if(game.status !== "playing"){
				throw Error("Cette action ne peut pas être réalisée actuellement");
			}

			if(game.nowPlaying !== playerId){
				throw Error("Ce n'est pas le tour de "+playerId);
			}

			let pile = game.piles.filter(ele => ele._id==pileId)[0];

			if (pile === undefined){
				throw Error("La pile n'existe pas");
			}
			else{
				let card = Game.getCardFromPlayerHand(game, playerId, cardId);
				Game.putCardOnPile(game, playerId, pile, card);
				game.actions.push(new Action({type : "playCard", details : {
					who : playerId, pile : pileId, card : card
				}}));
				if(Game.hasToPlayAgain(game,playerId) && !Game.canPlayAgain(game,playerId))
					game.status="game over";
				if(game.deckPile.length===0 && !Game.playersStillHaveCards(game))
					game.status = "win";
			}
			return game.save();
		}
		else{
			throw Error("Partie introuvable");
		}
	});
}

//finir son tour
GameSchema.statics.endTurn = function(gameId, playerId){
	return Game.findOne({_id : gameId})
	.then(game => {

		if(game.status !== "playing"){
			throw Error("Cette action ne peut pas être réalisée actuellement");
		}

		if(game.nowPlaying !== playerId){
			throw Error("Ce n'est pas le tour de "+playerId);
		}
		if (Game.hasToPlayAgain(game,playerId)){
			throw Error("Vous n'avez pas joué assez de cartes");
		}
		game.nowPlaying=Game.getNextPlayer(game);
		Game.refillPlayerHand(gameId, playerId);
		game.actions.push(new Action({type : "endTurn", details : { who : playerId }}));
		return game.save();
	});
}


//récupérer les actions précédentes et l'état de jeu actuel
GameSchema.statics.getActions = function(gameId, playerId, version){
	return Game.findOne({_id : gameId})
	.then(game=>{
		let gameInfo = {
			players : game.players.map(ele=>{
				if(ele._id != playerId){
					ele.hand.map(card => {
							card.value = 0;
							card._id = 0;
							return card;
						})
				}
				return ele;
			}),
			piles : game.piles,
			version : game.actions.length,
			nowPlaying : game.nowPlaying,
			deckPile : game.deckPile.length,
			status : game.status
		};

		if(version !== undefined)
			gameInfo.actions = game.actions.slice(version);

		return gameInfo;
	});
}

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;