'use strict';

var _ = require('lodash');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.TURN_BEGIN, self.deBuf);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.TURN_BEGIN, self.deBuf);
	},


	deBuf: function(game) {
		_.each(game.turnOwners, function(player) {

			//
			var targets = game.board.playerTargets(player._id);
			_.each(targets, function(target) {
				if(target.card) {
					target.card.attackBuf = 0;
					target.card.shield = 0;
					target.card.hero = 0;
				}
			});

			//
			_.each(player.hand, function(card) {
				card.attackBuf = 0;
				card.shield = 0;
				card.hero = 0;
			});

			//
			_.each(player.graveyard, function(card) {
				card.attackBuf = 0;
				card.shield = 0;
				card.hero = 0;
			});
		});

		
		game.broadcastChanges('deBuf');
	}

};

module.exports = self;