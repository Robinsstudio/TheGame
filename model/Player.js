const mongoose = require('mongoose');
const crypto = require('crypto');
const util = require('util');
const jwt = require('jsonwebtoken');
const fs = require('fs');

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
			return signAsync({ playerId: player._id }, secretKey);
		});
	});
}

PlayerSchema.statics.isAuthenticated = function(req, res, next) {
	const cookie = req.cookies[Constants.JWT_COOKIE];
	verifyAsync(cookie, secretKey).then(function(token) {
		if (delaySince(token.iat) > 600) {
			throw new Error('Token expired');
		}

		if (delaySince(token.iat) > 300) {
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

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;