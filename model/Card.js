const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
	value: Number
});

CardSchema.statics.reset = function() {
	const model = this.model('Card');
	return model.deleteMany().then(function() {
		return model.insertMany(Array.from({ length: 98 }, (_,i) => new Card({ value: i + 2 })));
	});
}

const Card = mongoose.model('Card', CardSchema);

module.exports = Card;