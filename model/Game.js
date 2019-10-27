const mongoose = require('mongoose');
const Card = require('./Card');
const Pile = require('./Card');

const Constants = require('./../Constants');

const GameSchema = new mongoose.Schema({
	players: [{
		_id: String,
		hand: [Card.schema]
	}],
	deckPile: [Card.schema],
	piles: [Pile.schema],
	nowPlaying: String, //Le joueur du tour
	actions: [{
		_id: String,
		type: {
			type: String,
			enum: ['playCard', 'endTurn', 'ping'],
			default: 'playCard'
		},
		details: {} //A redéfinir si jamais la persistance de l'objet details ne s'effectue pas
	}],
	status: {
		type: String,
		enum: ['playing', 'waitingPlayers', 'ended'],
		default: 'waitingPlayers'
	}

});

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function fillPlayerHand(player, game) {
	const numCardsToDraw = Constants.PLAYER_HAND_SIZE - player.hand.length;
	const drawnCards = game.deckPile.splice(game.deckPile.length - numCardsToDraw, numCardsToDraw);
	player.hand.push(...drawnCards);
}

//Création d'une nouvelle partie
GameSchema.statics.createGame = function() {
	return Card.find().then(function(cards) {
		return new Game({
			deckPile: shuffle(cards),
			piles: [new Pile({
				orientation: 'down'
			}), new Pile({
				orientation: 'down'
			}), new Pile({}), new Pile({})]
		}).save();
	});
}

GameSchema.statics.joinGame = function(gameId, playerId) {
	return Game.findById(gameId).then(function(game) {
		if (!game) {
			throw new Error('La partie n\'existe pas');
		}

		let player = game.players.find(function(pl) {
			return playerId === pl._id;
		});

		if (!player) {
			player = {
				_id: playerId,
				hand: []
			};

			fillPlayerHand(player, game);
			game.players.push(player);
			return game.save();
		}
	});
}

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;