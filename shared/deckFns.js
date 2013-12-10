(function () {
	'use strict';

	if(typeof require !== 'undefined') {
		var cardFns = require('./cardFns');
	}
	else {
		cardFns = futurismShared.cardFns;
	}

	var deckFns = {

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

		applyDefaults: function(deck) {
			deck.name = 'New Deck';
			deck.cards = [];
			deck.pride = 0;
			deck._id = null;
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