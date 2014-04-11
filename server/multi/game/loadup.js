(function() {
	'use strict';

	var _ = require('lodash');
	var DeckGoose = require('../../models/deck');
	var deckFns = require('../../../shared/deckFns');
	var cardFns = require('../../../shared/cardFns');
	var factions = require('../../../shared/factions');
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
					if(deck.cards.length > rules.deckSize) {
						return callback('this deck has too many cards');
					}
					if(player.cards.length > 0) {
						return callback('a deck was already loaded for you');
					}
					if(String(player._id) !== String(deck.userId)) {
						return callback('you do not own this deck');
					}

					player.deck = deck;
					player.deckSize = deck.cards.length;
					player.cards = [];
					_.each(deck.cards, function(card) {
						var gameCard = self.prepareCard(card);
						player.cards.push(gameCard);
					});

					self.nextIfDone();
					return callback(null, deck);
				});
		};


		/**
		 * prepare a card to be used in a game
		 * @param card
		 */
		self.prepareCard = function(card) {
			var gameCard = _.pick(card, 'faction', 'attack', 'health', 'abilities', 'hasImage', 'name', 'story', 'userId', '_id');
			gameCard.cid = nextCid();
			gameCard.moves = 0;

			// remove duplicate abilities
			gameCard.abilities = _.unique(gameCard.abilities);

			// remove invalid abilities
			gameCard.abilities = _.filter(gameCard.abilities, function(abilityId) {
				var factionObj = factions.factionLookup[gameCard.faction];
				var matches = _.filter(factionObj.abilities, function(abilityObj) {
					return abilityObj.id === abilityId;
				});
				return matches.length > 0;
			});

			// calc pride cost for this card
			gameCard.pride = cardFns.calcPride(gameCard);

			return gameCard;
		};


		/**
		 * Select which futures you can use in this game
		 * @param {Player} player
		 * @param {Array} futures
		 * @param {Function} callback
		 */
		self.selectFutures = function(player, futures, callback) {
			player.futures = futures;
			return callback(null, futures);
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