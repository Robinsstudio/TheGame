const mongoose = require('mongoose');
const Card = require('./Card');
const PileSchema = new mongoose.Schema({
	orientation : {
	  type : String,
	  enum : [ 'up' , 'down' ],
	  default : 'up'
	},
	cards : [ Card.schema ]
});
const Pile = mongoose.model('Pile',PileSchema);
const GameSchema = new mongoose.Schema({
	players : [ {
		_id : String,
		hand : [ Card.schema ]
	} ],
	deckPile : [ Card.schema ],
	piles : [ PileSchema ],
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
//Création d'une nouvelle partie
GameSchema.statics.createGame = function(){
	let shuffle = function (a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	};
	Card.find(/*{value:{$gte: 2, $lte : 99}}*/)
	.then(function(result){
		new Game({
			deckPile:shuffle(result),
			piles : [ new Pile({orientation:'down'}),new Pile({orientation : 'down'}),new Pile({}),new Pile({}) ]
		}).save()
		.then(res=>console.log(res._id))
		.catch(err=>console.log('Erreur lors de la création de la partie'));
	})
	.catch(function(err){
		console.log('Erreur lors de la récupération des cartes');
	});
}

GameSchema.statics.joinGame = function(playerId, gameId){
	return new Promise(function(resolve,reject){
		Game.findOneAndUpdate({_id : gameId, status : 'waitingPlayers',players : {$nin : [{_id : playerId}] }},{$addToSet : {players : {_id : playerId, hand : [] }} })
		.then(res=>{
			if(res===null)
				throw Error('La partie n existe pas');
			resolve(res);
		})
		.catch(err=>{console.log(`Impossible de rejoindre la partie ${gameId} pour ${playerId}`);reject(err);});
	});
}
/*
GameSchema.statics.drawCard = function(gameId){
	return new Promise(function(resolve,reject){
		Game.findOne({_id : gameId})
		.then(res=>{
			let draw = res.deckPile.pop();
			return res.save()
			.then(res=>resolve(draw))
			.catch(err=>{console.log("Erreur lors de la sauvegarde");reject(err);});
		})
		.catch(err=> {console.log('Aucune partie trouvée avec cet id');reject(err);})
	});
}*/

GameSchema.statics.drawCard = function(game){
	return game.deckPile.pop();
}

//Rempli la main d'un joueur jusqu'à ce que celui ci ait 5 cartes
GameSchema.statics.refillPlayerHand = function(gameId, playerId){
	return new Promise(function(resolve,reject){
		Game.findOne({_id:gameId, players:{$in : [{_id : playerId}]}})
		.then(res=>{
			if(res !== null && res.players !== null){
				res.players.filter((ele)=>ele._id===playerId && ele.hand.length<5).map(ele=>{
					let card;
					do{
						card = Game.drawCard(res);
						if(card!==null)
							ele.hand.push(card);
					}while(card !== null && ele.hand.length<5)
				});
				res.save()
				.then(r=>{console.log(r);resolve(r);})
				.catch(err=>{console.log(err);reject("Erreur lors de la sauvegarde de l'objet (fonction refillPlayerHand)")});
			}
		})
		.catch(err=> {console.log(err);reject("Erreur lors du lancement de la fonction refillPlayerHand");});
	});
}


//Jouer une carte
GameSchema.statics.playCard = function(gameId,playerId,cardId){
	return new Promise(function(resolve,reject){
		Game.findOne({_id : gameId, players : { $in : [{_id : playerId}]}})
		.then(result => {
			
		})
		.catch(err=>{console.log(err);reject("Erreur lors du lancement de la fonction playCard")})
	});
}

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;