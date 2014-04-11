'use strict';

var _ = require('lodash');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.TURN_END, self.poison);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.TURN_END, self.poison);
	},


	poison: function(game) {
		_.each(game.turnOwners, function(player) {
			_.each(game.board.playerTargets(player._id), function(target) {
				if(target.card) {
					if(target.card.poison > 0) {
						target.card.health -= target.card.poison;
					}
				}
			});
		});

		game.broadcastChanges('poison');
	}

};

module.exports = self;