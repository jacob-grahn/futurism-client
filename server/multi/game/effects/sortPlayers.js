'use strict';

var _ = require('lodash');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.STARTUP, self.sortPlayers);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.STARTUP, self.sortPlayers);
	},


	/**
	 * Sort players by their deck size.
	 * Shuffle before sorting so that players with equal deck sizes will be randomized
	 */
	sortPlayers: function(game) {
		_.shuffle(game.players);
		game.players.sort(function(a, b) {
			return a.deckSize - b.deckSize;
		});
	}

};

module.exports = self;