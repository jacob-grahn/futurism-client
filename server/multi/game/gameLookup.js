(function() {
	'use strict';

	var lookup = require('../../fns/lookup')();

	/**
	 * Find a game by its gameId
	 * @type {*}
	 */
	lookup.idToGame = lookup.idToValue;

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
	 * @type {*|exports}
	 */
	module.exports = lookup;

}());