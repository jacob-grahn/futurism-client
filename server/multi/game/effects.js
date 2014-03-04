(function() {
	'use strict';

	var _ = require('lodash');


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
		 */
		death: function(targets) {
			_.each(targets, function(target) {
				if(target.card && target.card.health <= 0) {
					var card = target.card;
					card.health = 0;
					target.player.graveyard.push(card);
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
		},


		/**
		 * Cards in your hand should have one action point
		 */
		hand: function(players) {
			_.each(players, function(player) {
				_.each(player.hand, function(card) {
					card.moves = 1;
				});
			});
		},


		/**
		 * Gain pride from your cards in play
		 * @param {Player} player
		 * @param {Board} board
		 */
		rally: function(player, board) {

			// get a list of cards with action points
			var targets = board.playerTargets(player._id);

			// count how many cards of each faction there are
			var factions = {};
			var dominantFaction = '';
			eachCard(targets, function(card) {
				if(factions[card.faction]) {
					factions[card.faction] += 1;
				}
				else {
					factions[card.faction] = 1;
				}
			});

			// find the faction with the majority
			var most = 0;
			factions.no = 0; // make sure the non-faction 'no' is not the majority
			_.each(factions, function(count, faction) {
				if(count === most) {
					dominantFaction = '';
				}
				if(count > most) {
					dominantFaction = faction;
					most = count;
				}
			});

			// dominant faction gets +2, others get +1
			eachCard(targets, function(card) {
				if(card.faction === dominantFaction) {
					player.pride += 2;
				}
				else {
					player.pride += 1;
				}
			});

			return dominantFaction;

		}
	}
}());