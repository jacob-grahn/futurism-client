(function() {
	'use strict';

	var TurnTicker = function(players, timePerTurn) {
		var self = this;
		var intervalId;

		self.activePlayers = [];
		self.turn = 0;

		/**
		 * Start a turn for the next player in line
		 */
		self.nextTurn = function() {
			self.turn++;
			self.startTurn();
		};


		self.startTurn = function() {
			endTurn();
			var index = (self.turn+1) % (players.length);
			var player = players[index];
			self.activePlayers.push(player._id);
		};


		/**
		 * Clean up after a turn
		 */
		self.endTurn = function() {
			clearInterval(intervalId);
			self.activePlayers = [];
		};


		/**
		 * Clean up
		 */
		self.stop = function() {
			clearInterval(intervalId);
		};
	};


	module.exports = TurnTicker;

}());