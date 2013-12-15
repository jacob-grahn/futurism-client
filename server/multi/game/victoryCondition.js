(function() {
	'use strict';

	var _ = require('lodash');


	module.exports = {

		commanderRules: function(players, board, turn) {
			if(turn > players.length) {
				var survivingTeams = [];
				_.each(players, function(player) {
					var targets = board.playerTargets(player._id);
					_.each(targets, function(target) {
						if(target.card && target.card.commander) {
							survivingTeams.push(player.team);
						}
					});
				});
				survivingTeams = _.uniq(survivingTeams);

				if(survivingTeams.length === 1) {
					return {winner: true, team: survivingTeams[0]};
				}
				return {winner: false}
			}
		}


		/*annihilation: function(players, board) {
			var survivingTeams = [];
			_.each(players, function(player) {
				var targets = board.playerTargets(player._id)
				_.each(targets, function(target) {
					if(target.card) {
						survivingTeams.push(player.team);
					}
				});
			});
			survivingTeams = _.uniq(survivingTeams);

			if(survivingTeams.length === 1) {
				return {winner: true, team: survivingTeams[0]};
			}
			return {winner: false}
		},*/


		/*prideFest: function(players, board) {
			_.each(players, function(player) {
				if(player.pride >= 100) {
					return {winner: true, team: player.team}
				}
			});
		}*/

	}
}());