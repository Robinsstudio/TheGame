const express = require('express');
const cookieParser = require('cookie-parser');

const Card = require('./model/Card');
const Player = require('./model/Player');
const Game = require('./model/Game');
const Constants = require('./Constants');

const router = express.Router();

router.use(cookieParser());
router.use(function(req, res, next) {
	express.json()(req, res, function(err) {
		if (err) {
			return res.status(400).json({ error: 'JSON invalide' });
		}
		next();
	});
});


router.post('/account', function(req, res) {
	const { login, password, email } = req.body;
	Player.register(login, password, email).then(function() {
		res.status(201).end();
	}).catch(function() {
		res.status(409).send('Pseudo déjà utilisé');
	});
})
.put('/account',Player.isAuthenticated,function(req,res){
	const {jwt : {playerId}} = req;
	Player.editPlayer(playerId,req.body.login,req.body.mail,req.body.oldPassword,req.body.newPassword)
	.then(result=>res.status(200).json({login : result.login,mail : result.email}))
	.catch(err=>{console.log(err);res.status(404).send(err.message)});
})
.delete('/account',Player.isAuthenticated,function(req,res){
	const {jwt : {playerId}} = req;
	Player.deletePlayer(playerId)
	.then(()=>res.clearCookie(Constants.JWT_COOKIE).status(200).send("Compte supprimé"))
	.catch(()=>res.status(404).send('Impossible de supprimer le compte'));
});

router.get('/player/:id/login',Player.isAuthenticated,function(req,res){
	Player.getPlayerLogin(req.params.id)
	.then(r=>res.status(200).json(r))
	.then(err=>res.status(404).send(err.message))
});

router.put('/authentication', function(req, res) {
	const { login, password } = req.body;
	Player.authenticate(login, password).then(function(info) {
		let body = {id : info.playerId.toString(), login : info.playerLogin,mail : info.playerMail};
		//res.cookie(Constants.JWT_COOKIE, token, { httpOnly: true /*, secure: true */ }).sendStatus(204);
		res.cookie(Constants.JWT_COOKIE, info.token, { httpOnly: true /*, secure: true */ }).status(200).json(body);
	}).catch(function() {
		res.status(403).send('Pseudo ou mot de passe incorrect');
	});
})
.get('/authentication',Player.isAuthenticated,function(req,res){
	const { jwt: { playerId } } = req;
	Player.getPlayerInfo(playerId).then(function(info) {
		res.status(200).json({id : info._id, login : info.login,mail : info.email})
	}).catch(function() {
		res.status(403).send('Pseudo ou mot de passe incorrect');
	});
})
.delete('/authentication', Player.isAuthenticated, function(req, res) {
	res.clearCookie(Constants.JWT_COOKIE).sendStatus(204);
});

router.post('/game', Player.isAuthenticated, function(req, res) {
	Game.createGame(req.body.name,req.body.public,req.body.nbPile).then(game => res.status(201).json(({ id: game._id })));
})
.get('/games/playable',Player.isAuthenticated,function(req,res){
	const { jwt: { playerId } } = req;
	Game.getGamePlayerCanJoin(playerId)
	.then(function(result){
		res.status(200).json(result);
	})
	.catch(function(err){
		res.status(404).send(err.message);
	})
});

router.get('/games/ended',Player.isAuthenticated,function(req,res){
	const { jwt: { playerId } } = req;
	Game.getEndedGamePlayerPlayed(playerId)
	.then(function(result){
		res.status(200).json(result);
	})
	.catch(function(err){
		res.status(404).send(err.message);
	})
});

router.put('/game/:id/player', Player.isAuthenticated, function(req, res) {
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
});

router.get('/game/:id/actions',Player.isAuthenticated,function(req,res){
	const { query: {version}, params: { id }, jwt: { playerId } } = req;
	Game.getActions(id,playerId,version)
	.then(function(result){
		res.status(200).json(result);
	})
	.catch(function(err) {
		console.log(err);
		res.status(404).send(err.message);
	});
});

router.put('/game/:id/tour',Player.isAuthenticated,function(req,res){
	const { params: { id }, jwt: { playerId } } = req;
	Game.endTurn(id,playerId)
	.then(function(){
		res.sendStatus(200);
	})
	.catch(function(err){
		console.log(err);
		res.status(404).send(err.message);
	})
});

router.put('/game/:id/card',Player.isAuthenticated,function(req,res){
	const { body : { cardValue,pileId }, params: { id }, jwt: { playerId } } = req;
	Game.playCard(id,playerId,cardValue,pileId)
	.then(function(){
		res.status(200).json({});
	})
	.catch(function(err){
		console.log(err);
		res.status(404).send(err.message);
	})
})
router.delete('/game/:id/player',Player.isAuthenticated,function(req,res){
	const { params: { id }, jwt: { playerId } } = req;
	Game.leaveGame(id,playerId)
	.then(function(){
		res.sendStatus(200);
	})
	.catch(function(err){
		console.log(err);
		res.status(404).send(err.message);
	})
})
router.put('/game/:id/ready',Player.isAuthenticated,function(req,res){
	const { params: { id }, jwt: { playerId } } = req;
	Game.ready(id,playerId)
	.then(function(){
		res.sendStatus(200);
	})
	.catch(function(err){
		console.log(err);
		res.status(404).send(err.message);
	})
})

router.get('/game/:id/card',Player.isAuthenticated,function(req,res){
	const { query : {cardValue}, params: { id }, jwt: { playerId } } = req;
	Game.whereToPlay(id,cardValue,playerId)
	.then(function(result){
		res.status(200).json({result});
	})
	.catch(function(err){
		console.log(err);
		res.status(404).send(err.message);
	})
})

Card.reset();

module.exports = router;
