angular.module('futurism')
	.factory('deckInProgress', ['DeckResource', 'shared', function(DeckResource, shared) {
		'use strict';

		var deck = new DeckResource();
		shared.deckFns.applyDefaults(deck);

		return {
			deck: deck
		}
	}]);