angular.module('futurism')
	.factory('hand', function(socket, $routeParams, state, players) {
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
			show: false,
			force: false,


			toggle: function() {
				if(self.show) {
					self.close();
				}
				else {
					self.open();
				}
			},


			close: function() {
				self.show = false;
				self.force = false;
			},


			open: function() {
				self.show = true;
			},


			forcePlay: function() {
				self.force = true;
			},


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