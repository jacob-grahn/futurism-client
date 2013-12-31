angular.module('futurism')
	.controller('GameCtrl', function($scope, $routeParams, $location, socket, _, account) {
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
			if(data.targets) {
				_.each(data.targets, function(target) {
					$scope.board.areas[target.playerId].targets[target.column][target.row] = target;
				});
			}
		});


		/**
		 * Receive a new turn
		 */
		socket.$on('turn', function(data) {
			$scope.turnStartTime = data.time;
			$scope.turnOwners = data.turnOwners;
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
		});


		$scope.$on('$destroy', function() {
			socket.authEmit('unsubscribe', $scope.gameId);
		});


		$scope.forfeit = function() {
			socket.authEmit('forfeit', {gameId: $scope.gameId});
			$location.url('/lobby');
		};


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


		/**
		 * Returns true if it is this player's turn
		 * @param {Number} playerId
		 * @returns {Boolean}
		 */
		$scope.isTheirTurn = function(playerId) {
			console.log($scope.turnOwners, playerId);
			return $scope.turnOwners.indexOf(Number(playerId)) !== -1;
		};


		/**
		 * Returns true if it is your turn
		 * @returns {boolean}
		 */
		var isMyTurn = function() {
			return $scope.isTheirTurn($scope.me._id);
		};


		/**
		 * Find a player using their id
		 * @param playerId
		 */
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