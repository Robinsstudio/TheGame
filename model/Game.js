const mongoose = require('mongoose');
const Card = require('./Card');

const GameSchema = new mongoose.Schema({
	players : {
		_id : String,
		hand : [ Card.schema ]
	},
	deckPile : [ Card.schema ],
	piles : [ 
		{ _id : String,
		  orientation : {
			  type : String,
			  enum : [ 'up' , 'down' ],
			  default : 'up'
		  },
		  cards : [ Card.schema ]
		}
	],
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
		enum : [ 'playing' , 'waitingPlayers' ],
		default : 'playing'
	}
	
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;