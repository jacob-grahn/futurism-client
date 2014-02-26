angular.module('futurism')
	.factory('hand', function(socket, $routeParams, state, players) {
		'use strict';

		/**
		 * Receive the cards in your hand
		 */
		socket.$on('hand', function(cards) {
			hand.cards = cards;
			players.me.hand = cards;
		});


		/**
		 *
		 */
		var hand = {
			cards: [],
			show: false,
			force: false,


			toggle: function() {
				if(hand.show) {
					//state.toDefault();
					hand.close();
				}
				else {
					hand.open();
				}
			},


			close: function() {
				hand.show = false;
				hand.force = false;
			},


			open: function() {
				hand.show = true;
			},


			forcePlay: function() {
				hand.force = true;
			},


			clear: function() {
				hand.cards = [];
			},


			refresh: function() {
				hand.clear();
				socket.emit('hand', {gameId: $routeParams.gameId});
			}
		};

		return hand;
	});