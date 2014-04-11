'use strict';

var _ = require('lodash');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.TURN_BEGIN, self.lazyForfeit);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.TURN_BEGIN, self.lazyForfeit);
	},


	lazyForfeit: function(game) {
		_.each(game.turnOwners, function(player) {

			// default values
			player.idleTurns = player.idleTurns || 0;
			player.actionsPerformed = player.actionsPerformed || 0;

			// count this as an idle turn if no actions were performed
			if(player.actionsPerformed === 0) {
				player.idleTurns++;
			}
			else {
				player.idleTurns = 0;
			}

			// reset performed actions to 0
			player.actionsPerformed = 0;

			// forfeit if idleTurns is too high
			if(player.idleTurns >= 2) {
				game.forfeit(player);
			}
		});
	}

};

module.exports = self;