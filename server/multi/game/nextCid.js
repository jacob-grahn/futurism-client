(function() {
	'use strict';

	var i = 1;

	/**
	 * cid is short for card id
	 * this returns an ever increasing number that
	 * resets every now and a gain just for the heck of it
	 */
	module.exports = function() {
		i++;
		if(i > 99999) {
			i = 1;
		}
	};
}());