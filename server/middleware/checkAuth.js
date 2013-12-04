(function() {
	'use strict';

	var revalidateLogin = require('../fns/revalidateLogin');


	module.exports = function(req, res, next) {

		if (!req.session || !req.session.userId) {
			return res.apiOut({code: 401, message: 'You are not authorized to view this page'}, null);
		}

		revalidateLogin(req.session.userId, function(err, user) {
			if(err) {
				return res.apiOut({code: 401, message: err}, null);
			}
			req.user = user;
			return next();
		});
	}

}());



