const mongoose = require('mongoose');
const crypto = require('crypto');
const util = require('util');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const db = require('../db');
const Constants = require('./../Constants');

const randomBytesAsync = util.promisify(crypto.randomBytes);
const pbkdf2Async = util.promisify(crypto.pbkdf2);
const signAsync = util.promisify(jwt.sign);
const verifyAsync = util.promisify(jwt.verify);

const secretKey = fs.readFileSync(__dirname + '/../secret_key', 'utf8');

const PlayerSchema = new mongoose.Schema({
	login: String,
	password: Buffer,
	email: String,
	registrationDate: Date,
	salt: Buffer
});

const NUM_ITERATIONS = 100000;
const HASH_SIZE = 512;
const DIGEST = 'sha512';

function clone(object, options = {}) {
	const newObject = {};
	Object.entries(object).forEach(function([key, value]) {
		if (!options.except || options.except !== key && !options.except.includes(key)) {
			newObject[key] = value;
		}
	});
	return newObject;
}

function delaySince(epoch) {
	return Date.now() / 1000 - epoch;
}

PlayerSchema.statics.register = function(login, password, email) {
	const model = this.model('Player');
	return model.find({ login }).then(function(players) {
		if (players.length) {
			throw new Error('Login unavailable');
		}

		return randomBytesAsync(256).then(function(buffer) {
			return buffer;
		}).then(function(salt) {
			return pbkdf2Async(password, salt, NUM_ITERATIONS, HASH_SIZE, DIGEST).then(function(hash) {
				return new Player({ login, password: hash, email, salt, registrationDate: Date.now() }).save();
			});
		});
	});
}

PlayerSchema.statics.editPlayer = function(playerId,login,mail,oldPass,newPass){
	return Player.findOne({_id: playerId})
	.then(player=>{if(player === undefined)throw new Error("Le joueur n'existe pas");return player})
	.then(player=>{
		if(login !== undefined && login !== player.login)
			return Player.find({login}).then(function(players) {
				if (players.length) {
					throw new Error('Login non disponible');
				}
				player.login = login;
				return player;
			});
		return player;
	})
	.then(player=>{
		if(mail!== undefined && mail !== player.mail)
			player.email = mail;
		return player;
	})
	.then(player=>{
		if(oldPass !== undefined && newPass !== undefined && oldPass !== newPass){
			return pbkdf2Async(oldPass, player.salt, NUM_ITERATIONS, HASH_SIZE, DIGEST)
			.then(function(hash) {
				if (Buffer.compare(hash, player.password)) {
					throw new Error('Mot de passe incorrect');
				}
				return randomBytesAsync(256).then(function(buffer) {
					return buffer;
				}).then(function(salt) {
					return pbkdf2Async(newPass, salt, NUM_ITERATIONS, HASH_SIZE, DIGEST)
					.then(function(hashNewPass) {
						player.salt = salt;
						player.password = hashNewPass;
						return player;
					});
				});
			});
		}
		if (oldPass !== undefined && oldPass === newPass){
			throw Error ("Le nouveau mot de passe doit être différent");
		}
		return player;
	})
	.then(player=>player.save())
}

PlayerSchema.statics.getPlayerLogin = function(id) {
	if(id===undefined ||id==="" ||id===null)
		throw new Error("Un login doit être fourni");
	return Player.findOne({_id : id}).then(res=>{return {login : res.login}})
}

PlayerSchema.statics.authenticate = function(login, password) {
	const model = this.model('Player');
	return model.find({ login }).then(function(players) {
		if (!players.length) {
			throw new Error(`Login ${login} does not exist`);
		}

		const player = players[0];
		return pbkdf2Async(password, player.salt, NUM_ITERATIONS, HASH_SIZE, DIGEST).then(function(hash) {
			if (Buffer.compare(hash, player.password)) {
				throw new Error('Incorrect password');
			}
			return signAsync({ playerId: player._id }, secretKey)
			.then(token=>{return {token : token, playerId: player._id, playerLogin : player.login,playerMail : player.email}});
		});
	});
}

PlayerSchema.statics.isAuthenticated = function(req, res, next) {
	const cookie = req.cookies[Constants.JWT_COOKIE];
	verifyAsync(cookie, secretKey).then(function(token) {
		if (delaySince(token.iat) > 1200) {
			throw new Error('Token expired');
		}

		if (delaySince(token.iat) > 600) {
			return signAsync(clone(token, { except: 'iat' }), secretKey).then(function(tk) {
				res.cookie(Constants.JWT_COOKIE, tk, { httpOnly: true, /*, secure: true */ });
				return tk;
			});
		}

		return token;
	}).then(function(token) {
		req.jwt = token;
		next();
	}).catch(function() {
		res.sendStatus(401);
	});
}

PlayerSchema.statics.getPlayerInfo = function(playerId){
	return Player.findOne({_id : playerId});
}

PlayerSchema.statics.deletePlayer = function(playerId){
	return Player.deleteOne({_id : playerId});
}

const Player = db.model('Player', PlayerSchema);

module.exports = Player;