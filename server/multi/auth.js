(function() {
	'use strict';

	var session = require('../fns/mongoSession');
	var revalidateLogin = require('../fns/revalidateLogin');
	var _ = require('lodash');

	var Auth = {

		authorizeSocket: function(socket, callback) {
			socket.emit('auth', {serverVersion: '0.0.5'});

			socket.on('auth', function(data) {
				socket.removeAllListeners('auth');

				session.get(data.token, function(err, sess) {
					if(err) {
						return callback(err);
					}
					if(!sess) {
						return callback('no session');
					}

					revalidateLogin(sess.userId, function(err, user) {
						if(err) {
							return callback(err);
						}

						callback(null, socket, user);
					});
				});
			});
		}
	};

	module.exports = Auth;

}());