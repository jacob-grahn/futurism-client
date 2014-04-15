'use strict';

var _ = require('lodash');
var futures = require('../../../../shared/futures');

var self = {


	activate: function(game) {
		game.eventEmitter.on(game.CHANGE, self.reanimateDead);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.CHANGE, self.reanimateDead);
	},


	reanimateDead: function(game, cause, changes, data) {
		if(cause === 'death') {
			_.each(data.deaths, function(death) {
				var player = game.idToPlayer(death.playerId);
				_.each(player.graveyard, function(card, index) {
					if(card.cid === death.cid && !card.zombie) {
						player.graveyard.splice(index, 1);
						game.board.target(death.playerId, death.column, death.row).card = self.makeZombie(card);
						return false;
					}
				});
			});
		}

		game.broadcastChanges(futures.Z_VIRUS);
	},


	makeZombie: function(card) {
		return {
			_id: 'zombie',
			cid: card.cid,
			version: 1,
			name: 'zombie '+card.name,
			hasImage: true,
			attack: 2,
			health: 1,
			moves: 1,
			faction: card.faction,
			abilities: [],
			zombie: true
		}
	}

};

module.exports = self;