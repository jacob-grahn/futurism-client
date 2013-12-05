(function() {
	'use strict';

	var _ = require('lodash');
	var fns = require('../../fns/fns');
	var factions = require('../../../shared/factions');
	var defaultRules = require('./defaultRules');
	var gameLookup = require('./gameLookup');
	var initAccount = require('./initAccount');
	var Table = require('./table');
	var broadcast = require('../broadcast');

	var games = {};


	/**
	 *
	 * @param {[object]} accounts
	 * @param {object} rules
	 * @param {string} gameId
	 */
	module.exports = function(accounts, rules, gameId) {
		_.defaults(rules, defaultRules);
		var turn = 0;
		var activeAccount;
		var table = new Table(accounts);

		_.each(accounts, function(account) {
			initAccount(account, rules, gameId);
		});


		/**
		 * Creates a snapshot of everything in this game
		 * @returns {{accounts: [], turn: number, activeAccountId: number}}
		 */
		var getStatus = function() {
			return {
				accounts: accounts,
				turn: turn,
				activeAccountId: activeAccount._id
			};
		};


		/**
		 * End a player's turn
		 * @param account
		 */
		var endTurn = function(account) {
			if(account._id === activeAccount._id) {
				nextTurn();
			}
		};


		/**
		 * Start a turn for the next player in line
		 */
		var nextTurn = function() {
			drawCards();
			turn++;
			var accountIndex = (turn+1) % (accounts.length);
			var account = accounts[accountIndex];
			activeAccount = account;
			emit('sys', account.name+'\'s turn');
			emit('gameStatus', getStatus());
		};


		/**
		 *
		 * @param {string} event
		 * @param {*} data
		 */
		var emit = function(event, data) {
			broadcast(gameId, event, data);
		};


		/**
		 * If it is the accounts turn, pass the action on to the table
		 * @param account
		 * @param actionStr
		 * @param targetIds
		 * @param srcTargetId
		 */
		var doAction = function(account, actionStr, targetIds, srcTargetId) {
			if(account._id === activeAccount._id) {
				table.doAction(account, actionStr, targetIds, srcTargetId);
			}
		};


		/**
		 * fill all player's hands if they still have cards in their deck
		 */
		var drawCards = function() {
			_.each(accounts, function(account) {
				while(account.hand.length < rules.handSize && account.deck.length > 0) {
					account.hand.push(account.deck.pop());
				}
			});
		};


		/**
		 * Shuffle all the decks!
		 */
		var shuffleDecks = function() {
			_.each(accounts, function(account) {
				account.deck = _.shuffle(account.deck);
			});
		};


		/**
		 * remove an account from this game
		 */
		var quit = function(removingAccount) {
			endTurn(removingAccount);
			accounts = _.filter(accounts, function(memberAccount) {
				return memberAccount._id !== removingAccount._id;
			});
			table.setAccounts(accounts);
			removeIfEmpty();
		};


		/**
		 * call remove() if there are no accounts left in this game
		 */
		var removeIfEmpty = function() {
			if(accounts.length === 0) {
				remove();
			}
		};


		/**
		 * Clean up for removal
		 */
		var remove = function() {
			_.each(accounts, function(account) {
				delete account.gameId;
				delete account.columns;
				delete account.hand;
			});
			delete games[gameId];

			if(table) {
				table.reset();
			}
		};


		/**
		 * Kick the game off
		 */
		shuffleDecks();
		drawCards();
		nextTurn();


		/**
		 * Public interface
		 */
		var face = {
			gameId: gameId,
			startedAt: new Date(),
			getStatus: getStatus,
			drawCards: drawCards,
			endTurn: endTurn,
			remove: remove,
			doAction: doAction,
			quit: quit
		};

		gameLookup.store(gameId, face);

		return face;
	};

}());

