'use strict';

var _ = require('lodash');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.TURN_BEGIN, self.prideUp);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.TURN_BEGIN, self.prideUp);
	},


	prideUp: function(game) {
		_.each(game.turnOwners, function(player) {
				player.pride++;
		});
	}

};

module.exports = self;