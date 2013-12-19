(function() {
	'use strict';

	var session = require('../fns/mongoSession');


	/**
	 * Delete an existing session
	 */
	module.exports = function(req, res) {

		if(!req.session.userId || !req.body.token) {
			return res.apiOut('No token to delete', null);
		}

		var token = req.body.token;
		session.destroy(token, function(err, result) {
			return res.apiOut(err, result);
		})
	};

}());