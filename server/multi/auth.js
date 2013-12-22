(function() {
	'use strict';

	var session = require('../fns/mongoSession');
	var revalidateLogin = require('../fns/revalidateLogin');

	module.exports = {

		authorizeSocket: function(socket, callback) {
			socket.emit('auth', {serverVersion: '0.0.5'});

			socket.on('auth', function(data) {
				
				session.get(data.token, function(err, sess) {
					if(err) {
						return callback(err, socket);
					}
					if(!sess) {
						return callback('no session', socket);
					}

					revalidateLogin(sess.userId, function(err, user) {
						if(err) {
							return callback(err, socket);
						}

						return callback(null, socket, user);
					});
				});
			});
		}
	};

}());