'use strict';

/**
 * Fully output an object to a JSON encoded string
 * @param {*} val
 * @returns {string}
 */
var varDump = function(val) {
	var util = require('util');
	return util.inspect(val, false, null);
};

module.exports = varDump;