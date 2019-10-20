const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/thegame', { useNewUrlParser: true, useUnifiedTopology: true });

const Card = require('./model/Card');
const Player = require('./model/Player');
const Game = require('./model/Game');