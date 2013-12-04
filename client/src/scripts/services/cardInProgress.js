angular.module('futurism')
	.factory('cardInProgress', ['CardResource', 'shared', function(CardResource, shared) {
		'use strict';

		var card = new CardResource();
		shared.cardFns.applyDefaults(card);

		return {
			card: card
		};
	}]);