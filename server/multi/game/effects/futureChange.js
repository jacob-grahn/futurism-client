'use strict';

var _ = require('lodash');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.ABILITY_DURING, self.futureChange);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.ABILITY_DURING, self.futureChange);
	},


	futureChange: function(game, actionId, chain, result) {
		if(result && result.future) {
			game.futureManager.setFuture(result.future);
		}
	}

};

module.exports = self;