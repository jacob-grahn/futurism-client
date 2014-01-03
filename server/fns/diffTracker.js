(function() {
	'use strict';

	var _ = require('lodash');
	var diff = require('./diff');


	/**
	 * Watch for changed over time
	 * @param {Object} initialState
	 */
	var diffTracker = function(initialState) {
		var self = this;
		self.state = _.cloneDeep(initialState) || {};

		self.diff = function(newState) {
			var changes = diff(self.state, newState);
			self.state = _.cloneDeep(newState);
			return changes;
		};

		self.clear = function() {
			self.state = {};
		}
	};


	module.exports = diffTracker;

}());