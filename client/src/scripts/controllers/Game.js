angular.module('futurism')
	.controller('GameCtrl', function($scope, $routeParams, $location, socket, _, gameListeners, players, turn, board, state, hand, targeter) {
		'use strict';

		$scope.board = board;
		$scope.players = players;
		$scope.turn = turn;
		$scope.state = state;
		$scope.hand = hand;
		$scope.targeter = targeter;
		$scope.gameId = $routeParams.gameId;
		$scope.chatId = $scope.gameId.replace('game', 'chat');


		gameListeners.subscribe($scope.gameId);


		/**
		 * End your turn
		 */
		$scope.endTurn = function() {
			socket.emit('endTurn', {gameId: $scope.gameId});
		};


		/**
		 * Remove yourself from the game
		 */
		$scope.forfeit = function() {
			socket.emit('forfeit', {gameId: $scope.gameId});
			$location.url('/lobby');
		};


		/**
		 * Pick a card from your hand
		 * @param {Object} card
		 */
		$scope.pickCardFromHand = function(card) {
			if(card.pride > players.me.pride) {
				return false;
			}

			targeter.selectAction('entr', card.cid);
			if(state.data) {
				state.data.targets = [{
					cid: card.cid,
					playerId: players.me._id
				}];
			}

			hand.close();

			return true;
		};


		/**
		 * clean up
		 */
		$scope.$on('$destroy', function() {
			gameListeners.unsubscribe($scope.gameId);
			board.clear();
			hand.show = false;
		});

	});