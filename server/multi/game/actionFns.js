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
			return {err: 'no targets'};
		}

		var targets = actionFns.lookupTargets(game, targetPositions);
		var src = targets[0];
		var action = actions[actionId];

		if(!src) {
			return {err: 'invalid target position'};
		}
		if(!src.card) {
			return {err: 'no card at src target'};
		}
		if(src.card.moves <= 0) {
			return {err: 'this card has no moves'};
		}
		if(!action) {
			return {err: 'action not found'};
		}
		if(!action.free && src.card.abilities.indexOf(actionId) === -1) {
			return {err: 'card does not have the ability "'+actionId+'".'};
		}
		if(player !== src.player) {
			return {err: 'this is not your card'};
		}
		if(!actionFns.isValidAction(player, action, targets, game.board)) {
			return {err: 'target is not allowed'};
		}

		src.card.moves--;

		var result;
		if(targets.length === 1) {
			result = action.use(src, game.board);
		}
		if(targets.length === 2) {
			result = action.use(src, targets[1], game.board);
		}
		if(targets.length === 3) {
			result = action.use(src, targets[1], targets[2], game.board);
		}

		if(result && result.err) {
			src.card.moves++;
		}

		return result;
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

			// if the target is a future
			if(typeof pos.future !== 'undefined') {
				target = {future: pos.future};
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
				var validTargets = module.exports.useFilters(filters, player, [target], board, targets);
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
	 * @param {Array} targetChain
	 */
	useFilters: function(filters, player, targets, board, targetChain) {
		var filtered = _.clone(targets);
		_.each(filters, function(filter) {
			filtered = filter(filtered, player, board, targetChain);
		});
		return filtered;
	}

};


module.exports = actionFns;