angular.module('futurism')
	.controller('GameCtrl', function($scope, $routeParams, socket, _, account) {
		'use strict';

		$scope.gameId = $routeParams.gameId;
		$scope.players = [];
		$scope.me = {};
		$scope.turnOwners = [];
		$scope.state = {name: 'waiting'}


		socket.authEmit('subscribe', $scope.gameId);
		socket.authEmit('gameStatus', {gameId: $scope.gameId});


		/**
		 * Receive the game state
		 */
		socket.$on('gameStatus', function(data) {
			$scope.players = data.players;
			$scope.me = findMe();
			$scope.turnOwners = data.turnOwners;
			$scope.board = inflateBoard(data.board);
			$scope.state = {name: 'waiting'};
			if(isMyTurn()) {
				startMyTurn();
			}
		});


		/**
		 * Receive a partial game state
		 */
		socket.$on('gameUpdate', function(data) {
			if(data.players) {
				_.each(data.players, function(updatedPlayer) {
					var oldPlayer = $scope.idToPlayer(updatedPlayer._id);
					_.merge(oldPlayer, updatedPlayer);
				});
			}
			console.log('board', $scope.board);
			console.log('targets', data.targets);
			if(data.targets) {
				_.each(data.targets, function(target) {
					console.log('1', $scope.board);
					console.log('2', $scope.board.areas);
					console.log('3', $scope.board.areas[target.playerId]);
					$scope.board.areas[target.playerId].targets[target.column][target.row] = target;
				});
			}
		});


		/**
		 * Receive a new turn
		 */
		socket.$on('turn', function(turnOwners) {
			$scope.turnOwners = turnOwners;
			if(isMyTurn()) {
				startMyTurn();
			}
		});


		/**
		 * Receive the cards in your hand
		 */
		socket.$on('hand', function(hand) {
			console.log('got hand', hand);
			$scope.me.hand = hand;
			if(hand.length > 0) {
				$scope.state = {name: 'lookingAtHand'};
			}
			else {
				$scope.state = {name: 'thinking'};
			}
			console.log('done with hand');
		});


		$scope.$on('$destroy', function() {
			socket.authEmit('unsubscribe', $scope.gameId);
		});


		$scope.pickCardFromHand = function(card) {
			$scope.state = {name: 'selectingTarget', filters: [], action:'entr', cid: card.cid};
		};


		$scope.selectTarget = function(target) {
			socket.authEmit('playCard', {
				gameId: $scope.gameId,
				column: target.column,
				row: target.row,
				cid: $scope.state.cid
			});
			$scope.state = {name: 'thinking'};
		};


		$scope.isValidTarget = function(target) {
			if($scope.state.name === 'selectingTarget' && !target.card && target.playerId === $scope.me._id) {
				return true;
			}
			return false;
		};


		$scope.closeHand = function() {
			$scope.state = {name: 'thinking'};
		};


		$scope.endTurn = function() {
			socket.authEmit('endTurn', {gameId: $scope.gameId});
		};


		$scope.idToPlayer = function(playerId) {
			playerId = Number(playerId);
			var playerMatch = null;
			_.each($scope.players, function(player) {
				if(player._id === playerId) {
					playerMatch = player;
				}
			});
			return playerMatch;
		};


		var findMe = function() {
			return $scope.idToPlayer(account._id);
		};


		var startMyTurn = function() {
			if($scope.state.name === 'waiting') {
				socket.authEmit('hand', {gameId: $scope.gameId});
				$scope.state = {name: 'waitingForHand'};
			}
		};


		var isMyTurn = function() {
			return $scope.turnOwners.indexOf($scope.me._id) !== -1;
		};


		var inflateBoard = function(minBoard) {
			var board = _.cloneDeep(minBoard);
			_.each(board.areas, function(area, playerId) {
				_.each(area.targets, function(column, x) {
					_.each(column, function(card, y) {
						area.targets[x][y] = {column:x, row:y, playerId:Number(playerId), card: card};
					});
				});
			});
			return board;
		}

	});