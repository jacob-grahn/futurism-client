angular.module('futurism')
	.factory('state', function() {
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
			clear: function() {

			}
		};

		return state;
	});