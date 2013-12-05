angular.module('futurism')
	.controller('GamePreDeckCtrl', function($scope, $location, $routeParams, DeckResource, socket) {
		'use strict';

		$scope.decks = DeckResource.query(function(){});
		$scope.maxPride = $routeParams.maxPride;


		$scope.select = function(deck) {
			if(deck.pride <= $scope.maxPride) {
				socket.emit('selectDeck', {gameId: $routeParams.gameId, deckId: deck._id});
			}
		};

		socket.on('selectDeckStatus', function(data) {
			console.log('rec selectDeckStatus', data);
			if(!data.error) {
				$location.url('/game/' + $routeParams.gameId);
			}
		});

		$scope.$on('$destroy', function() {
			socket.removeAllListeners('selectDeckStatus');
		});

	});