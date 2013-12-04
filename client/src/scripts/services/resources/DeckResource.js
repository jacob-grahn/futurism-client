angular.module('futurism')
	.factory('DeckResource', ['$resource', function($resource) {
		'use strict';

		var DeckResource = $resource('/api/decks', {}, {
		});

		return DeckResource;
	}]);