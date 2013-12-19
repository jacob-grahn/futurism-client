(function() {
	'use strict';


	var redis;
	var fns = require('../fns/fns');
	var sessionLife = 60*60; //one hour


	/**
	 * Set the redis connection to be used
	 * @param redisConn
	 */
	var setRedis = function(redisConn) {
		redis = redisConn;
	};


	/**
	 * Create a new session and store data to it
	 * @param {object} data
	 * @param {function} callback
	 * @returns {void}
	 */
	var make = function(data, callback) {
		var token = createToken();
		set(token, data, function(err, result) {
			if(err || result != 'OK') {
				return callback(err || result);
			}
			return callback(null, {token: token, result: result});
		});
	};


	/**
	 * Update data in the session
	 * @param {string} token
	 * @param {object} data
	 * @param {function} callback
	 * @returns {void}
	 */
	var set = function(token, data, callback) {
		redis.setex(token, sessionLife, JSON.stringify(data), callback);
	};


	/**
	 * Get data from a session
	 * @param {string} token
	 * @param {callback} function
	 * @returns {void}
	 */
	var get = function(token, callback) {
		redis.get(token, function(err, result) {
			if(err) {
				return callback(err);
			}
			var data = JSON.parse(result);
			return callback(null, data);
		});
	};


	/**
	 * Delete a session
	 * @param {string} token
	 * @param {function} callback
	 * @returns {void}
	 */
	var destroy = function(token, callback) {
		redis.del(token, callback);
	};


	/**
	 * Create a random string to use as a token
	 * @returns {string} token
	 */
	var createToken = function() {
		var token = fns.createRandomString(32);
		return token;
	};


	/**
	 * public interface
	 * @type {{setRedis: Function, make: Function, set: Function, get: Function, destroy: Function}}
	 */
	module.exports = {
		setRedis: setRedis,
		make: make,
		set: set,
		get: get,
		destroy: destroy
	};

}());