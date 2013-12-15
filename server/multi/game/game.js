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
			 * sort players by deck rank
			 */
			sortPlayers(players);


			/**
			 * create the board
			 */
			var board = new Board(players, rules.columns, rules.rows);


			/**
			 * start the turn ticker
			 */
			var turnTicker = new TurnTicker(players, rules.timePerTurn);
			turnTicker.nextTurn(function() {


				/**
				 * check for victory
				 */
				checkVictory();
			});
		});


		/**
		 *
		 */
		var checkVictory = function() {
			result = victoryCondition.commanderRules(players, board, turnTicker.turn);
			if(result.winner) {
				turnTicker.stop();
				prizeCalculator.run(players, winningTeam, prize, function(err) {

				});
			}
		};


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
		var getStatus = function() {
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
			emit('turn', _.pick(account, '_id', 'name'));
			//emit('gameStatus', getStatus());
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

