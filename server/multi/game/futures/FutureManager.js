'use strict';

var actions = require('../../../../shared/actions');
var futures = require('../../../../shared/futures');

var futureLookup = {};
futureLookup[futures.CAPITALISM] = require('./capitalism');
futureLookup[futures.NORMAL] = require('./normal');


module.exports = function(game) {


	var self = {

		curFutureId: null,
		curFuture: null,


		onAbility: function(game, actionId, chain, result) {
			if(actionId === actions.FUTURE && result) {
				self.setFuture(result.future);
			}
		},


		setFuture: function(futureId) {
			var future = futureLookup[futureId];

			if(self.curFuture) {
				self.curFuture.deactivate(game);
			}

			future.activate(game);
			self.curFutureId = futureId;
			self.curFuture = future;
		}

	};

	game.eventEmitter.on(game.ABILITY_DURING, self.onAbility);

	return self;

};