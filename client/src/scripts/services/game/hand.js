angular.module('futurism')
	.factory('hand', function(socket, $routeParams, players) {
		'use strict';

		/**
		 * Receive the cards in your hand
		 */
		socket.$on('hand', function(cards) {
			self.cards = cards;
			if(players.findMe()) {
				players.findMe().hand = cards;
			}
		});


		/**
		 *
		 */
		var self = {
			cards: [],


			clear: function() {
				self.cards = [];
			},


			removeCid: function(cid) {
				self.cards = _.filter(self.cards, function(card) {
					return card.cid !== cid;
				});
				players.findMe().hand = self.cards;
			},


			refresh: function() {
				self.clear();
				socket.emit('hand', {gameId: $routeParams.gameId});
			}
		};

		return self;
	});