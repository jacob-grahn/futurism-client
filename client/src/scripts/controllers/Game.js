angular.module('futurism')
	.controller('GameCtrl', function($scope, $routeParams, $location, socket, _, gameListeners, players, turn, board, state, hand, targeter, errorHandler, shared) {
		'use strict';

		var actions = shared.actions;

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
		 * clean up
		 */
		$scope.$on('$destroy', function() {
			gameListeners.unsubscribe($scope.gameId);
			board.clear();
		});


		/**
		 * open hand when summon is used
		 */
		$scope.$watchCollection('state', function() {
			console.log('state.actionId changed', state);
			if(state.name === state.TARGETING) {
				if(state.data.actionId === actions.SUMMON && state.data.targets.length === 1) {
					hand.open();
				}
			}
		});


		/**
		 * play a card from your hand
		 * @param card
		 * @returns {boolean}
		 */
		$scope.pickCardFromHand = function(card) {
			if(card.pride > players.me.pride) {
				errorHandler.show('You do not have enough pride to play this card');
				return false;
			}
			if(hand.cards.indexOf(card) === -1) {
				errorHandler.show('This card is not in your hand');
				return false;
			}

			if(card.commander) {
				targeter.selectAction('smmn', {card: card, player: players.me});
				targeter.onCooldown = false;
			}

			targeter.selectTarget({card: card, player: players.me});

			hand.close();

			return true;
		};

	});