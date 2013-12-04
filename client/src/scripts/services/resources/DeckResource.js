angular.module('futurism')
	.factory('DeckResource', function($resource) {
		'use strict';

		var DeckResource = $resource('/api/decks', {}, {
		});

		return DeckResource;
	});