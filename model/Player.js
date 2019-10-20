const mongoose = require('mongoose');
const crypto = require('crypto');
const util = require('util');

const randomBytesAsync = util.promisify(crypto.randomBytes);
const pbkdf2Async = util.promisify(crypto.pbkdf2);

const PlayerSchema = new mongoose.Schema({
	login: String,
	password: Buffer,
	email: String,
	registrationDate: Date,
	salt: Buffer,
	token: String
});

const NUM_ITERATIONS = 100000;
const HASH_SIZE = 512;
const DIGEST = 'sha512';

PlayerSchema.statics.register = function(login, password, email) {
	const model = this.model('Player');
	return model.find({ login }).then(function(players) {
		if (players.length) {
			throw new Error('Login unavailable');
		}

		return randomBytesAsync(256).then(function(buffer) {
			return buffer;
		}).then(function(salt) {
			return pbkdf2Async(password, salt, NUM_ITERATIONS, HASH_SIZE, DIGEST).then(function(hashedPassword) {
				return new Player({ login, password: hashedPassword, email, salt, registrationDate: Date.now() }).save();
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
		return pbkdf2Async(password, player.salt, NUM_ITERATIONS, HASH_SIZE, DIGEST).then(function(hashedPassword) {
			if (Buffer.compare(hashedPassword, player.password)) {
				throw new Error('Incorrect password');
			}
		});
	});
}

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;