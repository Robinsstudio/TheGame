const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/thegame', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('useFindAndModify', false);
const Card = require('./model/Card');
const Player = require('./model/Player');
const Game = require('./model/Game');
//Game.createGame().then(res=>console.log(res)).catch(err=>console.log(err));
//Game.joinGame('hello2','5db1562c859fd712d0fa6551').then(res=>console.log(res)).catch(err=>console.log("err"));
//Game.refillPlayerHand('5db1562c859fd712d0fa6551','hello2').then(res=>console.log(res)).catch(err=>console.log("err"));;
//Game.playCard('5db1562c859fd712d0fa6551','hello2','5dac5a2d07a528190cbb1e8c','5db1562c859fd712d0fa654d');
//Game.endTurn('5db1562c859fd712d0fa6551','hello');
//Game.getActions('5db1562c859fd712d0fa6551','hello2',0).then(res=>console.log(res));