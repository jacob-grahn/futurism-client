(function() {
	'use strict';

	var _ = require('lodash');
	var defaultRules = require('./defaultRules');
	var gameLookup = require('./gameLookup');
	var factions = require('../../../shared/factions');


	/**
	 * Fill an account with the data structure needed to play a match
	 * @param {object} account
	 * @param {object} rules
	 * @param {string} gameId
	 */
	var initAccount = function(account, rules, gameId) {
		_.defaults(rules, defaultRules);
		clearAccount(account);
		initColumns(account, rules);
		initPrideProgress(account, rules);
		account.cards = _.cloneDeep(account.deck.cards);
		account.gameId = gameId;
		account.hand = [];
		account.graveyard = [];
		account.accountCard = makeAccountCard(account);
		account.playedSelf = false;
	};


	/**
	 * Create a card to represent the player
	 * @param {object} account
	 */
	var makeAccountCard = function(account) {
		return {
			_id: 0,
			canon: false,
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
			version: 0
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
		delete account.hand;
		delete account.graveyard;
		delete account.cards;
	};


	/**
	 * Create a 2d array of null values
	 * Represents the playable area the player can use
	 * @param {object} account
	 * @param {object} rules
	 */
	var initColumns = function(account, rules) {
		account.columns = [];
		for(var i=0; i<rules.columnCount; i++) {
			account.columns[i] = [];
			for(var j=0; j<rules.rowCount; j++) {
				account.columns[i][j] = null;
			}
		}
	};


	/**
	 * Create an object with the pride of every faction set to 0
	 * @param {object} account
	 * @param {object} rules
	 */
	var initPrideProgress = function(account, rules) {
		account.prideProgress = {};
		_.each(factions.factionLookup, function(faction) {
			account.prideProgress[faction.id] = rules.startingPride;
		});
	};


	/**
	 * public interface
	 */
	module.exports = initAccount;

}());


