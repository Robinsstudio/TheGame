const mongoose = require('mongoose');
const Card = require('./Card');

const PileSchema = new mongoose.Schema({
	orientation: {
		type: String,
		enum: ['up', 'down'],
		default: 'up'
	},
	cards: [Card.schema]
});

const Pile = mongoose.model('Pile', PileSchema);

module.exports = Pile;