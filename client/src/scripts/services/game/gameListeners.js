angular.module('futurism')
	.factory('gameListeners', function($routeParams, $location, socket, players, turn, board, state, hand) {
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
			_.merge(players.list, data.players);
			players.me = players.findMe();

			board.partialUpdate(data.board);
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
			$location.url('/game-summary/' + $routeParams.gameId);
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
			socket.authEmit('subscribe', gameId);
			socket.authEmit('gameStatus', {gameId: gameId});
		};


		/**
		 * Stop listening to a game
		 * @param {string} gameId
		 */
		self.unsubscribe = function(gameId) {
			socket.authEmit('unsubscribe', gameId);
		};



		return self;

	});