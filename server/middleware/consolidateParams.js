/**
 * Copy all url parameters to req.body.
 * Makes it easy to know where to find incoming variables. Always on req.body.
 */

(function() {
	'use strict';

	var _ = require('lodash');


	module.exports = function(req, res, next) {
		if(!req.body) {
			req.body = {};
		}
		if(req.query) {
			_.extend(req.body, req.query);
		}
		if(req.params) {
			_.extend(req.body, req.params);
		}
		return next();
	}

}());