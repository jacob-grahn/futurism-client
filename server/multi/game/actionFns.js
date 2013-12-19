(function() {
	'use strict';

	var actions = require('./actions');
	var _ = require('lodash');

	module.exports = {

		/**
		 * Perform an action
		 * @param {object} account
		 * @param {string} actionStr
		 * @param {number} srcTargetId
		 * @param {[number]} targetIds
		 */
		var doAction = function(account, actionStr, targetIds, srcTargetId) {
			var src = idToTarget(srcTargetId);
			var action = actions[actionStr];

			if(!src) {
				return 'invalid target id';
			}
			if(actionStr !== 'move' && actionStr !== 'attk' && src.card.abilities.indexOf(actionStr) === -1) {
				return 'card does not have this ability';
			}
			if(!action) {
				return 'action not found';
			}
			if(account._id !== src.account._id) {
				return 'this is not your card';
			}
			if(!isValidAction(account, action, targetIds, srcTargetId)) {
				return 'that target is not allowed';
			}

			var target1 = idToTarget(targetIds[0]);
			var target2 = idToTarget(targetIds[1]);
			action.use(target1, src, target2);

			targets = getAllTargets(accounts);

			return 'success';
		};


	/**
	 * Checks if an action's targets are allowed
	 * @param {object} account
	 * @param {object} action
	 * @param {number} srcTargetId
	 * @param {[number]} targetIds
	 * @returns {boolean} result
	 */
	var isValidAction = function(account, action, targetIds, srcTargetId) {
		var valid = true;
		_.each(targetIds, function(targetId, index) {
			var target = idToTarget(targetId);
			var validTargets;

			var filterStr = 'targets';
			if(index > 0) {
				filterStr += (index+1);
			}
			var filters = action[filterStr];

			if(filters === null) {
				validTargets = [srcTargetId];
			}
			else if(filters === undefined) {
				validTargets = targets;
			}
			else {
				validTargets = useFilters(filters, account);
			}

			if(validTargets.indexOf(target) === -1) {
				valid = false;
			}
			/*console.log('action', action);
			 console.log('filters', filterStr, filters);
			 console.log('validTargets', validTargets);
			 console.log('---');
			 console.log('target', target);
			 console.log('000');
			 console.log('valid', valid);*/
		});
		return valid;
	};


	/**
	 * Find all targets that an ability can be used on
	 * @param {array} filters
	 * @param {object} account
	 */
	var useFilters = function(filters, account) {
		var filtered = _.clone(targets);
		//console.log('filtered', filtered);
		_.each(filters, function(filter) {
			filtered = filter(filtered, account);
			//console.log('filtered', filtered);
		});
		return filtered;
	};

	};

}());