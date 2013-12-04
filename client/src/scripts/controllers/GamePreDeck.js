angular.module('futurism')
	.controller('GamePreDeckCtrl', function($scope, $location, $routeParams, DeckResource, socket) {
		'use strict';

		$scope.decks = DeckResource.query(function(){});
		$scope.maxPride = $routeParams.maxPride;


		$scope.select = function(deck) {
			socket.emit('selectDeck', {gameId: $routeParams.gameId, deckId: deck._id});
			$location.url('/game/' + $routeParams.gameId);
		};

	});