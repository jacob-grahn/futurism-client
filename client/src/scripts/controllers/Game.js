angular.module('futurism')
	.controller('GameCtrl', function($scope, $routeParams, $location, socket, _, account, shared, board) {
		'use strict';

		var actions = shared.actions;

		$scope.board = board;
		$scope.gameId = $routeParams.gameId;
		$scope.players = [];
		$scope.me = {};
		$scope.turnOwners = [];
		$scope.state = {name: 'waiting'};


		socket.authEmit('subscribe', $scope.gameId);
		socket.authEmit('gameStatus', {gameId: $scope.gameId});


		/**
		 * Receive the game state
		 */
		socket.$on('gameStatus', function(data) {
			$scope.players = data.players;
			$scope.me = findMe();
			$scope.turnOwners = data.turnOwners;
			board.fullUpdate(data.board, $scope.idToPlayer);
			$scope.state = {name: 'waiting'};
			if($scope.isMyTurn()) {
				startMyTurn();
			}
		});


		/**
		 * Receive a partial game state
		 */
		socket.$on('gameUpdate', function(data) {
			if(data.players) {
				_.merge($scope.players, data.players);
			}
			if(data.board) {
				board.partialUpdate(data.board, $scope.idToPlayer);
			}
		});


		/**
		 * Receive a new turn
		 */
		socket.$on('turn', function(data) {
			$scope.turnStartTime = data.time;
			$scope.turnOwners = data.turnOwners;
			if($scope.isMyTurn()) {
				startMyTurn();
			}
			else {
				$scope.state = {name: 'waiting'};
			}
		});


		/**
		 * Receive the cards in your hand
		 */
		socket.$on('hand', function(hand) {
			$scope.me.hand = hand;
		});


		/**
		 * Remove yourself from the game
		 */
		$scope.forfeit = function() {
			socket.authEmit('forfeit', {gameId: $scope.gameId});
			$location.url('/lobby');
		};


		/**
		 * Pick a card from your hand
		 * @param {Object} card
		 */
		$scope.pickCardFromHand = function(card) {
			if(card.pride > $scope.me.pride) {
				return false;
			}

			$scope.selectAction('entr', card.cid);
			$scope.state.targets = [{
				cid: card.cid,
				playerId: $scope.me._id
			}];
		};


		/**
		 * Choose an action to use
		 * @param {String} actionId
		 * @param {Number} cid
		 */
		$scope.selectAction = function(actionId, cid) {
			if(['thinking', 'lookingAtHand'].indexOf($scope.state.name) === -1) {
				return false;
			}
			var action = actions[actionId];
			var target = board.cidToTarget(cid);
			$scope.state = {
				name: 'selectingTarget',
				actionId: actionId,
				restrict: action.restrict,
				targets: [target]
			};
			checkTargetChain();
		};


		/**
		 * Choose a target to use an ability on
		 * @param target
		 */
		$scope.selectTarget = function(target) {
			if(!$scope.isValidTarget(target)) {
				return false;
			}
			$scope.state.targets.push(target);
			checkTargetChain();
		};


		/**
		 * Send an action with its targets to the server if all targets have been selected
		 */
		var checkTargetChain = function() {
			if($scope.state.targets.length >= $scope.state.restrict.length) {
				socket.authEmit('doAction', {
					gameId: $scope.gameId,
					actionId: $scope.state.actionId,
					targets: $scope.state.targets
				});
				$scope.state = {name: 'thinking'};
			}
		};


		$scope.isValidTarget = function(target) {
			if($scope.state.name === 'selectingTarget') {
				var filters = $scope.state.restrict[$scope.state.targets.length];
				var targets = [target];
				_.each(filters, function(filter) {
					targets = filter(targets, $scope.me);
				});
				return targets.length !== 0;
			}
			return false;
		};


		/**
		 *
		 */
		$scope.showHand = function() {
			socket.authEmit('hand', {gameId: $scope.gameId});
			$scope.state.showHand = true;
		};


		/**
		 *
		 */
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
			return $scope.turnOwners.indexOf(Number(playerId)) !== -1;
		};


		/**
		 * Returns true if it is your turn
		 * @returns {boolean}
		 */
		$scope.isMyTurn = function() {
			if(!$scope.me) {
				return false;
			}
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


		/**
		 * clean up
		 */
		$scope.$on('$destroy', function() {
			socket.authEmit('unsubscribe', $scope.gameId);
			board.clear();
		});


		var findMe = function() {
			return $scope.idToPlayer(account._id);
		};


		var startMyTurn = function() {
			$scope.state = {name: 'thinking'};
			$scope.showHand();
		};

	});