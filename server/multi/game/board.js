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
	};


	module.exports = Board;

}());