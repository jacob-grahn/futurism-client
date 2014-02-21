angular.module('futurism')
	.factory('gameListeners', function($routeParams, $location, socket, players, turn, board, state, hand, animator) {
		'use strict';
		var self = this;

		/**
		 * Receive the game state
		 */
		socket.$on('gameStatus', function(data) {
			players.list = data.players;
			players.me = players.findMe();

			board.fullUpdate(data.board);

			self.startTurn(data);
		});


		/**
		 * Receive a partial game state
		 */
		socket.$on('gameUpdate', function(data) {
			var cause = data.cause;
			var changes = data.changes;

			animator.animateUpdate(cause, changes, function() {
				_.merge(players.list, changes.players);
				board.partialUpdate(changes.board);
				players.me = players.findMe();
			});
		});


		/**
		 * Receive a new turn
		 */
		socket.$on('turn', function(data) {
			self.startTurn(data);
		});


		/**
		 * Receive the cards in your hand
		 */
		socket.$on('hand', function(cards) {
			hand.cards = cards;
		});


		/**
		 * The game is over
		 */
		socket.$on('gameOver', function() {
			$location.url('/summary/' + $routeParams.gameId);
		});


		/**
		 * Begin a new turn
		 */
		self.startTurn = function(data) {
			turn.turnOwners = data.turnOwners;
			turn.startTime = data.startTime;
			if(turn.isMyTurn()) {
				state.set(state.THINKING);
				hand.open();
			}
			else {
				state.set(state.WAITING);
			}
		};


		/**
		 * Start listening to a game
		 * @param {string} gameId
		 */
		self.subscribe = function(gameId) {
			socket.emit('subscribe', gameId);
			socket.emit('gameStatus', {gameId: gameId});
		};


		/**
		 * Stop listening to a game
		 * @param {string} gameId
		 */
		self.unsubscribe = function(gameId) {
			socket.emit('unsubscribe', gameId);
		};



		return self;

	});