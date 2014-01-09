angular.module('futurism')
	.factory('hand', function(socket, $routeParams, state) {
		'use strict';

		var hand = {
			cards: [1,2,3],
			show: false,

			toggle: function() {
				if(hand.show) {
					hand.close();
				}
				else {
					hand.open();
				}
			},

			close: function() {
				hand.show = false;
			},

			open: function() {
				hand.show = true;
				socket.authEmit('hand', {gameId: $routeParams.gameId});
				state.toDefault();
			}
		};

		return hand;
	});