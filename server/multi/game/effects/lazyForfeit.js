'use strict';

var _ = require('lodash');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.TURN_BEGIN, self.lazyForfeit);
		game.eventEmitter.on(game.ABILITY_AFTER, self.countAction);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.TURN_BEGIN, self.lazyForfeit);
		game.eventEmitter.removeListener(game.ABILITY_AFTER, self.countAction);
	},


	countAction: function (game) {
		_.each(game.turnOwners, function(player) {
			player.actionsPerformed = player.actionsPerformed || 0;
			player.actionsPerformed++;
		});
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

			// forfeit if idleTurns is too high, and the player does not have any cards on the board
			if(player.idleTurns >= 2) {
				var targets = game.board.playerTargets(player._id);
				var cardsOnBoard = _.filter(targets, 'card');
				if(cardsOnBoard.length === 0) {
					game.forfeit(player);
				}
			}
		});
	}

};

module.exports = self;