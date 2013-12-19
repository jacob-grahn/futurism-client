(function() {
	'use strict';

	var session = require('../fns/mongoSession');


	module.exports = function(req, res, next) {

		req.session = req.session || {};

		if(!req.headers || !req.headers['session-token']) {
			return next();
		}

		var token = req.headers['session-token'];
		mongoSession.get(token, function(err, result) {
			if(!err && result) {
				req.session = result;
			}
			next();
		});
	};

}());