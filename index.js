const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

mongoose.connect('mongodb://localhost:27017/thegame', { useNewUrlParser: true, useUnifiedTopology: true });

const Card = require('./model/Card');
const Player = require('./model/Player');
const Game = require('./model/Game');
const Constants = require('./Constants');

const app = express();

app.use(cookieParser());
app.use(function(req, res, next) {
	express.json()(req, res, function(err) {
		if (err) {
			res.status(400).json({ error: 'Malformed JSON' });
		}
		next();
	});
});

app.post('/api/register', function(req, res) {
	const { login, password, email } = req.body;
	Player.register(login, password, email).then(function() {
		res.status(201).end();
	}).catch(function() {
		res.status(409).send('Pseudo déjà utilisé');
	});
});

app.post('/api/authentication', function(req, res) {
	const { login, password } = req.body;
	Player.authenticate(login, password).then(function(token) {
		res.cookie(Constants.JWT_COOKIE, token, { httpOnly: true /*, secure: true */ });
		res.status(200).end();
	}).catch(function() {
		res.status(403).send('Pseudo ou mot de passe incorrect');
	});
});

app.post('/api/game', Player.isAuthenticated, function(req, res) {
	Game.createGame().then(game => res.status(201).json(({ _id: game._id })));
});

app.get('/', function(req, res) {
	res.send('This page is not very interesting at the moment.');
});

app.listen(8080);