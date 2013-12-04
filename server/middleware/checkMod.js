(function() {
	'use strict';

	module.exports = function(req, res, next) {
		if (req.session && req.session.userId && req.session.group === 'mod') {
			next();
		}
		else {
			var err = {code: 401, message: 'You are not authorized to view this page'};
			res.apiOut(err, null);
		}
	};

}());
