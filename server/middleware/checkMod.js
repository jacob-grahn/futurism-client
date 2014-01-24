(function() {
	'use strict';

	var groups = require('../../shared/groups');

	module.exports = function(req, res, next) {
		if (req.session && req.session._id && (req.user.group === groups.MOD || req.user.group === groups.ADMIN)) {
			next();
		}
		else {
			var err = {code: 401, message: 'You are not authorized to view this page'};
			res.apiOut(err, null);
		}
	};

}());
