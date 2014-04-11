'use strict';

var _ = require('lodash');
var victoryCondition = require('../victoryCondition');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.TURN_END, self.victory);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.TURN_END, self.victory);
	},


	/**
	 * check for victory
	 */
	victory: function(game) {
		var result = victoryCondition.commanderRules(game.players, game.board, game.turnTicker.turn);
		if(result.winner) {
			var winners = _.filter(game.players, {team: result.team});
			game.setWinners(winners);
		}
	}

};

module.exports = self;




