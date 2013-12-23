(function() {
	'use strict';

	var Lookup = require('../../fns/lookup');
	var lookup = new Lookup();


	/**
	 * Delete games that are over a certain age
	 * @param {number} maxAge in milliseconds
	 */
	lookup.purgeOldGames = function(maxAge) {
		lookup.purge(function(game) {
			var maxAge = maxAge || 60*60*1000;
			var age = new Date() - game.startedAt;
			return age < maxAge;
		});
	};


	/**
	 * public interface
	 * @type {Lookup}
	 */
	module.exports = lookup;

}());