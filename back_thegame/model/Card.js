const mongoose = require('mongoose');
const db = require('../db');

const CardSchema = new mongoose.Schema({
	value: Number
});

CardSchema.statics.reset = function() {
	const model = this.model('Card');
	return model.deleteMany().then(function() {
		return model.insertMany(Array.from({ length: 98 }, (_,i) => new Card({ value: i + 2 })));
	});
}

const Card = db.model('Card', CardSchema);

module.exports = Card;