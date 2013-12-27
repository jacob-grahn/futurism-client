angular.module('futurism')
	.controller('GameCtrl', function($scope, $routeParams, socket, _, account) {
		'use strict';

		$scope.gameId = $routeParams.gameId;
		$scope.players = {};
		$scope.me = {};
		$scope.turnOwners = [];
		$scope.state = {name: 'waiting'}


		socket.authEmit('subscribe', $scope.gameId);
		socket.authEmit('gameStatus', {gameId: $scope.gameId});


		socket.$on('gameStatus', function(data) {
			$scope.players = data.players;
			$scope.me = findMe(data.players);
			$scope.turnOwners = data.turnOwners;
			$scope.board = inflateBoard(data.board);
			if(isMyTurn()) {
				startMyTurn();
			}
		});


		socket.$on('turn', function(turnOwners) {
			$scope.turnOwners = turnOwners;
			if(isMyTurn()) {
				startMyTurn();
			}
		});


		socket.$on('hand', function(hand) {
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
			console.log(target);
			console.log($scope.me._id);
			if($scope.state.name === 'selectingTarget' && !target.card && target.playerId === $scope.me._id) {
				return true;
			}
			return false;
		};


		var findMe = function(players) {
			var me = null;
			_.each(players, function(player) {
				if(player._id === account._id) {
					me = player;
				}
			});
			return me;
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