(function() {
	'use strict';

	var Game = require('./game/game');
	var broadcast = require('./broadcast');
	var Lookup = require('../fns/lookup');
	var createRandomString = require('../fns/createRandomString');
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
	 * @param lobbyId
	 */
	Lobby.createRoom = function(lobbyId) {
		var lobby = {};
		lobby.id = lobbyId;


		/**
		 * stores matchups in progress
		 */
		lobby.matchups = new Lookup();


		/**
		 * create a new matchup
		 * @param {object} account
		 * @param {object} rules
		 * @returns {{accounts: Array, rules: object, id: number}}
		 */
		lobby.createMatchup = function(account, rules) {
			var matchup = {
				accounts: [],
				rules: _.defaults(rules, defaultRules),
				id: nextId++
			};
			lobby.matchups.store(matchup.id, matchup);
			console.log('lobby.createMatchup', lobbyId);
			broadcast(lobbyId, 'createMatchup', matchup);
			lobby.joinMatchup(account, matchup.id);
			return matchup;
		};


		/**
		 * join an existing matchup
		 * @param {object} account
		 * @param {number} matchupId
		 * @returns {object}
		 */
		lobby.joinMatchup = function(account, matchupId) {
			if(matchupId === account.matchupId) {
				return 'you are already in this matchup';
			}

			lobby.leaveMatchup(account);

			var matchup = lobby.matchups.idToValue(matchupId);
			if(matchup) {
				account.matchupId = matchupId;
				matchup.accounts.push(account);
				broadcast(lobbyId, 'joinMatchup', {id: matchup.id, user: _.pick(account, '_id', 'name', 'site', 'group')});

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
		lobby.leaveMatchup = function(account) {
			if(!account.matchupId) {
				return 'you are not in a matchup';
			}

			var matchup = lobby.matchups.idToValue(account.matchupId);
			if(!matchup) {
				return 'matchup was not found';
			}

			account.matchupId = null;
			matchup.accounts = _.filter(matchup.accounts, function(acc) {
				return acc._id !== account._id;
			});

			broadcast(lobbyId, 'leaveMatchup', {id: matchup.id, user:account});
			cleanMatchup(matchup);

			return 'ok';
		};


		/**
		 * Send a startMatchup event, then remove the matchup
		 * @param {object} matchup
		 */
		var startMatchup = function(matchup) {
			var gameId = createRandomString(12);
			new Game(matchup.accounts, matchup.rules, gameId);
			broadcast(lobbyId, 'startMatchup', {id: matchup.id, gameId: gameId});
			lobby.matchups.deleteId(matchup.id);
		};


		/**
		 * Remove a matchup if it is empty
		 * @param {object} matchup
		 */
		var cleanMatchup = function(matchup) {
			if(matchup.accounts.length === 0) {
				broadcast(lobbyId, 'removeMatchup', matchup.id);
				lobby.matchups.deleteId(matchup.id);
			}
		};


		/**
		 * Return the lobby to its original state
		 */
		lobby.clear = function() {
			lobby.matchups.clear();
		};


		/**
		 * store this so it can be found later
		 */
		Lobby.lookup.store(lobbyId, lobby);
		return(lobby);
	};


	/**
	 *
	 */
	module.exports = Lobby;

}());