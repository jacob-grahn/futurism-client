'use strict';

var _ = require('lodash');
var futures = require('../../../../shared/futures');
var actions = require('../../../../shared/actions');

var self = {


	activate: function(game) {
		game.eventEmitter.on(game.CHANGE, self.giveMove);
		self.giveMove(game);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.CHANGE, self.giveMove);
		self.removeMove(game);
	},


	giveMove: function(game) {
		_.each(game.allCards(), function(card) {
			if(card.abilities.indexOf(actions.MOVE) === -1) {
				card.abilities.push(actions.MOVE);
				card.anarchy = true;
			}
		});
		game.broadcastChanges(futures.ANARCHY);
	},


	removeMove: function(game) {
		_.each(game.allCards(), function(card) {
			if(card.anarchy) {
				var index = card.abilities.indexOf(actions.MOVE);
				if(index !== -1) {
					card.abilities.splice(index, 1);
				}
				delete card.anarchy;
			}
		});
	}



};

module.exports = self;