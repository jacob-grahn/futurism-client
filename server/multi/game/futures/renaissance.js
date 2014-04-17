'use strict';

var _ = require('lodash');
var futures = require('../../../../shared/futures');
var actions = require('../../../../shared/actions');

var self = {


	activate: function(game) {
		self.energizeCommanders(game);
		game.eventEmitter.on(game.TURN_BEGIN, self.energizeCommanders);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.TURN_BEGIN, self.energizeCommanders);
	},


	energizeCommanders: function(game) {
		_.each(game.turnOwners, function(player) {
			_.each(game.board.playerTargets(player._id), function(target) {
				if(target.card && target.card.commander) {
					target.card.moves++;
				}
			});
		});

		game.broadcastChanges(futures.RENAISSANCE);
	}

};

module.exports = self;