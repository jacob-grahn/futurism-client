(function() {
	'use strict';

	var fns = require('../fns/fns');
	var Game = require('./game/game');
	var Chat = require('./chat');
	var broadcast = require('./broadcast');
	var Lookup = require('../fns/lookup');
	var _ = require('lodash');
	var defaultRules = require('./game/defaultRules');

	var nextId = 1;


	/**
	 * Main class
	 */
	var Lobby = {};


	/**
	 * Store the lobby rooms
	 */
	Lobby.lookup = new Lookup();


	/**
	 * Remove account from all matchups in all lobbies
	 * @param account
	 */
	Lobby.leaveAll = function(account) {
		_.each(Lobby.lookup.toArray(), function(lobby) {
			lobby.leaveMatchup(account);
		});
	};


	/**
	 * Player matchmaking
	 * matchups are created by users, then filled with other users
	 * @param roomName
	 */
	Lobby.createRoom = function(roomName) {
		var self = this;

		/**
		 * stores matchups in progress
		 */
		self.matchups = new Lookup();


		/**
		 * create a new matchup
		 * @param {object} account
		 * @param {object} rules
		 * @returns {{accounts: Array, rules: object, id: number}}
		 */
		self.createMatchup = function(account, rules) {
			var matchup = {
				accounts: [],
				rules: _.defaults(rules, defaultRules),
				id: nextId++
			};
			self.matchups.store(matchup.id, matchup);
			broadcast(roomName, 'createMatchup', matchup);
			self.joinMatchup(account, matchup.id);
			return matchup;
		};


		/**
		 * join an existing matchup
		 * @param {object} account
		 * @param {number} matchupId
		 * @returns {object}
		 */
		self.joinMatchup = function(account, matchupId) {
			if(matchupId === account.matchupId) {
				return 'you are already in this matchup';
			}

			self.leaveMatchup(account);

			var matchup = self.matchups.idToValue(matchupId);
			if(matchup) {
				account.matchupId = matchupId;
				matchup.accounts.push(account);
				broadcast(roomName, 'joinMatchup', {id: matchup.id, user: _.pick(account, '_id', 'name', 'site', 'group')});

				if(matchup.accounts.length >= matchup.rules.players) {
					startMatchup(matchup);
				}
			}

			return matchup;
		};


		/**
		 * Leave the matchup you are in
		 * @param {object} account
		 * @returns {string} result
		 */
		self.leaveMatchup = function(account) {
			if(!account.matchupId) {
				return 'you are not in a matchup';
			}

			var matchup = self.matchups.idToValue(account.matchupId);
			if(!matchup) {
				return 'matchup was not found';
			}

			account.matchupId = null;
			matchup.accounts = _.filter(matchup.accounts, function(acc) {
				return acc._id !== account._id;
			});

			broadcast(roomName, 'leaveMatchup', {id: matchup.id, user:account});
			cleanMatchup(matchup);

			return 'ok';
		};


		/**
		 * Send a startMatchup event, then remove the matchup
		 * @param {object} matchup
		 */
		var startMatchup = function(matchup) {
			var gameId = fns.createRandomString(12);
			new Game(matchup.accounts, matchup.rules, gameId);

			Chat.safeCreate('chat-' + gameId);

			broadcast(roomName, 'startMatchup', {id: matchup.id, gameId: gameId});
			self.matchups.deleteId(matchup.id);
		};


		/**
		 * Remove a matchup if it is empty
		 * @param {object} matchup
		 */
		var cleanMatchup = function(matchup) {
			if(matchup.accounts.length === 0) {
				broadcast(roomName, 'removeMatchup', matchup.id);
				self.matchups.deleteId(matchup.id);
			}
		};


		/**
		 * Return the lobby to its original state
		 */
		self.clear = function() {
			self.matchups.clear();
		};


		/**
		 * store this so it can be found later
		 */
		Lobby.lookup.store(roomName, self);
		return(self);
	};


	/**
	 *
	 */
	module.exports = Lobby;

}());