angular.module('futurism')
	.controller('DeckSelectorCtrl', ['$scope', '$location', 'deckInProgress', 'DeckResource', function($scope, $location, deckInProgress, DeckResource) {
		'use strict';

		$scope.decks = DeckResource.query(function(){});


		$scope.select = function(deck) {
			deckInProgress.deck = DeckResource.get({deckId: deck._id});
			$location.url('/deck-builder');
		};

	}]);