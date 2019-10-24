const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/thegame', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('useFindAndModify', false);
const Card = require('./model/Card');
const Player = require('./model/Player');
const Game = require('./model/Game');
//Game.createGame();
//Game.joinGame('hello','5db1562c859fd712d0fa6551')
//Game.drawCard('5db015e62e08783f3c12eae')
Game.refillPlayerHand('5db1562c859fd712d0fa6551','hello');