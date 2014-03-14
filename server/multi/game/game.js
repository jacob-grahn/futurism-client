(function() {
	'use strict';

	var _ = require('lodash');
	var DiffTracker = require('../../fns/diffTracker');
	var factions = require('../../../shared/factions');
	var broadcast = require('../broadcast');
	var actionFns = require('./actionFns');
	var actions = require('./../../../shared/actions');
	var Board = require('./board');
	var defaultRules = require('./defaultRules');
	var effects = require('./effects');
	var filters = require('./../../../shared/filters');
	var gameLookup = require('./gameLookup');
	var initAccounts = require('./initAccounts');
	var Loadup = require('./loadup');
	var prizeCalculator = require('./prizeCalculator');
	var TurnTicker = require('./turnTicker');
	var victoryCondition = require('./victoryCondition');
	var Recorder = require('./recorder');


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
		 * initialize variables and helper classes
		 */
		self.players = initAccounts(accounts);
		self.board = new Board(self.players, rules.columns, rules.rows);
		self.turnTicker = new TurnTicker(self.players, rules.turnDuration);
		self.diffTracker = new DiffTracker();
		self.recorder = new Recorder();


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
			self.turnTicker.populateTurn();
			self.broadcastChanges();


			/**
			 * start the turn ticker
			 */
			self.turnTicker.start(

				/**
				 * at the start of every turn
				 * @param {Number} startTime
				 */
				function(startTime) {


					/**
					 * tell the clients to move to the next turn
					 */
					self.emit('turn', {
						startTime: startTime,
						turnOwners: self.turnTicker.getTurnOwnerIds()
					});


					/**
					 * refill hands
					 */
					self.drawCards(self.players, rules.handSize);
					effects.hand(self.players);
					self.broadcastChanges('rlly', effects.rally(self.turnTicker.turnOwners[0], self.board));
				},


				/**
				 * at the end of every turn
				 * @param {Number} elapsed
				 */
				function(elapsed) {


					/**
					 * apply effects
					 */
					var turnTargets = self.board.playerTargets(self.turnTicker.turnOwners[0]._id);
					self.doEffect('poison', turnTargets);
					self.doEffect('deBuf', turnTargets);
					self.doEffect('refresh', turnTargets);
					self.doEffect('death', self.board.allTargets());


					/**
					 * check for victory
					 */
					var result = victoryCondition.commanderRules(self.players, self.board, self.turnTicker.turn);
					if(result.winner) {
						self.state = 'awarding';
						self.turnTicker.stop();

						prizeCalculator.run(self.players, result.team, false, function(err, users) {
							if(err) {
								self.remove();
								return false;
							}


							/**
							 * save a record of this game
							 */
							self.state = 'saving';
							self.recorder.users = self.players;
							self.recorder.save(gameId, function(err, doc) {
								if(err) {
									self.emit('error', err);
									self.remove();
									return false;
								}

								/**
								 * That's it, we're done
								 */
								self.emit('gameOver', null);
								self.remove();
							});
						});
					}
				}
			);
		});


		/**
		 * Find a card with the provided cid
		 * @param cards
		 * @param cid
		 * @returns {*}
		 */
		self.cidToCard = function(cards, cid) {
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
				if(String(player._id) === String(id)) {
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

			status.players = _.assign({}, _.map(self.players, function(player) {
				return _.pick(player, '_id', 'team', 'name', 'site', 'pride', 'futures');
			}));

			status.turnOwners = self.turnTicker.getTurnOwnerIds();
			status.board = self.board.compactClone();
			status.turn = self.turnTicker.turn;
			status.startTime = self.turnTicker.startTime;
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
		 * broadcast changes as a partial update
		 */
		self.broadcastChanges = function(cause, data) {
			if(data !== false) {
				var status = self.getStatus();
				var changes = self.diffTracker.diff(status, false);
				if(!_.isEmpty(changes)) {
					self.emit('gameUpdate', {cause: cause, changes: changes, data: data});
				}
			}
		};


		/**
		 * If it is the accounts turn, pass the action on to the table
		 * @param {Player} player
		 * @param {String} actionId
		 * @param {Array} targetChain
		 */
		self.doAction = function(player, actionId, targetChain) {

			// its gotta be your turn
			if(!self.turnTicker.isTheirTurn(player)) {
				return 'it is not your turn';
			}

			// do the action
			var result = actionFns.doAction(self, player, actionId, targetChain);

			// create a list of changed targets
			self.broadcastChanges(actionId, {result: result, targetChain: targetChain});

			//
			return 'ok';
		};



		/**
		 * run an effect, and broadcast the changes if there are any
		 * @param effectName
		 * @param targets
		 */
		self.doEffect = function(effectName, targets) {
			effects[effectName](targets);
			self.broadcastChanges(effectName);
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
			player.forfeited = true;
			self.board.areas[player._id].targets = [];
			self.broadcastChanges('forfeit');
			self.endTurn(player);
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

