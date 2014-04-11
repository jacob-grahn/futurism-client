'use strict';

var _ = require('lodash');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.TURN_END, self.refresh);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.TURN_END, self.refresh);
	},


	refresh: function(game) {
		_.each(game.turnOwners, function(player) {

			// give cards one the board 1 action point
			var targets = game.board.playerTargets(player._id);
			_.each(targets, function(target) {
				if(target.card) {
					if(target.card.moves < 1) {
						target.card.moves++;
					}
				}
			});

			// give cards in the hand 1 action point
			_.each(player.hand, function(card) {
				card.moves = 1;
			});

			// reset cards in the graveyard
			_.each(player.graveyard, function(card) {
				card.moves = 0;
			});
		});

		game.broadcastChanges('refresh');
	}

};

module.exports = self;