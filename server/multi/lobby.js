(function() {
	'use strict';

	var sharedFns = require('../../shared/fns');
	var fns = require('../fns/fns');
	var Game = require('./game/game');
	var DeckPreload = require('./deckPreload');
	var Chat = require('./chat');
	var broadcast = require('./broadcast');
	var Lookup = require('../fns/lookup');
	var _ = require('lodash');
	var defaultRules = require('./game/defaultRules');

	var nextId = 1;
	var lobbyLookup = Lookup();


	/**
	 * Player matchmaking
	 * matchups are created by users, then filled with other users
	 * @param roomName
	 * @returns {{matchups: (*|lookup|exports), createMatchup: Function, joinMatchup: Function, leaveMatchup: Function, clear: Function}}
	 * @constructor
	 */
	var Lobby = function(roomName) {


		/**
		 * stores matchups in progress
		 */
		var matchups = Lookup();
		matchups.idToMatchup = matchups.idToValue;


		/**
		 * create a new matchup
		 * @param {object} account
		 * @param {object} rules
		 * @returns {{users: Array, rules: object, id: number}}
		 */
		var createMatchup = function(account, rules) {
			var matchup = {
				users: [],
				rules: _.defaults(rules, defaultRules),
				id: nextId++
			};
			matchups.store(matchup.id, matchup);
			broadcast(roomName, 'createMatchup', matchup);
			joinMatchup(account, matchup.id);
			return matchup;
		};


		/**
		 * join an existing matchup
		 * @param {object} account
		 * @param {number} matchupId
		 * @returns {object}
		 */
		var joinMatchup = function(account, matchupId) {
			if(matchupId === account.matchupId) {
				return 'you are already in this matchup';
			}

			leaveMatchup(account);

			var matchup = matchups.idToMatchup(matchupId);
			if(matchup) {
				account.matchupId = matchupId;
				matchup.users.push(account);
				broadcast(roomName, 'joinMatchup', {id: matchup.id, user: _.pick(account, '_id', 'name', 'site', 'group')});

				if(matchup.users.length >= matchup.rules.players) {
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
		var leaveMatchup = function(account) {
			if(!account.matchupId) {
				return 'you are not in a matchup';
			}

			var matchup = matchups.idToMatchup(account.matchupId);

			if(matchup) {
				account.matchupId = null;
				sharedFns.removeFromArrayFunc(matchup.users, function(obj) {
					return obj._id === account._id;
				});
				broadcast(roomName, 'leaveMatchup', {id: matchup.id, user:account});
				cleanMatchup(matchup);
			}
		};


		/**
		 * Send a startMatchup event, then remove the matchup
		 * @param {object} matchup
		 */
		var startMatchup = function(matchup) {
			var gameId = fns.createRandomString(12);

			Chat.safeCreate('chat-' + gameId);

			console.log('starting deck preload', gameId);
			DeckPreload.startGroup(gameId, matchup.users, matchup.rules, function(err, accounts) {
				console.log('starting game', gameId);
				new Game(accounts, matchup.rules, gameId);
			});

			broadcast(roomName, 'startMatchup', {id: matchup.id, gameId: gameId});
			matchups.deleteId(matchup.id);
		};


		/**
		 * Remove a matchup if it is empty
		 * @param {object} matchup
		 */
		var cleanMatchup = function(matchup) {
			if(matchup.users.length === 0) {
				broadcast(roomName, 'removeMatchup', matchup.id);
				matchups.deleteId(matchup.id);
			}
		};


		/**
		 * Return the lobby to its original state
		 */
		var clear = function() {
			matchups.clear();
		};


		/**
		 * public interface
		 */
		var face = {
			matchups: matchups,
			createMatchup: createMatchup,
			joinMatchup: joinMatchup,
			leaveMatchup: leaveMatchup,
			clear: clear
		};


		/**
		 * store the interface
		 */
		lobbyLookup.store(roomName, face);
		return face;
	};



	/**
	 * Hookup a socket to these functions
	 * @param socket
	 */
	Lobby.initSocket = function(socket) {
		socket.on('createMatchup', function(data) {
			Lobby.pass(socket, data, function(lobby, account) {
				lobby.createMatchup(account, data.rules);
			});
		});

		socket.on('joinMatchup', function(data) {
			Lobby.pass(socket, data, function(lobby, account) {
				lobby.joinMatchup(account, data.matchupId);
			});
		});

		socket.on('leaveMatchup', function(data) {
			Lobby.pass(socket, data, function(lobby, account) {
				lobby.leaveMatchup(account);
			});
		});

		socket.on('allMatchups', function(data) {
			var lobby = lobbyLookup.idToValue(data.lobbyName);
			if(lobby) {
				socket.emit('allMatchups', lobby.matchups.toArray());
			}
		});

		socket.on('disconnect', function() {
			socket.get('account', function(err, account) {
				if(err) {
					return err;
				}
				return Lobby.leaveAll(account);
			});
		});
	};


	/**
	 * Remove account from all matchups in all lobbies
	 * @param account
	 */
	Lobby.leaveAll = function(account) {
		_.each(lobbyLookup.toArray(), function(lobby) {
			lobby.leaveMatchup(account);
		});
	};


	/**
	 * shortcut to turn a socket into an account, lookup the requested lobby, then call a function on that lobby
	 * @param socket
	 * @param data
	 * @param callback
	 */
	Lobby.pass = function(socket, data, callback) {
		var lobby = lobbyLookup.idToValue(data.lobbyName);
		if(!lobby) {
			return socket.emit('error', 'lobby not found');
		}

		socket.get('account', function(err, account) {
			if(err) {
				return socket.emit('error', err);
			}

			return callback(lobby, account);
		});
	};


	/**
	 *
	 * @type {Function}
	 */
	module.exports = Lobby;

}());