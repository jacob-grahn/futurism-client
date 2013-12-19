(function() {
	'use strict';

	var _ = require('lodash');


	var idToPlayer = function(players, id) {
		var matchPlayer = null;
		_.each(players, function(player) {
			if(player._id === id) {
				matchPlayer = player;
			}
		});
		return matchPlayer;
	};


	/**
	 * Loop through every target and call iteratorFunc on
	 * the targets that have a card
	 * @param {[object]} targets
	 * @param {function} iteratorFunc
	 */
	var eachCard = function(targets, iteratorFunc) {
		_.each(targets, function(target) {
			if(target.card) {
				iteratorFunc(target.card);
			}
		});
	};


	module.exports = {


		/**
		 * Move all cards with life <= 0 to their owner's graveyard
		 * @param {[object]} targets
		 * @param players
		 */
		death: function(targets, players) {
			_.each(targets, function(target) {
				if(target.card && target.card.health <= 0) {
					var card = target.card;
					var player = idToPlayer(players, target.playerId);
					card.health = 0;
					player.graveyard.push(card);
					target.card = null;
				}
			});
		},


		/**
		 * Apply poison damage to poisoned cards
		 * @param {[object]} targets
		 */
		poison: function(targets) {
			eachCard(targets, function(card) {
				if(card.poison > 0) {
					card.health -= card.poison;
				}
			});
		},


		/**
		 * End attack buffs, shields, and hero
		 * @param {[object]} targets
		 */
		deBuf: function(targets) {
			eachCard(targets, function(card) {
				card.attackBuf = 0;
				card.shield = 0;
				card.hero = 0;
			});
		},


		/**
		 * Give cards a movement point
		 * @param {[object]} targets
		 */
		refresh: function(targets) {
			eachCard(targets, function(card) {
				if(card.moves < 1) {
					card.moves++;
				}
			});
		}
	}
}());