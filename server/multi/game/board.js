(function() {
	'use strict';

	var _ = require('lodash');


	var generateTargets = function(columns, rows, playerId, teamId) {
		var targets = [];
		for(var i=0; i<columns; i++) {
			targets[i] = [];
			for(var j=0; j<rows; j++) {
				targets[i][j] = {
					row: j,
					column: i,
					playerId: playerId,
					teamId: teamId
				}
			}
		}
		return targets;
	};


	var Board = function(players, rules) {
		var self = this;
		self.future = 'normal';
		self.areas = {};

		_.each(players, function(player) {
			self.areas[player._id] = {
				targets: generateTargets(rules.columns, rules.rows, player._id, player.teamId)
			}
		});

		self.target = function(playerId, column, row) {
			return self.areas[playerId].targets[column][row];
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
	};


	module.exports = Board;

}());