(function() {
	'use strict';

	var SessionGoose = require('../models/session');
	var fns = require('../fns/fns');


	var MongoSession = function() {
		var self = this;

		/**
		 * Create a new session and store data to it
		 * @param {object} data
		 * @param {function} callback
		 * @returns {void}
		 */
		self.make = function(data, callback) {
			var token = self.createToken();
			self.set(token, data, function(err, result) {
				console.log('mongoSession::make', err, result);
				if(err) {
					return callback(err);
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
		self.set = function(token, data, callback) {
			var session = new SessionGoose();
			session._id = token;
			session.value = data;
			session.save(function(err) {
				return callback(err, session.value);
			});
		};


		/**
		 * Get data from a session
		 * @param {string} token
		 * @param {function} callback
		 * @returns {void}
		 */
		self.get = function(token, callback) {
			SessionGoose.findById(token, function(err, result) {
				console.log('mongoSession::get', token, err, result);
				if(err) {
					return callback(err);
				}
				return callback(null, result.value);
			});
		};


		/**
		 * Delete a session
		 * @param {string} token
		 * @param {function} callback
		 * @returns {void}
		 */
		self.destroy = function(token, callback) {
			SessionGoose.findByIdAndRemove(token, callback);
		};


		/**
		 * Create a random string to use as a token
		 * @returns {string} token
		 */
		self.createToken = function() {
			return fns.createRandomString(32);
		};
	};


	module.exports = new MongoSession();

}());