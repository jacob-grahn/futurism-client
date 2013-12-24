(function() {
	'use strict';

	var _ = require('lodash');


	/**
	 * Keep track of who's turn it is
	 * mark players with active = true when it is their turn
	 * put a time limit on turn durations
	 * @param {array.<Player>} players
	 * @param {number} timePerTurn
	 * @constructor
	 */
	var TurnTicker = function(players, timePerTurn) {
		var self = this;
		var intervalId;
		var startTime;
		var running = false;
		var callback;

		self.turn = 0;
		self.turnOwners = [];


		/**
		 * Start turn progression
		 * @param {function} [cb]
		 */
		self.start = function(cb) {
			callback = cb;
			running = true;
			nextTurn();
		};


		/**
		 * Pause turn progression
		 */
		self.stop = function() {
			running = false;
			callback = null;
			clearTimeout(intervalId);
		};


		/**
		 * Return how long this turn has lasted
		 * @returns {number}
		 */
		self.getElapsed = function() {
			return (+new Date()) - startTime;
		};


		/**
		 * Called when a turn is completed
		 */
		self.endTurn = function() {
			clearTimeout(intervalId);
			if(running) {
				if(callback) {
					callback(self.getElapsed(), self.turnOwners);
				}
				nextTurn();
			}
		};


		/**
		 * Test if it is a players turn
		 * @param player
		 * @returns {boolean}
		 */
		self.isTheirTurn = function(player) {
			return (self.turnOwners.indexOf(player) !== -1);
		};


		/**
		 * Move a turn to the next player in line
		 */
		var nextTurn = function() {
			self.turn++;
			startTime = +new Date();
			fillTurnOwners();
			//intervalId = setTimeout(self.endTurn, timePerTurn);
		};


		/**
		 * set active to true if it is a players turn
		 */
		var fillTurnOwners = function() {
			self.turnOwners = [];
			var index = (self.turn-1) % (players.length);
			var player = players[index];
			self.turnOwners = [player];
		};

	};


	module.exports = TurnTicker;

}());