'use strict';

var _ = require('lodash');
var futures = require('../../../../shared/futures');
var actions = require('../../../../shared/actions');

var self = {


	activate: function(game) {
		game.eventEmitter.on(game.CHANGE, self.onChange);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.CHANGE, self.onChange);
	},


	onChange: function(game, cause) {
		if(cause === actions.ATTACK || cause === actions.SIPHON || cause === actions.PRECISION || cause === actions.ASSASSIN || cause === actions.FERVENT) {
			self.nuke(game);
		}
	},


	nuke: function(game) {
		_.each(game.board.allTargets(), function(target) {
			if(target.card) {
				target.card.health--;
			}
		});
		game.broadcastChanges(futures.NUCLEAR_WAR);
	}

};

module.exports = self;