'use strict';

var _ = require('lodash');
var actions = require('../../../shared/actions');


var self = {


	activate: function(game) {
		game.eventEmitter.on(game.ABILITY_DURING, self.capitalism);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.ABILITY_DURING, self.capitalism);
	},


	capitalism: function(game, actionId, chain, result) {
		if(actionId === actions.ASSASSIN) {
			result.srcHeal = Math.round(result.targetDamage / 2);

			var src = game.board.targetPos(chain[0]);
			src.card.health += result.srcHeal;
		}
	}

};

module.exports = self;