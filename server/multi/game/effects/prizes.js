'use strict';

var _ = require('lodash');
var prizeCalculator = require('../prizeCalculator');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.END, self.prizes);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.END, self.prizes);
	},


	/**
	 * award prizes
	 */
	prizes: function(game) {
		prizeCalculator.run(game.players, game.winners, false, function(err) {
			if(err) {
				game.emit('error', err);
			}
		});
	}

};

module.exports = self;