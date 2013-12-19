(function() {
	'use strict';

	var _ = require('lodash');


	/**
	 * Create a 2d array filled with target objects
	 * @param {number} columns
	 * @param {number} rows
	 * @param {Player} player
	 * @returns {Array}
	 */
	var generateTargets = function(columns, rows, player) {
		var targets = [];
		for(var i=0; i<columns; i++) {
			targets[i] = [];
			for(var j=0; j<rows; j++) {
				targets[i][j] = {
					row: j,
					column: i,
					player: player
				}
			}
		}
		return targets;
	};


	/**
	 *
	 * @param {array.<Player>} players
	 * @param {number} columns
	 * @param {number} rows
	 * @constructor
	 */
	var Board = function(players, columns, rows) {
		var self = this;
		self.future = 'normal';
		self.areas = {};


		_.each(players, function(player) {
			self.areas[player._id] = {
				targets: generateTargets(columns, rows, player)
			}
		});


		self.target = function(playerId, column, row) {
			return self.areas[playerId].targets[column][row];
		};


		self.targetPos = function(pos) {
			return self.target(pos.playerId, pos.column, pos.row);
		};


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


		self.remove = function() {
			self.areas = null;
		}
	};


	module.exports = Board;

}());