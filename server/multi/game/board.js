(function() {
	'use strict';

	var _ = require('lodash');


	/**
	 * Create a 2d array filled with target objects
	 * @param {Player} player
	 * @param {number} columns
	 * @param {number} rows
	 * @returns {Array}
	 */
	var generateTargets = function(player, columns, rows) {
		var targets = [];
		for(var i=0; i<columns; i++) {
			targets[i] = [];
			for(var j=0; j<rows; j++) {
				targets[i][j] = {
					row: j,
					column: i,
					player: player,
					playerId: player._id,
					card: null
				}
			}
		}
		return targets;
	};
	/**
	 * A representation of cards that are in play
	 * @param {Array} players
	 * @param {number} columns
	 * @param {number} rows
	 * @constructor
	 */
	var Board = function(players, columns, rows) {
		var self = this;
		self.future = 'normal';
		self.areas = {};


		/**
		 * generate a play area for each player
		 */
		_.each(players, function(player) {
			self.areas[player._id] = {
				targets: generateTargets(player, columns, rows)
			}
		});


		/**
		 * Return target found at pos
		 * @param {number} playerId
		 * @param {number} column
		 * @param {number} row
		 * @returns {*}
		 */
		self.target = function(playerId, column, row) {
			return self.areas[playerId].targets[column][row];
		};


		/**
		 * Return target found at pos
		 * @param pos
		 * @returns {*}
		 */
		self.targetPos = function(pos) {
			return self.target(pos.playerId, pos.column, pos.row);
		};


		/**
		 * Create a 1d array of all targets
		 * @returns {Array} targets
		 */
		self.allTargets = function() {
			var all = [];
			_.each(self.areas, function(area) {
				_.each(area.targets, function(column) {
					_.each(column, function(target) {
						all.push(target);
					});
				});
			});
			return all;
		};


		/**
		 * Create a 1d array of all targets owned by a player
		 * @param {number} playerId
		 * @returns {Array} targets
		 */
		self.playerTargets = function(playerId) {
			var area = self.areas[playerId];
			var all = [];
			_.each(area.targets, function(column) {
				_.each(column, function(target) {
					all.push(target);
				});
			});
			return all;
		};


		/**
		 * Create a deep clone that excludes redundant data
		 */
		self.compactClone = function() {
			var copy = {};
			copy.future = self.future;
			copy.areas = {};

			var targets = self.allTargets();

			_.each(targets, function(target) {
				var id = target.player._id;
				if(!copy.areas[id]) {
					copy.areas[id] = {targets: {}};
				}
				copy.areas[id].targets[target.column+"-"+target.row] = target.card;
			});

			return copy;
		};


		/**
		 * clean up references
		 */
		self.remove = function() {
			self.areas = null;
		}
	};


	module.exports = Board;

}());