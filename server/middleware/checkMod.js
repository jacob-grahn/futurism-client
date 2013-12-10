(function() {
	'use strict';

	var groups = require('../../shared/groups');

	module.exports = function(req, res, next) {
		if (req.session && req.session.userId && req.user.group === groups.MOD) {
			next();
		}
		else {
			var err = {code: 401, message: 'You are not authorized to view this page'};
			res.apiOut(err, null);
		}
	};

}());
