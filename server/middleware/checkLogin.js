(function() {
	'use strict';

	module.exports = function(req, res, next) {
		if (req.session && req.session._id) {
			return next();
		}
		else {
			return res.apiOut({code: 401, message: 'You are not authorized to view this page'}, null);
		}
	}

}());



