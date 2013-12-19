(function() {
	'use strict';

	var actions = require('./actions');
	var _ = require('lodash');

	module.exports = {


		/**
		 * Perform an action
		 * @param {object} board
		 * @param {object} players
		 * @param {object} player
		 * @param {string} actionStr
		 * @param {Array} targets
		 */
		doAction: function(board, player, actionStr, targets) {
			if(targets.length === 0) {
				return 'no targets';
			}

			var srcPos = targets[0];
			var src = board.targetPos(srcPos);
			var action = actions[actionStr];

			if(!src) {
				return 'invalid target position';
			}
			if(!src.card) {
				return 'no card at src target';
			}
			if(!action) {
				return 'action not found';
			}
			if(action.free || src.card.abilities.indexOf(actionStr) === -1) {
				return 'card does not have this ability';
			}
			if(player !== src.player) {
				return 'this is not your card';
			}
			if(!module.exports.isValidAction(board, player, action, targets.slice(1))) {
				return 'target is not allowed';
			}

			if(targets.length === 1) {
				action.use(src);
			}
			if(targets.length === 2) {
				action.use(src, board.targetPos(targets[1]));
			}
			if(targets.length === 3) {
				action.use(src, board.targetPos(targets[1]), board.targetPos(targets[2]));
			}

			return 'success';
		},


		/**
		 * Checks if an action's targets are allowed
		 * @param {object} board
		 * @param {object} player
		 * @param {object} action
		 * @param {Array} targets
		 * @returns {boolean} result
		 */
		isValidAction: function(board, player, action, targets) {
			var valid = true;
			_.each(targets, function(targetPos, index) {
				var target = board.targetPos(targetPos);
				var validTargets;

				var filterStr = 'restrict';
				if(index > 0) {
					filterStr += (index+1);
				}
				var filters = action[filterStr];

				if(filters) {
					validTargets = module.exports.useFilters(filters, player, board.allTargets());
					if(validTargets.indexOf(target) === -1) {
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
		 * @param {array} targets
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