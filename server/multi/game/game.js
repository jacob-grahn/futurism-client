(function() {
	'use strict';

	var _ = require('lodash');
	var fns = require('../../fns/fns');
	var factions = require('../../../shared/factions');
	var broadcast = require('../broadcast');
	var actions = require('./actions');
	var Board = require('./board');
	var defaultRules = require('./defaultRules');
	var effects = require('./effects');
	var filters = require('./filters');
	var gameLookup = require('./gameLookup');
	var initAccounts = require('./initAccounts');
	var Loadup = require('./loadup');
	var prizeCalculator = require('./prizeCalculator');
	var TurnTicker = require('./turnTicker');
	var victoryCondition = require('./victoryCondition');


	/**
	 *
	 * @param {[object]} accounts
	 * @param {object} rules
	 * @param {string} gameId
	 */
	module.exports = function(accounts, rules, gameId) {
		var self = this;
		var board;
		self.gameId = gameId;


		/**
		 * apply default rules
		 */
		_.defaults(rules, defaultRules);


		/**
		 * just exit if no players are here
		 */
		if(accounts.length === 0) {
			return false;
		}


		/**
		 * initialize everyone's account
		 */
		var players = initAccounts(accounts, gameId);


		/**
		 * preload decks and futures
		 */
		var loadup = new Loadup(players, rules, function() {


			/**
			 * get ready to play
			 */
			sortPlayers(players);
			shuffleDecks();
			drawCards();


			/**
			 * create the board
			 */
			board = new Board(players, rules.columns, rules.rows);


			/**
			 * start the turn ticker
			 */
			var turnTicker = new TurnTicker(players, rules.timePerTurn, function() {


				/**
				 * refill hands
				 */
				drawCards();


				/**
				 * check for victory
				 */
				result = victoryCondition.commanderRules(players, board, turnTicker.turn);
				if(result.winner) {
					turnTicker.stop();
					prizeCalculator.run(players, result.team, false, function(err) {


						/**
						 * That's it, we're done
						 */
						self.remove();
					});
				}
			});
		});


		/**
		 * Sort players by their deck pride. Lowest pride goes first
		 * Shuffle first so that equal pride players will be randomized
		 */
		var sortPlayers = function(players) {
			_.shuffle(players);
			players.sort(function(a, b) {
				return a.deck.pride - b.deck.pride;
			});
			return players;
		};


		/**
		 * Returns a snapshot of everything in this game
		 */
		self.getStatus = function() {
			var playersPub = _.map(players, function(player) {
				return _.pick(player, '_id', 'team', 'name', 'site', 'pride', 'active');
			});
			return {
				players: playersPub,
				turn: turnTicker.turn
			};
		};


		/**
		 * End a player's turn
		 * @param account
		 */
		self.endTurn = function(account) {
			if(account._id === activeAccount._id) {
				nextTurn();
			}
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
		 */
		self.doAction = function(account, actionStr, targetIds, srcTargetId) {
			if(account._id === activeAccount._id) {
				table.doAction(account, actionStr, targetIds, srcTargetId);
			}
		};


		/**
		 * fill all player's hands if they still have cards in their deck
		 */
		var drawCards = function() {
			_.each(accounts, function(account) {
				while(account.hand.length < rules.handSize && account.cards.length > 0) {
					account.hand.push(account.cards.pop());
				}
			});
		};


		/**
		 * Shuffle all the decks!
		 */
		var shuffleDecks = function() {
			_.each(accounts, function(account) {
				account.cards = _.shuffle(account.cards);
			});
		};


		/**
		 * remove an account from this game
		 */
		self.quit = function(removingAccount) {

		};


		/**
		 * Clean up for removal
		 */
		self.remove = function() {
			accounts = null;
			if(board) {
				board.remove();
				board = null;
			}
			gameLookup.deleteId(gameId);
		};


		/**
		 * Store this game so it can be accessed from gameInterface.js
		 */
		gameLookup.store(gameId, self);
	};

}());

