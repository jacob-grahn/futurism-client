var session = require('../fns/mongoSession');
var revalidateLogin = require('../fns/revalidateLogin');
var _ = require('lodash');

module.exports = function() {
	'use strict';

	return {

		authorizeSocket: function(socket, callback) {
			socket.emit('auth', {serverVersion: '0.0.4'});

			socket.on('auth', function(data) {

				mongoSession.get(data.token, function(err, sess) {
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

						socket.set('account', _.pick(user, '_id', 'name', 'site', 'group', 'silencedUntil'), function (err) {
							return callback(err, socket);
						});
					});
				});
			});
		}

	};
};