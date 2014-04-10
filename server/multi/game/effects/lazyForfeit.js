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
			if(player.actionsPerformed === 0) {
				player.idleTurns++;
			}
			else {
				player.idleTurns = 0;
			}

			player.actionsPerformed = 0;

			if(player.idleTurns >= 2) {
				game.forfeit(player);
			}
		});
	}

};

module.exports = self;