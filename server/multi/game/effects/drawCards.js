'use strict';

var _ = require('lodash');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.TURN_BEGIN, self.drawCards);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.TURN_BEGIN, self.drawCards);
	},


	drawCards: function(game) {
		_.each(game.turnOwners, function(player) {
			while(player.hand.length < game.rules.handSize && player.cards.length > 0) {
				player.hand.push(player.cards.pop());
			}
		});
	}

};

module.exports = self;