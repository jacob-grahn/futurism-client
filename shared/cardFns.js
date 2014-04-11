(function () {
	'use strict';

	var cardFns = {

		calcPride: function(card) {
			var pride = Number(card.attack) + Number(card.health) + card.abilities.length;
			return(pride);
		},

		applyDefaults: function(card) {
			card.name = 'New Card';
			card.attack = 1;
			card.health = 1;
			card.pride = 1;
			card.abilities = [];
			card.story = '';
			card.faction = 'en';
			card.id = null;
			card._id = null;
			card.imageUrl = null;
			card.hasImage = false;
			return(card);
		}
	};


	/**
	 * export
	 */
	if (typeof module !== 'undefined') {
		module.exports = cardFns;
	}
	else {
		window.futurismShared = window.futurismShared || {};
		window.futurismShared.cardFns = cardFns;
	}
}());