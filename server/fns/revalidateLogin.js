var User = require('../models/user');

module.exports = function(userId, callback) {
	User.findById(userId, function(err, user) {
		if(err) {
			return callback(err);
		}
		if(new Date(user.bannedUntil) > new Date()) {
			return callback('This account is banned until ' + user.bannedUntil);
		}
		return callback(null, user);
	});
};