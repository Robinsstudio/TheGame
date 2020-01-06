const mongoose = require('mongoose');
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
        card : Card.schema
    }
});
const Action = mongoose.model('Action',ActionSchema);

module.exports = Action;