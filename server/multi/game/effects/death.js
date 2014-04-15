'use strict';

var _ = require('lodash');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.TURN_END, self.death);
		game.eventEmitter.on(game.ABILITY_AFTER, self.death);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.TURN_END, self.death);
		game.eventEmitter.removeListener(game.ABILITY_AFTER, self.death);
	},


	death: function(game) {
		var deaths = [];
		_.each(game.board.allTargets(), function(target) {
			if(target.card) {
				if(target.card.health <= 0) {
					var card = target.card;
					card.health = 0;
					target.player.graveyard.push(card);
					target.card = null;
					deaths.push({
						playerId: target.player._id,
						column: target.column,
						row: target.row,
						cid: card.cid
					});
				}
			}
		});

		game.broadcastChanges('death', {deaths: deaths});
	}

};

module.exports = self;