(function() {
	'use strict';

	var _ = require('lodash');
	var async = require('async');
	var Elo = require('../../fns/elo');
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
		if(users.length === 0) {
			return callback(null);
		}
		async.map(users, saveUser, callback);
	};


	/**
	 * Copy data from users to players
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
			if(user) {
				player.elo = player.oldElo = user.elo;
				player.fame = player.oldFame = user.fame;
				player.fractures = player.oldFractures = user.fractures;
			}
		});
	};


	/**
	 * Copy updated data from users to players
	 * @param players
	 * @param users
	 */
	var mergeChanges = function(players, users) {
		var lookup = {};
		_.each(users, function(user) {
			lookup[user._id] = user;
		});

		_.each(players, function(player) {
			var user = lookup[player._id];
			if(user) {
				user.elo = player.elo;
				user.game = player.fame;
				user.fractures = player.fractures;
			}
		});
	};


	/**
	 * Calculate new elo ratings for all players from this game
	 * @param {array.<Player>} players
	 * @param {number} winningTeam
	 */
	var calcNewElo = function(players, winningTeam) {
		var wElo = [];
		var lElo = [];

		_.each(players, function(player) {
			if(player.team === winningTeam) {
				wElo.push(player.elo);
			}
			else {
				lElo.push(player.elo);
			}
		});

		var avWinElo = sum(wElo) / wElo.length;
		var avLosElo = sum(lElo) / lElo.length;

		var results = Elo.calcChange(avWinElo, avLosElo, 1, 0);

		_.each(players, function(player) {
			if(player.team === winningTeam) {
				if(player.elo < results.a) {
					player.elo += (results.a-player.elo) / wElo.length;
				}
			}
			else {
				if(player.elo > results.b) {
					player.elo += (results.b-player.elo) / lElo.length;
				}
			}
		});
	};


	/**
	 * Everyone gains some fame, winners gain more
	 * @param {array.<Player>} players
	 * @param {number} winningTeam
	 */
	var calcFame = function(players, winningTeam) {
		_.each(players, function(player) {
			if(player.team === winningTeam) {
				player.fame += player.elo - player.oldElo + module.exports.BASE_FAME_GAIN;
			}
			else {
				player.fame += module.exports.BASE_FAME_GAIN;
			}
		});
	};


	/**
	 * Winners get a Time Fracture if this was a prize match
	 * @param {array.<Player>} players
	 * @param {number} winningTeam
	 * @param {bool} prize
	 */
	var calcFractures = function(players, winningTeam, prize) {
		if(prize) {
			_.each(players, function(player) {
				if(player.team === winningTeam) {
					player.fractures++;
				};
			});
		}
	};


	module.exports = {

		/**
		 * The minimum amount of fame gained from completing a match
		 */
		BASE_FAME_GAIN: 5,


		/**
		 * Load user data from mongo
		 * Calculate elo changes and prizes
		 * Save updated data to mongo
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

				users = _.compact(users);
				mergeData(players, users);
				calcNewElo(players, winningTeam);
				calcFame(players, winningTeam);
				calcFractures(players, winningTeam, prize);
				mergeChanges(players, users);

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