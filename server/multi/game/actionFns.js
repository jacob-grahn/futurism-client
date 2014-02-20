'use strict';

var actions = require('./../../../shared/actions');
var _ = require('lodash');

var actionFns = {


	/**
	 * Perform an action
	 * @param {object} game
	 * @param {object} player
	 * @param {string} actionId
	 * @param {Array} targetPositions
	 */
	doAction: function(game, player, actionId, targetPositions) {
		if(targetPositions.length === 0) {
			return 'no targets';
		}

		var targets = actionFns.lookupTargets(game, targetPositions);
		var src = targets[0];
		var action = actions[actionId];

		if(!src) {
			return 'invalid target position';
		}
		if(!src.card) {
			return 'no card at src target';
		}
		if(src.card.moves <= 0) {
			return 'this card has no moves';
		}
		if(!action) {
			return 'action not found';
		}
		if(!action.free && src.card.abilities.indexOf(actionId) === -1) {
			return 'card does not have the ability "'+actionId+'".';
		}
		if(player !== src.player) {
			return 'this is not your card';
		}
		if(!actionFns.isValidAction(player, action, targets, game.board)) {
			return 'target is not allowed';
		}

		src.card.moves--;

		if(targets.length === 1) {
			action.use(src);
		}
		if(targets.length === 2) {
			action.use(src, targets[1]);
		}
		if(targets.length === 3) {
			action.use(src, targets[1], targets[2]);
		}

		return 'ok';
	},


	/**
	 * Convert target positions into targets
	 * @param game
	 * @param targetPositions
	 * @returns {Array}
	 */
	lookupTargets: function(game, targetPositions) {
		var targets = [];

		_.each(targetPositions, function(pos) {
			var target;

			// if the target is in your hand or graveyard
			if(typeof pos.cid !== 'undefined') {
				var player = game.idToPlayer(pos.playerId);
				var card = game.cidToCard(player.hand, pos.cid) || game.cidToCard(player.graveyard, pos.cid);
				target = {
					player: player,
					card: card
				}
			}

			// if the target is a position on the board
			if(typeof pos.column !== 'undefined') {
				target = game.board.targetPos(pos);
			}

			targets.push(target);
		});

		return targets;
	},


	/**
	 * Checks if an action's targets are allowed
	 * @param {object} player
	 * @param {object} action
	 * @param {Array} targets
	 * @param {Board} board
	 * @returns {boolean} result
	 */
	isValidAction: function(player, action, targets, board) {
		var valid = true;
		_.each(targets, function(target, index) {
			var filters = action.restrict[index];

			if(filters) {
				var validTargets = module.exports.useFilters(filters, player, [target], board);
				if(validTargets.length === 0) {
					valid = false;
				}
			}
		});
		return valid;
	},


	/**
	 * Find all targets that an ability can be used on
	 * @param {array} filters
	 * @param {object} player
	 * @param {Array} targets
	 * @param {Board} board
	 */
	useFilters: function(filters, player, targets, board) {
		var filtered = _.clone(targets);
		_.each(filters, function(filter) {
			filtered = filter(filtered, player, board);
		});
		return filtered;
	}

};


module.exports = actionFns;