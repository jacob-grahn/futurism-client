angular.module('futurism')
	.factory('targeter', function($routeParams, state, shared, board, players, socket) {

		var actions = shared.actions;

		var targeter = {


			/**
			 * Choose an action to use
			 * @param {String} actionId
			 * @param {Number} cid
			 */
			selectAction: function(actionId, cid) {
				if(state.name !== 'thinking') {
					return false;
				}
				var action = actions[actionId];
				var target = board.cidToTarget(cid);
				state.set(state.TARGETING, {
					actionId: actionId,
					restrict: action.restrict,
					targets: [target]
				});
				return targeter.checkTargetChain();
			},


			/**
			 * Choose a target to use an ability on
			 * @param {Object} target
			 */
			selectTarget: function(target) {
				if(state.name !== state.TARGETING) {
					return false;
				}
				if(!targeter.isValidTarget(target)) {
					state.set(state.THINKING);
					return false;
				}
				state.data.targets.push(target);
				return targeter.checkTargetChain();
			},


			/**
			 * Send an action with its targets to the server if all targets have been selected
			 */
			checkTargetChain: function() {
				if(state.data.targets.length >= state.data.restrict.length) {
					socket.authEmit('doAction', {
						gameId: $routeParams.gameId,
						actionId: state.data.actionId,
						targets: state.data.targets
					});
					state.set(state.THINKING);
				}
			},


			/**
			 * Returns if target is allowed by current filter
			 */
			isValidTarget: function(target) {
				if(state.name !== state.TARGETING) {
					return false;
				}
				var filters = state.data.restrict[state.data.targets.length];
				var targets = [target];
				_.each(filters, function(filter) {
					targets = filter(targets, players.me);
				});
				return targets.length !== 0;
			}
		};

		return targeter;
	});