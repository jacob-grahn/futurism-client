(function() {
	'use strict';

	var actions = require('./../../../shared/actions');
	var _ = require('lodash');

	module.exports = {


		/**
		 * Perform an action
		 * @param {object} board
		 * @param {object} players
		 * @param {object} player
		 * @param {string} actionStr
		 * @param {Array} targetPositions
		 */
		doAction: function(board, player, actionStr, targetPositions) {
			if(targetPositions.length === 0) {
				return 'no targets';
			}

			var srcPos = targetPositions[0];
			var src = board.targetPos(srcPos);
			var action = actions[actionStr];

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
			if(!action.free && src.card.abilities.indexOf(actionStr) === -1) {
				return 'card does not have the ability "'+actionStr+'".';
			}
			if(player !== src.player) {
				return 'this is not your card';
			}
			if(!module.exports.isValidAction(board, player, action, targetPositions)) {
				return 'target is not allowed';
			}

			src.card.moves--;

			if(targetPositions.length === 1) {
				action.use(src);
			}
			if(targetPositions.length === 2) {
				action.use(src, board.targetPos(targetPositions[1]));
			}
			if(targetPositions.length === 3) {
				action.use(src, board.targetPos(targetPositions[1]), board.targetPos(targetPositions[2]));
			}

			return 'ok';
		},


		/**
		 * Checks if an action's targets are allowed
		 * @param {object} board
		 * @param {object} player
		 * @param {object} action
		 * @param {Array} targetPositions
		 * @returns {boolean} result
		 */
		isValidAction: function(board, player, action, targetPositions) {
			var valid = true;
			_.each(targetPositions, function(targetPos, index) {
				var target = board.targetPos(targetPos);
				var filters = action.restrict[index];

				if(filters) {
					var validTargets = module.exports.useFilters(filters, player, [target]);
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
		 */
		useFilters: function(filters, player, targets) {
			var filtered = _.clone(targets);
			_.each(filters, function(filter) {
				filtered = filter(filtered, player);
			});
			return filtered;
		}

	};

}());