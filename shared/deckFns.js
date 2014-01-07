(function () {
	'use strict';

	var _, cardFns, factions;


	/**
	 * dependencies
	 */
	if(typeof require !== 'undefined') {
		_ = require('lodash');
		cardFns = require('./cardFns');
	}
	else {
		_ = window._;
		cardFns = futurismShared.cardFns;
	}


	/**
	 * Handy functions for decks
	 */
	var deckFns = {


		/**
		 * Sum up the pride for every card in the deck
		 * @param {{cards:Array}} deck
		 * @returns {number}
		 */
		calcPride: function(deck) {
			if(!deck.cards) {
				return 0;
			}

			var pride = 0;

			for(var i=0; i<deck.cards.length; i++) {
				var card = deck.cards[i];
				var cardPride = cardFns.calcPride(card);
				pride += cardPride;
			}

			return pride;
		},


		/**
		 * Reset a deck to defaults
		 * @param deck
		 */
		applyDefaults: function(deck) {
			deck.name = 'New Deck';
			deck.cards = [];
			deck.pride = 0;
			deck._id = null;
		},


		/**
		 * Sum up the pride for every card in the deck
		 * @param {{cards:Array}} deck
		 * @returns {!Object}
		 */
		analyze: function(deck) {
			var desc = {};
			desc.stats = deckFns.analyzeStats(deck);
			desc.abilities = deckFns.analyzeAbilities(deck);
			desc.factions = deckFns.analyzeFactions(deck);

			return desc;
		},


		/**
		 * Tally up some misc stats about the deck
		 * @param deck
		 * @returns {{}}
		 */
		analyzeStats: function(deck) {
			var obj = {};

			obj.pride = deckFns.calcPride(deck);
			obj.cardCount = deck.cards.length;
			obj.attack = 0;
			obj.health = 0;

			_.each(deck.cards, function(card) {
				obj.attack += card.attack;
				obj.health += card.health;
			});

			return obj;
		},


		/**
		 * Calc how often factions occur in a deck
		 * @param deck
		 * @returns {{}}
		 */
		analyzeFactions: function(deck) {
			var obj = {};
			var totCount = 0;

			// calc totals
			_.each(deck.cards, function(card) {
				totCount++;
				obj[card.faction] = obj[card.faction] || {count: 0};
				obj[card.faction].count += 1;
			});

			//calc percentages
			_.each(obj, function(faction) {
				faction.perc = faction.count / totCount;
			});

			//
			return obj;
		},


		/**
		 * Calc how often abilities occur in a deck
		 * @param deck
		 * @returns {{}}
		 */
		analyzeAbilities: function(deck) {
			var obj = {};
			var totCount = 0;

			// calc totals
			_.each(deck.cards, function(card) {
				_.each(card.abilities, function(abilityId) {
					totCount++;
					obj[abilityId] = obj[abilityId] || {count: 0};
					obj[abilityId].count += 1;
				});
			});

			// calc percentages
			_.each(obj, function(ability) {
				ability.perc = ability.count / totCount;
			});

			//
			return obj;
		}
	};


	/**
	 * export
	 */
	if (typeof module !== 'undefined') {
		module.exports = deckFns;
	}
	else {
		window.futurismShared = window.futurismShared || {};
		window.futurismShared.deckFns = deckFns;
	}
}());