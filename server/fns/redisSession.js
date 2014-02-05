'use strict';

var _ = require('lodash');
var createRandomString = require('../fns/createRandomString');
var redisConnect = require('../fns/redisConnect');
var sessionLife = 60*60; //one hour
var client;
var redisSession = {};


/**
 * Connect to a redis database
 * @param {string} [uri]
 * @param {Function} [callback]
 */
redisSession.connect = function(uri, callback) {
	redisSession.end();
	client = redisConnect(uri, callback);
};


/**
 * Close redis connection
 */
redisSession.end = function() {
	if(client) {
		client.end();
		client = null;
	}
};


/**
 * Create a new session and store data to it
 * @param {string} userId
 * @param {Object} data
 * @param {Function} callback
 * @returns {void}
 */
redisSession.make = function(userId, data, callback) {
	data.token = redisSession.createToken(userId);
	redisSession.set(data.token, data, function(err, result) {
		return callback(err, result, data.token);
	});
};


/**
 * Update data in the session
 * @param {string} tz
 * @param {object} data
 * @param {function} callback
 */
redisSession.set = function(token, data, callback) {
	var userId = token.split('-')[0];
	client.setex(userId, sessionLife, JSON.stringify(data), callback);
};


/**
 * Update a session with new values
 * @param userId
 * @param data
 * @param callback
 */
redisSession.update = function(userId, data, callback) {
	redisSession._get(userId, function(err, result) {
		if(err === 'no session found with this token') {
			return callback(null, null);
		}
		if(err) {
			return callback(err);
		}

		_.assign(result, data);
		return redisSession.set(userId, result, function(err, result) {
			if(err) {
				return callback(err);
			}

			client.publish('sessionUpdate', userId);
			return callback(null, result);
		});
	});
};


/**
 * Get data from a session
 * @param {string} token
 * @param {Function} callback
 * @returns {void}
 */
redisSession._get = function(token, callback) {
	var userId = token.split('-')[0];

	client.get(userId, function(err, result) {
		if(err) {
			return callback(err);
		}
		if(!result) {
			return callback('no session found with this token');
		}

		var obj = JSON.parse(result);

		return callback(null, obj);
	});
};


/**
 * Only return a session if the token matches
 * @param token
 * @param callback
 */
redisSession.get = function(token, callback) {
	redisSession._get(token, function(err, obj) {
		if(err) {
			return callback(err);
		}
		if(obj.token !== token) {
			return callback('Token does not match');
		}
		return callback(null, obj);
	});
};


/**
 * Delete a session
 * @param {string} token
 * @param {function} callback
 * @returns {void}
 */
redisSession.destroy = function(token, callback) {
	var userId = token.split('-')[0];

	redisSession.get(token, function(err, doc) {
		if(err) {
			return callback(err);
		}
		if(doc.token !== token) {
			return callback('not the right token');
		}
		return client.del(userId, callback);
	});
};


/**
 * Create a random string to use as a token
 * @param {string} userId
 * @returns {string} token
 */
redisSession.createToken = function(userId) {
	return userId + '-' + createRandomString(32);
};


module.exports = redisSession;