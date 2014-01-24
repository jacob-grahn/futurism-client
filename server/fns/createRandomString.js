'use strict';

/**
 * Create a string made up of random characters
 * @param {number} [len]
 * @returns {string}
 */
var createRandomString = function(len) {
	len = len || 12;
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for(var i=0; i<len; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
};

module.exports = createRandomString;