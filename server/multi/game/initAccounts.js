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
	 * @returns {Array.<Player>} players
	 */
	var InitAccounts = function(accounts) {
		var players = [];
		_.each(accounts, function(account) {
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
			abilities: ['rlly'],
			hasImage: true,
			cid: nextCid(),
			moves: 0,
			pride: 0
		};
	};


	/**
	 * public interface
	 */
	module.exports = InitAccounts;

}());


