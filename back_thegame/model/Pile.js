const mongoose = require('mongoose');
const db = require('../db');
const Card = require('./Card');
const PileSchema = new mongoose.Schema({
	orientation : {
	  type : String,
	  enum : [ 'up' , 'down' ],
	  default : 'up'
	},
	cards : [ Card.schema ]
});
const Pile = db.model('Pile',PileSchema);

module.exports = Pile;