(function() {
	'use strict';

	var UserGoose = require('../models/user');


	/**
	 * Return the user associated with an existing session
	 */
	module.exports = function(req, res) {
		UserGoose.findById(req.session.userId, function(err, user) {
			if(err) {
				res.apiOut(err);
			}
			if(!user) {
				res.apiOut('no user found with that token');
			}
			res.apiOut(null, user);
		});
	};

}());