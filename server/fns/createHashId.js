'use strict';

var crypto = require('crypto');

/**
 * Turn a string into url and filesystem safe hash string
 * @param {string} str
 * @param {number} (len)
 * @returns {string}
 */
var createHashId = function(str, len) {
	len = len || 8;
	var md5 = crypto.createHash('md5');
	console.log('md5', str);
	md5.update(str, 'utf8');
	var hash = md5.digest('base64');
	hash = hash.replace(/[\/\+]/ig, '');
	hash = hash.substring(0, len);
	return(hash);
};

module.exports = createHashId;