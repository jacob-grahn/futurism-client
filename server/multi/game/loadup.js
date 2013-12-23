(function() {
	'use strict';

	var _ = require('lodash');
	var DeckGoose = require('../../models/deck');
	var deckFns = require('../../../shared/deckFns');
	var nextCid = require('./nextCid');


	/**
	 * @class Preload player's decks and futures before a game starts
	 *
	 * @param {array.<Player>} players
	 * @param {object} rules
	 * @param {function} callback
	 */
	var Loadup = function(players, rules, callback) {
		var self = this;


		/**
		 * Load a deck from mongo, then add those cards to the player
		 * @param {Player} player
		 * @param {string} deckId
		 * @param {function} callback
		 * @returns {null}
		 */
		self.selectDeck = function(player, deckId, callback) {
			console.log('loadup::selectDeck', player, deckId);
			DeckGoose
				.findById(deckId)
				.populate('cards')
				.exec(function(err, deck) {
					if(err) {
						return callback(err);
					}
					if(!deck) {
						return callback('deck id "'+deckId+'" not found');
					}

					deck.pride = deckFns.calcPride(deck);

					if(deck.pride > rules.pride) {
						return callback('this deck is too prideful');
					}
					if(player.cards.length > 0) {
						return callback('a deck was already loaded for you');
					}
					if(player._id !== deck.userId) {
						return callback('you do not own this deck');
					}

					player.deckPride = deck.pride;
					player.cards = _.cloneDeep(deck.cards);
					_.each(player.cards, function(card) {
						card.cid = nextCid();
						card.moves = 0;
					});

					self.nextIfDone();
					return callback(null, deck);
				});
		};


		/**
		 * Call next if every account has loaded a deck
		 */
		self.nextIfDone = function() {
			var allLoaded = true;
			_.each(players, function(player) {
				if(!player.cards.length > 0) {
					allLoaded = false;
				}
			});
			if(allLoaded) {
				self.next();
			}
		};


		/**
		 * Callback with every player
		 * @returns {*}
		 */
		self.next = function() {
			clearTimeout(forceStartTimeout);
			return callback(null, players);
		};


		/**
		 * Give people 30 seconds (default) to pick a deck before leaving them behind
		 */
		var forceStartTimeout = setTimeout(self.next, rules.prepTime*1000);
	};

	module.exports = Loadup;

}());