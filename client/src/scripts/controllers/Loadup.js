angular.module('futurism')
	.controller('LoadupCtrl', function($scope, $location, $routeParams, DeckResource, socket, errorHandler) {
		'use strict';

		$scope.decks = DeckResource.query(function(){});
		$scope.maxPride = $routeParams.maxPride;


		$scope.select = function(deck) {
			if(deck.pride <= $scope.maxPride) {
				socket.emit('selectDeck', {gameId: $routeParams.gameId, deckId: deck._id});
			}
		};

		$scope.isAvailable = function(deck) {
			if(deck.pride <= $scope.maxPride) {
				return 'active';
			}
			else {
				return 'inactive';
			}
		};

		socket.on('selectDeckStatus', function(data) {
			if(data.status === 'success') {
				$scope.$apply(function() {
					$location.url('/game/' + $routeParams.gameId);
				});
			}
			else {
				errorHandler.handle(data.error);
			}
		});

		$scope.$on('$destroy', function() {
			socket.removeAllListeners('selectDeckStatus');
		});

	});
