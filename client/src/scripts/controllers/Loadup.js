angular.module('futurism')
	.controller('LoadupCtrl', function($scope, $location, $routeParams, DeckResource, socket, errorHandler) {
		'use strict';

		socket.connect($routeParams.serverId);
		$scope.decks = DeckResource.query(function(){});
		$scope.maxDeckSize = $routeParams.deckSize;
		$scope.futureCount = Number($routeParams.futures);
		$scope.state = 'selectingDeck';


		$scope.select = function(deck) {
			if(deck.cards.length <= $scope.maxDeckSize) {
				socket.emit('selectDeck', {gameId: $routeParams.gameId, deckId: deck._id});
			}
		};

		$scope.isAvailable = function(deck) {
			if(deck.cards.length <= $scope.maxDeckSize) {
				return 'active';
			}
			else {
				return 'inactive';
			}
		};

		socket.$on('selectDeckResult', function(data) {
			if(data.result === 'success') {
				if($scope.futureCount === 0) {
					$location.url('/game/' + $routeParams.serverId + '/' + $routeParams.gameId);
				}
				else {
					$scope.state = 'selectingFutures';
				}
			}
			else {
				errorHandler.handle(data.error);
			}
		});

		$scope.$on('$destroy', function() {
			socket.removeAllListeners('selectDeckStatus');
		});

	});
