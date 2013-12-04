angular.module('futurism')
	.factory('DeckResource', ['$resource', function($resource) {

		var DeckResource = $resource('/api/decks', {}, {
		});

		return DeckResource;
	}]);