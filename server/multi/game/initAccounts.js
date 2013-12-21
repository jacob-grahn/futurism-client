(function() {
	'use strict';

	var _ = require('lodash');
	var gameLookup = require('./gameLookup');
	var factions = require('../../../shared/factions');
	var Player = require('./player');
	var nextCid = require('./nextCid');


	/**
	 * Fill an account with the data structure needed to play a match
	 * @param {Array} accounts
	 * @param {String} gameId
	 * @returns {Array.<Player>} players
	 */
	var InitAccounts = function(accounts, gameId) {
		var players = [];
		_.each(accounts, function(account) {
			clearAccount(account);
			account.gameId = gameId;
			var player = new Player(account);
			player.hand.push(makeAccountCard(account));
			players.push(player);
		});

		return players;
	};


	/**
	 * Create a card to represent the player
	 * @param {object} account
	 */
	var makeAccountCard = function(account) {
		return {
			_id: 0,
			commander: true,
			userId: account._id,
			name: account.name,
			faction: 'no',
			attack: 0,
			health: 10,
			story: '',
			abilities: [],
			updated: Date.now(),
			hasImage: true,
			cid: nextCid(),
			moves: 0,
			pride: 0
		};
	};


	/**
	 * Return an account to a pre game state
	 * @param {object} account
	 */
	var clearAccount = function(account) {
		if(account.gameId) {
			var game = gameLookup.idToGame(account.gameId);
			if(game) {
				game.quit(account);
			}
		}
		delete account.gameId;
	};


	/**
	 * public interface
	 */
	module.exports = InitAccounts;

}());


