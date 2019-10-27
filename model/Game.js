const mongoose = require('mongoose');
const Card = require('./Card');
const Pile = require('./Pile');
const GameSchema = new mongoose.Schema({
	players : [ {
		_id : String,
		hand : [ Card.schema ]
	} ],
	deckPile : [ Card.schema ],
	piles : [ Pile.schema ],
	nowPlaying : String, //Le joueur du tour
	actions : [ 
			{
				_id : String,
				type : {
					type : String,
					enum : [ 'playCard', 'endTurn' , 'ping' ],
					default : 'playCard'
				},
				details : {}//A redéfinir si jamais la persistance de l'objet details ne s'effectue pas
			}
	],
	status : {
		type : String,
		enum : [ 'playing' , 'waitingPlayers','ended' ],
		default : 'waitingPlayers'
	}
	
});

let shuffle = function (a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
};

//Création d'une nouvelle partie
GameSchema.statics.createGame = function(){
	return Card.find(/*{value:{$gte: 2, $lte : 99}}*/)
	.then(function(result){
		return new Game({
			deckPile:shuffle(result),
			piles : [ new Pile({orientation:'down'}),new Pile({orientation : 'down'}),new Pile({}),new Pile({}) ]
		}).save();
	});
}

GameSchema.statics.joinGame = function(playerId, gameId){
	return Game.findOneAndUpdate({_id : gameId, status : 'waitingPlayers','players.id' : playerId},{$addToSet : {players : {_id : playerId}} })
	.then(res=>{
		if(res===null)
			throw Error('La partie n existe pas');
		return res;
	});
}

GameSchema.statics.drawCard = function(game){
	return game.deckPile.pop();
}

//Remplit la main d'un joueur jusqu'à ce que celui ci ait 5 cartes
GameSchema.statics.refillPlayerHand = function(gameId, playerId){
	return Game.findOne({_id:gameId, 'players._id': playerId})
	.then(res=>{
		console.log(res);
		if(res !== null && res.players !== null){
			res.players.filter((ele)=>ele._id==playerId && ele.hand.length<5).map(ele=>{
				/*
				let card = "";
				while(card !== null && ele.hand.length<5){
					card = Game.drawCard(res);
					if(card !== null)
						ele.hand.push(card);
				}
				*/
				let card;
				do{
					card = Game.drawCard(res);
					if(card!==null)
						ele.hand.push(card);
				}while(card !== null && ele.hand.length<5)
			});
			return res.save()
			.then(r=>{return r;})
		}
		throw Error("players devrait être un tableau pour "+gameId);
	});
}

GameSchema.statics.getPlayer = function(game,playerId){
	let player = game.players.filter(ele=>ele._id === playerId)[0];
	if(player === undefined){
		throw Error("Le joueur n'existe pas");
	}
	return player;
}

GameSchema.statics.getCardFromPlayerHand = function(game,playerId,cardId){
	let player = Game.getPlayer(game,playerId);
	let card = player.hand.filter(ele=>ele._id==cardId)[0];
	if(card === undefined){
		throw Error("La carte n'est pas présente dans le jeu du joueur");
	}
	return card;
}

GameSchema.statics.removeCardFromPlayerHand = function(game,playerId,cardId){
	let player = Game.getPlayer(game,playerId);
	player.hand = player.hand.filter(ele=>ele._id!==cardId);
}

GameSchema.statics.putCardOnPile = function(game,playerId,pile,card){
	if(pile.cards.length===0){
		Game.removeCardFromPlayerHand(game,playerId,card._id);
		pile.cards.push(card);
	}
	else{
		if(pile.orientation === 'down' && pile.cards[pile.cards.length-1].value > card.value){
			Game.removeCardFromPlayerHand(game,playerId,card._id);
			pile.cards.push(card);
		}
		else if(pile.orientation === 'up' && pile.cards[pile.cards.length-1].value < card.value){
			Game.removeCardFromPlayerHand(game,playerId,card._id);
			pile.cards.push(card);
		}
		else{
			throw Error("Impossible de poser cette carte sur la pile");
		}
	}
}
//Jouer une carte
GameSchema.statics.playCard = function(gameId,playerId,cardId,pileId){
	return Game.findOne({_id : gameId})
	.then(game => {
		if(game!==null){
			if(game.status!=="playing"){
				throw Error("Cette action ne peut pas être réalisée actuellement");
			}
			if(game.nowPlaying !== playerId){
				throw Error("Ce n'est pas le tour de "+playerId);
			}
			let pile = game.piles.filter(ele=>ele._id==pileId)[0];
			if (pile===undefined){
				throw Error("La pile n'existe pas");
			}
			else{
				let card = Game.getCardFromPlayerHand(game,playerId,cardId);
				Game.putCardOnPile(game,playerId,pile,card);
			}
			return game.save();
		}
		else{
			throw Error("Partie introuvable");
		}
	});
}

GameSchema.statics.getNextPlayer = function(game){
	let playerPos = game.players.map(ele=>ele._id.toString()).indexOf(game.nowPlaying)+1;
	if(playerPos===game.players.length)
		playerPos=0;
	return game.players[playerPos]._id;
}


//finir son tour
GameSchema.statics.endTurn = function(gameId,playerId){
	return Game.findOne({_id:gameId})
	.then(game=>{
		if(game.status!=="playing"){
			throw Error("Cette action ne peut pas être réalisée actuellement");
		}
		if(game.nowPlaying !== playerId){
			throw Error("Ce n'est pas le tour de "+playerId);
		}
		let player = Game.getPlayer(game,playerId);
		if(player.hand.length>3 && game.deckPile.length>0){
			throw Error("Vous n'avez pas joué assez de cartes");
		}
		else if(player.hand.length>4 && game.deckPile.length===0){
			throw Error("Vous n'avez pas joué assez de cartes");
		}
		game.nowPlaying=Game.getNextPlayer(game);
		Game.refillPlayerHand(gameId,playerId);
		return game.save();
	});
}


//récupérer les actions précédentes
GameSchema.statics.getActions = function(gameId,playerId,version){
	return ;
}

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;