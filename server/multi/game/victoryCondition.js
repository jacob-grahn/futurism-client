(function() {
	'use strict';

	var _ = require('lodash');


	module.exports = {

		commanderRules: function(players, board, turn) {

			//don't declare a winner if some people haven't had a turn yet
			if(turn <= players.length) {
				return {winner: false}
			}

			// make a list of teams that have a surviving member
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

			// if there is only one team left, they win
			if(survivingTeams.length === 1) {
				return {winner: true, team: survivingTeams[0]};
			}
			return {winner: false}
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