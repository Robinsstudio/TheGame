const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

mongoose.connect('mongodb://localhost:27017/thegame', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('useFindAndModify', false);
const Card = require('./model/Card');
const Player = require('./model/Player');
const Game = require('./model/Game');
const Constants = require('./Constants');

const app = express();

app.use(cookieParser());
app.use(function(req, res, next) {
	express.json()(req, res, function(err) {
		if (err) {
			return res.status(400).json({ error: 'JSON invalide' });
		}
		next();
	});
});

app.post('/api/account', function(req, res) {
	const { login, password, email } = req.body;
	Player.register(login, password, email).then(function() {
		res.status(201).end();
	}).catch(function() {
		res.status(409).send('Pseudo déjà utilisé');
	});
})
.put('/api/account',Player.isAuthenticated,function(req,res){
	const {jwt : {playerId}} = req;
	Player.editPlayer(playerId,req.body.login,req.body.mail,req.body.oldPassword,req.body.newPassword)
	.then(result=>res.status(200).json({login : result.login,mail : result.email}))
	.catch(err=>{console.log(err);res.status(404).send(err.message)});
})
.delete('/api/account',Player.isAuthenticated,function(req,res){
	const {jwt : {playerId}} = req;
	Player.deletePlayer(playerId)
	.then(()=>res.clearCookie(Constants.JWT_COOKIE).status(200).send("Compte supprimé"))
	.catch(()=>res.status(404).send('Impossible de supprimer le compte'));
});

app.put('/api/authentication', function(req, res) {
	const { login, password } = req.body;
	Player.authenticate(login, password).then(function(info) {
		let body = {id : info.playerId.toString(), login : info.playerLogin,mail : info.playerMail};
		//res.cookie(Constants.JWT_COOKIE, token, { httpOnly: true /*, secure: true */ }).sendStatus(204);
		res.cookie(Constants.JWT_COOKIE, info.token, { httpOnly: true /*, secure: true */ }).status(200).json(body);
	}).catch(function() {
		res.status(403).send('Pseudo ou mot de passe incorrect');
	});
})
.get('/api/authentication',Player.isAuthenticated,function(req,res){
	const { jwt: { playerId } } = req;
	Player.getPlayerInfo(playerId).then(function(info) {
		res.status(200).json({id : info._id, login : info.login,mail : info.email})
	}).catch(function() {
		res.status(403).send('Pseudo ou mot de passe incorrect');
	});
})
.delete('/api/authentication', Player.isAuthenticated, function(req, res) {
	res.clearCookie(Constants.JWT_COOKIE).sendStatus(204);
});

app.post('/api/game', Player.isAuthenticated, function(req, res) {
	Game.createGame(req.body.name).then(game => res.status(201).json(({ id: game._id })));
});

app.put('/api/game/:id', Player.isAuthenticated, function(req, res) {
	const { params: { id }, jwt: { playerId } } = req;
	Game.joinGame(id, playerId)
	.then(function() {
		return Game.getActions(id,playerId)
	})
	.then(function(result){
		res.status(200).json(result);
	})
	.catch(function(err) {
		console.log(err);
		res.sendStatus(404);
	});
})
.get('/api/game/:id',Player.isAuthenticated,function(req,res){
	const { params: { id }, jwt: { playerId } } = req;
	Game.getActions(id,playerId)
	.then(function(result){
		res.status(200).json(result);
	})
	.catch(function(err) {
		console.log(err);
		res.status(404).send(err.message);
	});
});



app.get('/api/game/:id/:version',Player.isAuthenticated,function(req,res){
	const { params: { id, version }, jwt: { playerId } } = req;
	Game.getActions(id,playerId,version)
	.then(function(result){
		res.status(200).json(result);
	})
	.catch(function(err) {
		console.log(err);
		res.status(404).send(err);
	});
});

app.put('/api/game/:id/fintour',Player.isAuthenticated,function(req,res){
	const { params: { id }, jwt: { playerId } } = req;
	Game.endTurn(id,playerId)
	.then(function(){
		res.sendStatus(200);
	})
	.catch(function(err){
		console.log(err);
		res.status(404).send(err);
	})
});

app.put('/api/game/:id/cartes',Player.isAuthenticated,function(req,res){
	const { body : { cardValue,pileId }, params: { id }, jwt: { playerId } } = req;
	Game.playCard(id,playerId,cardValue,pileId)
	.then(function(){
		res.sendStatus(200);
	})
	.catch(function(err){
		console.log(err);
		res.status(404).send(err);
	})
})

app.put('/api/game/:id/ready',Player.isAuthenticated,function(req,res){
	const { params: { id }, jwt: { playerId } } = req;
	Game.ready(id,playerId)
	.then(function(){
		res.sendStatus(200);
	})
	.catch(function(err){
		console.log(err);
		res.status(404).send(err);
	})
})

app.get('/api/game/:id/cards/where/:cardValue',Player.isAuthenticated,function(req,res){
	const { params: { id,cardValue }, jwt: { playerId } } = req;
	Game.whereToPlay(id,cardValue,playerId)
	.then(function(result){
		res.status(200).json({result});
	})
	.catch(function(err){
		console.log(err);
		res.status(404).send(err);
	})
})

app.get('/', function(req, res) {
	res.send('This page is not very interesting at the moment.');
});

app.listen(8080);
