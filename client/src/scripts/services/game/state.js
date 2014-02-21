angular.module('futurism')
	.factory('state', function(turn) {
		'use strict';

		var state = {
			THINKING: 'thinking',
			WAITING: 'waiting',
			TARGETING: 'targeting',

			name: 'none',
			data: null,

			/**
			 * Update the state
			 * @param {string} name
			 * @param {*} [data]
			 */
			set: function(name, data) {
				state.name = name;
				state.data = data;
			},


			/**
			 * Reset to a default
			 */
			toDefault: function() {
				if(turn.isMyTurn()) {
					state.set(state.THINKING);
				}
				else {
					state.set(state.WAITING);
				}
			}
		};

		return state;
	});