angular.module('futurism')
	.controller('GameCtrl', function($scope, $routeParams, socket, _, account) {
		'use strict';

		$scope.gameId = $routeParams.gameId;
		$scope.players = {};
		$scope.me = {};
		$scope.turnOwners = [];


		socket.authEmit('subscribe', $scope.gameId);
		socket.authEmit('gameStatus', {gameId: $scope.gameId});


		socket.$on('gameStatus', function(data) {
			$scope.players = data.players;
			$scope.me = findMe(data.players);
			$scope.turnOwners = data.turnOwners;
			$scope.board = inflateBoard(data.board);
			if(isMyTurn()) {
				socket.authEmit('hand', {gameId: $scope.gameId});
			}
		});


		socket.$on('hand', function(hand) {
			$scope.me.hand = hand;
		});


		$scope.$on('$destroy', function() {
			socket.authEmit('unsubscribe', $scope.gameId);
		});


		var findMe = function(players) {
			var me = null;
			_.each(players, function(player) {
				if(player._id === account._id) {
					me = player;
				}
			});
			return me;
		};


		var isMyTurn = function() {
			return $scope.turnOwners.indexOf($scope.me._id) !== -1;
		};


		var inflateBoard = function(minBoard) {
			var board = _.cloneDeep(minBoard);
			_.each(board.areas, function(area, playerId) {
				_.each(area.targets, function(column, x) {
					_.each(column, function(card, y) {
						area.targets[x][y] = {column:x, row:y, playerId:playerId, card: card};
					});
				});
			});
			return board;
		}

	});