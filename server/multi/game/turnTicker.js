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
		var beginCallback;
		var endCallback;

		self.turn = 0;
		self.turnOwners = [];


		/**
		 * Start turn progression
		 * @param {function} [beginCb]
		 * @param {function} [endCb]
		 */
		self.start = function(beginCb, endCb) {
			beginCallback = beginCb;
			endCallback = endCb;
			running = true;
			nextTurn();
		};


		/**
		 * Pause turn progression
		 */
		self.stop = function() {
			running = false;
			beginCallback = null;
			endCallback = null;
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
				if(endCallback) {
					endCallback(self.getElapsed());
				}
				self.turn++;
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
		 * fill turnOwners with players who are active this turn
		 */
		self.populateTurn = function() {
			self.turnOwners = getTurnOwners(self.turn);
		};


		/**
		 * Return an array of userIds that are active this turn
		 */
		self.getTurnOwnerIds = function() {
			return _.map(self.turnOwners, function(player) {
				return player._id;
			});
		};


		/**
		 * Move a turn to the next player in line
		 */
		var nextTurn = function() {
			startTime = +new Date();
			self.populateTurn();
			intervalId = setTimeout(self.endTurn, timePerTurn);
			if(beginCallback) {
				beginCallback(startTime);
			}
		};


		/**
		 * select players based on which turn it is
		 */
		var getTurnOwners = function(turn) {
			var index = turn % (players.length);
			var player = players[index];
			var owners = [player];
			return owners;
		};

	};


	module.exports = TurnTicker;

}());