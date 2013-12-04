/**
 * A collection of simple helper functions
 * @type {{getIp: Function, objToUrlParams: Function, copyAll: Function, copySome: Function, cloneSome: Function}}
 */

var crypto = require('crypto');
var sanitize = require('validator').sanitize;
var _ = require('lodash');

module.exports = {

	/**
	 * Takes a request from express and tries to figure out the ip of the user
	 * @param {object} req
	 * @returns {string}
	 */
	getIp: function(req) {
		var ip = false;
		if(req.headers['x-forwarded-for']) {
			var arr = req.headers['x-forwarded-for'].split(',');
			ip = arr[0];
		}
		else {
			ip = req.connection.remoteAddress;
		}
		return(ip);
	},


	/**
	 * Convert a shallow object into url encoded parameters
	 * @param {object} obj
	 * @returns {string}
	 */
	objToUrlParams: function(obj) {
		var str = "";
		for (var key in obj) {
			if (str != "") {
				str += "&";
			}
			str += encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
		}
		return(str);
	},


	/**
	 * Create a string made up of random characters
	 * @param {number} [len]
	 * @returns {string}
	 */
	createRandomString: function(len) {
		len = len || 12;
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for(var i=0; i<len; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	},


	/**
	 * Turn a string into url and filesystem safe hash string
	 * @param {string} str
	 * @param {number} (len)
	 * @returns {string}
	 */
	createHashId: function(str, len) {
		len = len || 8;
		var md5 = crypto.createHash('md5');
		md5.update(str, 'utf8');
		var hash = md5.digest('base64');
		hash = hash.replace(/[\/\+]/ig, '');
		hash = hash.substring(0, len);
		return(hash);
	},


	/**
	 * Remove all instances of val from arr
	 * @param {Array} arr
	 * @param {*} val
	 * @returns {Array}
	 */
	removeFromArray: function(arr, val) {
		var index = arr.indexOf(val);
		while(index !== -1) {
			arr.splice(index, 1);
			index = arr.indexOf(val);
		}
		return arr;
	},


	/**
	 * Fully output an object to a JSON encoded string
	 * @param {*} val
	 * @returns {string}
	 */
	varDump: function(val) {
		var util = require('util');
		var str = util.inspect(val, false, null);
		return str;
	}
};