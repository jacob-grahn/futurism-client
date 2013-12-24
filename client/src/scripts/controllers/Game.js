angular.module('futurism')
	.controller('GameCtrl', function($scope, $routeParams, socket, _) {
		'use strict';

		$scope.gameId = $routeParams.gameId;
		$scope.columnCount = 4;
		$scope.rowCount = 3;
		$scope.status = {};


		socket.on('gameStatus', function(data) {
			$scope.players = data.players;
			$scope.board = inflateBoard(data.board);
		});


		socket.authEmit('subscribe', $scope.gameId);
		socket.authEmit('gameStatus', {gameId: $scope.gameId});


		$scope.$on('$destroy', function() {
			socket.authEmit('unsubscribe', $scope.gameId);
		});


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