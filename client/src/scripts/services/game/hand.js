angular.module('futurism')
	.factory('hand', function(socket, $routeParams) {
		'use strict';

		var hand = {
			cards: [1,2,3],
			show: false,

			toggle: function() {
				hand.show = !hand.show;
				if(hand.show) {
					socket.authEmit('hand', {gameId: $routeParams.gameId});
				}
			},

			close: function() {
				hand.show = false;
			},

			open: function() {
				hand.show = true;
				socket.authEmit('hand', {gameId: $routeParams.gameId});
			}
		};

		return hand;
	});