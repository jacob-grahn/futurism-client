(function() {
	'use strict';

	var _ = require('lodash');
	var fns = require('../../fns/fns');
	var factions = require('../../../shared/factions');
	var broadcast = require('../broadcast');
	var actionFns = require('./actionFns');
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
	 * preload decks, then loop through player turns until someone wins
	 * @param {[object]} accounts
	 * @param {object} rules
	 * @param {string} gameId
	 */
	module.exports = function(accounts, rules, gameId) {
		var self = this;
		self.state = 'loadup';


		/**
		 * apply default rules
		 */
		_.defaults(rules, defaultRules);


		/**
		 * just exit if no players are here
		 */
		if(accounts.length === 0) {
			return;
		}


		/**
		 * initialize everybody's account
		 */
		self.players = initAccounts(accounts);


		/**
		 * create the board
		 */
		self.board = new Board(self.players, rules.columns, rules.rows);


		/**
		 * create the turn ticker
		 */
		self.turnTicker = new TurnTicker(self.players, rules.timePerTurn);


		/**
		 * preload decks and futures
		 */
		self.loadup = new Loadup(self.players, rules, function() {


			/**
			 * get ready to play
			 */
			self.sortPlayers(self.players);
			self.shuffleDecks(self.players);
			self.drawCards(self.players, rules.handSize);
			self.state = 'running';


			/**
			 * start the turn ticker
			 */
			self.turnTicker.start(function(elapsed, turnOwners) {


				/**
				 * refill hands
				 */
				self.drawCards(self.players, rules.handSize);


				/**
				 * apply effects
				 */
				var turnTargets = self.board.playerTargets(turnOwners[0]._id);
				effects.poison(turnTargets);
				effects.deBuf(turnTargets);
				effects.refresh(turnTargets);
				effects.death(self.board.allTargets());


				/**
				 * check for victory
				 */
				var result = victoryCondition.commanderRules(self.players, self.board, self.turnTicker.turn);
				if(result.winner) {
					self.state = 'awarding';
					self.turnTicker.stop();

					prizeCalculator.run(self.players, result.team, false, function() {

						/**
						 * That's it, we're done
						 */
						self.remove();

					});
				}
			});
		});


		/**
		 * Move a card from your hand to the board
		 * @param {Player} player
		 * @param {Number} cid
		 * @param {Number} column
		 * @param {Number} row
		 * @returns {string}
		 */
		self.playCard = function(player, cid, column, row) {
			var card = self.findCard(player.hand, cid);
			var target = self.board.target(player._id, column, row);

			if(!card) {
				return 'that card is not in your hand';
			}
			if(target.player !== player) {
				return 'this card must be placed on a target you own';
			}
			if(target.card) {
				return 'there is already a card here';
			}
			if(card.pride < player.pride) {
				return 'you do not have enough pride to play this card';
			}
			if(!self.turnTicker.isTheirTurn(player)) {
				console.log(player, self.turnTicker.turnOwners);
				return 'it is not your turn';
			}

			card.moves = 0;
			player.pride -= card.pride;
			target.card = card;

			return 'ok';
		};


		/**
		 * Find a card with the provided cid
		 * @param cards
		 * @param cid
		 * @returns {*}
		 */
		self.findCard = function(cards, cid) {
			var matchCard = null;
			_.each(cards, function(card) {
				if(card.cid === cid) {
					matchCard = card;
				}
			});
			return matchCard;
		};


		/**
		 * Find a player using their id
		 * @param {number} id
		 * @returns {Player} player
		 */
		self.idToPlayer = function(id) {
			var match = null;
			_.each(self.players, function(player) {
				if(player._id === id) {
					match = player;
				}
			});
			return match;
		};


		/**
		 * Returns a snapshot of everything in this game
		 */
		self.getStatus = function() {
			var status = {};

			status.players = _.map(self.players, function(player) {
				return _.pick(player, '_id', 'team', 'name', 'site', 'pride', 'active');
			});

			status.turnOwners = _.map(self.turnTicker.turnOwners, function(player) {
				return player._id;
			});

			status.board = self.board.compactClone();
			status.turn = self.turnTicker.turn;
			status.state = self.state;

			return status;
		};


		/**
		 * End a player's turn
		 * @param player
		 * @returns {string}
		 */
		self.endTurn = function(player) {
			if(!self.turnTicker.isTheirTurn(player)) {
				return 'it is not your turn';
			}
			self.turnTicker.endTurn();
			return 'ok';
		};


		/**
		 * broadcast to subscribers
		 * @param {string} event
		 * @param {*} data
		 */
		self.emit = function(event, data) {
			broadcast(gameId, event, data);
		};


		/**
		 * If it is the accounts turn, pass the action on to the table
		 * @param player
		 * @param actionStr
		 * @param targetPositions
		 */
		self.doAction = function(player, actionStr, targetPositions) {
			if(!self.turnTicker.isTheirTurn(player)) {
				return 'it is not your turn';
			}
			return actionFns.doAction(self.board, player, actionStr, targetPositions);
		};


		/**
		 * Clean up for removal
		 */
		self.remove = function() {
			self.state = 'removed';
			accounts = null;
			self.board.remove();
			self.turnTicker.stop();
			gameLookup.deleteId(gameId);
		};


		/**
		 * forfeit a player from the game
		 */
		self.forfeit = function(player) {
			player.cards = [];
			player.hand = [];
			player.graveyard = [];
			self.board.areas[player._id].targets = [];
		};


		/**
		 * Sort players by their deck pride. Lowest pride goes first
		 * Shuffle first so that equal pride players will be randomized
		 */
		self.sortPlayers = function(players) {
			_.shuffle(players);
			players.sort(function(a, b) {
				return a.deckPride - b.deckPride;
			});
			return players;
		};


		/**
		 * Shuffle all the decks!
		 */
		self.shuffleDecks = function(players) {
			_.each(players, function(player) {
				player.cards = _.shuffle(player.cards);
			});
		};


		/**
		 * fill all player's hands if they still have cards in their deck
		 */
		self.drawCards = function(players, handSize) {
			_.each(players, function(player) {
				while(player.hand.length < handSize && player.cards.length > 0) {
					player.hand.push(player.cards.pop());
				}
			});
		};


		/**
		 * Store this game so it can be accessed from gameInterface.js
		 */
		gameLookup.store(gameId, self);
	};

}());

