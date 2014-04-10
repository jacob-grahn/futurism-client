angular.module('futurism')
	.controller('LoadupDeckCtrl', function($scope, $location, loadup, DeckResource) {
		'use strict';

		$scope.decks = DeckResource.query(function(){});
		$scope.rules = loadup.rules;


		$scope.select = function(deck) {
			loadup.selectDeck(deck._id);
		};

	});
