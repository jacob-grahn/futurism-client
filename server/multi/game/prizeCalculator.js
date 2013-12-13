(function() {
	'use strict';

	var _ = require('lodash');
	var async = require('async');
	var Elo = require('elo');
	var UserGoose = require('../../models/user');
	var Player = require('./player');


	/**
	 * Add up all the numbers in an array
	 * @param {array.<number>} numbers
	 * @returns {number}
	 */
	var sum = function(numbers) {
		var sum = 0;
		_.each(numbers, function(number) {
			sum += number;
		});
		return sum;
	};


	/**
	 * Load a user from mongo
	 * @param {Player} player
	 * @param {function} callback
	 */
	var loadUser = function(player, callback) {
		UserGoose.findById(player._id, callback);
	};


	/**
	 * Load array of users from mongo
	 * @param {array.<Player>} players
	 * @param {function} callback
	 */
	var loadUsers = function(players, callback) {
		async.map(players, loadUser, callback);
	};


	/**
	 * Save changed user data back to mongo
	 * @param {UserGoose} user
	 * @param {function} callback
	 */
	var saveUser = function(user, callback) {
		user.save(callback);
	};


	/**
	 * Save array of users to mongo
	 * @param {array.<UserGoose>} users
	 * @param {function} callback
	 */
	var saveUsers = function(users, callback) {
		async.map(users, saveUser, callback);
	};


	/**
	 * Copy data from players to users
	 * @param {array.<Player>} players - data coming from a finished game
	 * @param {array.<UserGoose>} users - data from mongo
	 */
	var mergeData = function(players, users) {
		var lookup = {};
		_.each(users, function(user) {
			lookup[user._id] = user;
		});

		_.each(players, function(player) {
			var user = lookup[player._id];
			user.team = player.team;
			user.oldElo = user.elo;
			user.oldFame = user.fame;
			user.oldFractures = user.fractures;
		});
	};


	/**
	 * Calculate new elo ratings for all players from this game
	 * @param {array.<UserGoose>} users
	 * @param {number} winningTeam
	 */
	var calcNewElo = function(users, winningTeam) {
		var wElo = [];
		var lElo = [];

		_.each(users, function(user) {
			if(user.team === winningTeam) {
				wElo.push(user.elo);
			}
			else {
				lElo.push(user.elo);
			}
		});

		var avWinElo = sum(wElo) / wElo.length;
		var avLosElo = sum(lElo) / lElo.length;

		var results = Elo.calcChange(avWinElo, avLosElo, 1, 0);

		_.each(users, function(user) {
			if(user.team === winningTeam) {
				if(user.elo < results.a) {
					user.elo += (results.a-user.elo) / wElo.length;
				}
			}
			else {
				if(user.elo > results.b) {
					user.elo += (results.b-user.elo) / lElo.length;
				}
			}
		});
	};


	/**
	 * Everyone gains some fame, winners gain more
	 * @param {array.<UserGoose>} users
	 * @param {string} winningTeam
	 */
	var calcFame = function(users, winningTeam) {
		_.each(users, function(user) {
			if(user.team === winningTeam) {
				user.fame += user.elo - user.oldElo + 5;
			}
			else {
				user.fame += 5;
			}
		});
	};


	/**
	 * Winners get a Time Fracture if this was a prize match
	 * @param {array.<UserGoose>} users
	 * @param {string} winningTeam
	 * @param {bool} prize
	 */
	var calcFractures = function(users, winningTeam, prize) {
		if(prize) { //if this was a prize match
			_.each(users, function(user) {
				if(user.team === winningTeam) {
					user.fractures++;
				};
			});
		}
	};


	module.exports = {

		/**
		 * Calculate elo changes and prizes
		 * Save those updates to mongo
		 * @param {array.<Player>} players
		 * @param {number} winningTeam
		 * @param {bool} prize
		 * @param {function} callback
		 */
		run: function(players, winningTeam, prize, callback) {

			loadUsers(players, function(err, users) {
				if(err) {
					return callback(err);
				}

				mergeData(players, users);
				calcNewElo(users, winningTeam);
				calcFame(users, winningTeam);
				calcFractures(users, winningTeam, prize);

				saveUsers(users, function(err) {
					if(err) {
						return callback(err);
					}
					return callback(null, users);
				});
			});
		}

	}

}());