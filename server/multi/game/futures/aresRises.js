'use strict';

var _ = require('lodash');
var futures = require('../../../../shared/futures');
var factions = require('../../../../shared/factions');

var self = {


	activate: function(game) {
		game.eventEmitter.on(game.CHANGE, self.rallyDead);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.CHANGE, self.rallyDead);
	},


	rallyDead: function(game, cause, changes, data) {
		if(cause === 'death') {
			var deathCount = data.deaths.length;
			_.each(game.board.allTargets(), function(target) {
				if(target.card && target.card.faction === factions.ZEALOT) {
					target.card.attackBuf = target.card.attackBuf || 0;
					target.card.attackBuf += deathCount;
				}
			});
		}

		game.broadcastChanges(futures.ARES_RISES);
	}

};

module.exports = self;