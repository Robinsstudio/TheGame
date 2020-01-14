const mongoose = require('mongoose');
const db = require('../db');
const Card = require('./Card');
const ActionSchema = new mongoose.Schema({
    type : {
        type : String,
        enum : [ 'playCard', 'endTurn' , 'ping', 'drawCard','game over','game won' ],
        default : 'playCard'
    },
    details : {
        who : String,
        pile : String,
        card : Card.schema,
        info : String
    }
});
const Action = db.model('Action',ActionSchema);

module.exports = Action;