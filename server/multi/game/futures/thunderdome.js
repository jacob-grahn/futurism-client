'use strict';

var _ = require('lodash');
var futures = require('../../../../shared/futures');
var actions = require('../../../../shared/actions');

var self = {


	activate: function(game) {
		game.eventEmitter.on(game.ABILITY_BEFORE, self.stopSummons);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.ABILITY_BEFORE, self.stopSummons);
	},


	stopSummons: function(game, player, actionId) {
		if(actionId === actions.SUMMON) {
			game.actionError = "Summon has bee disabled, THUNDERDOME is in effect!"
		}
	}

};

module.exports = self;