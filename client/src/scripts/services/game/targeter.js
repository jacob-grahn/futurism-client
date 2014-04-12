angular.module('futurism')
	.factory('targeter', function($routeParams, state, shared, board, players, socket) {

		var actions = shared.actions;

		var targeter = {


			onCooldown: false,


			/**
			 * Choose an action to use
			 * @param {String} actionId
			 * @param {Object} target
			 */
			selectAction: function(actionId, target) {
				if(state.name !== 'thinking') {
					console.log('state is not thinking', state.name);
					return false;
				}
				var action = actions[actionId];
				state.set(state.TARGETING, {
					actionId: actionId,
					restrict: action.restrict,
					targets: [target]
				});
				targeter.cooldown();
				return targeter.checkTargetChain();
			},


			/**
			 * Choose a target to use an ability on
			 * @param {Object} target
			 */
			selectTarget: function(target) {
				if(targeter.onCooldown) {
					return false;
				}
				if(state.name !== state.TARGETING) {
					return false;
				}
				if(!targeter.isValidTarget(target)) {
					state.toDefault();
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

					var targets = _.map(state.data.targets, function(target) {
						return {
							column: target.column,
							row: target.row,
							playerId: target.player._id,
							cid: target.card ? target.card.cid : null
						};
					});

					socket.emit('doAction', {
						gameId: $routeParams.gameId,
						actionId: state.data.actionId,
						targets: targets
					});

					state.toDefault();
				}
			},


			/**
			 * Returns if target is allowed by current filter
			 */
			isValidTarget: function(target) {
				if(state.name !== state.TARGETING) {
					return false;
				}
				var targetChain = state.data.targets;
				var filters = state.data.restrict[targetChain.length];
				var targets = [target];
				_.each(filters, function(filter) {
					targets = filter(targets, players.findMe(), board, targetChain);
				});
				return targets.length !== 0;
			},


			/**
			 * Returns if a valid target is in your hand
			 */
			isValidTargetInHand: function() {

			},


			/**
			 * prevent targeting immediately after an action
			 * handy for preventing double clicks from messing things up
			 */
			cooldown: function() {
				targeter.onCooldown = true;
				_.delay(function() {
					targeter.onCooldown = false;
				}, 500);
			}
		};

		return targeter;
	});