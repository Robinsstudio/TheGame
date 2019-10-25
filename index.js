const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/thegame', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('useFindAndModify', false);
const Card = require('./model/Card');
const Player = require('./model/Player');
const Game = require('./model/Game');
//Game.createGame().then(res=>console.log(res)).catch(err=>console.log(err));
//Game.joinGame('hello2','5db1569d7c4c4132fcb2dfc1').then(res=>console.log(res)).catch(err=>console.log("err"));
//Game.refillPlayerHand('5db1569d7c4c4132fcb2dfc1','hello2').then(res=>console.log(res)).catch(err=>console.log("err"));;