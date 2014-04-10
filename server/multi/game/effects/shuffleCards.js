'use strict';

var _ = require('lodash');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.STARTUP, self.shuffleCards);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.STARTUP, self.shuffleCards);
	},


	shuffleCards: function(game) {
		_.each(game.players, function(player) {
			player.cards = _.shuffle(player.cards);
		});
	}

};

module.exports = self;