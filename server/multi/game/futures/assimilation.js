'use strict';

var _ = require('lodash');
var futures = require('../../../../shared/futures');
var abilities = require('../../../../shared/actions');
var factions = require('../../../../shared/factions');

var self = {


	activate: function(game) {
		self.assimilate(game);
		game.eventEmitter.on(game.TURN_END, self.onTurnEnd);
	},


	deactivate: function(game) {
		self.unassimilate(game);
		game.eventEmitter.removeListener(game.TURN_END, self.onTurnEnd);
	},


	assimilate: function(game) {
		_.each(game.board.allTargets(), function(target) {
			if(target.card && target.card.faction !== factions.machine.id) {
				target.card.assimilated = true;
				target.card.originalFaction = target.card.faction;
				target.card.faction = factions.machine.id;
			}
		});

		game.broadcastChanges(futures.ASSIMILATION);
	},


	unassimilate: function(game) {
		_.each(game.board.allTargets(), function(target) {
			if(target.card && target.card.assimilated) {
				target.card.faction = target.card.originalFaction;
				delete target.card.assimilated;
				delete target.card.originalFaction;
			}
		});

		game.broadcastChanges(futures.ASSIMILATION + ':end');
	},


	onTurnEnd: function(game) {
		self.assimilate(game);
	}

};

module.exports = self;