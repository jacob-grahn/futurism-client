'use strict';

var _ = require('lodash');
var futures = require('../../../../shared/futures');

var self = {


	activate: function(game) {
		game.eventEmitter.on(game.TURN_END, self.healTrees);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.TURN_END, self.healTrees);
	},


	healTrees: function(game) {
		_.each(game.turnOwners, function(player) {
			_.each(game.board.playerTargets(player._id), function(target) {
				if(target.card && target.card._id === 'tree') {
					target.card.health = target.card.health || 0;
					target.card.health++;
				}
			});
		});
		game.broadcastChanges(futures.EDEN);
	}

};

module.exports = self;