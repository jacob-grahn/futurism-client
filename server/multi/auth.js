(function() {
	'use strict';

	var session = require('../fns/redisSession');

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

					return callback(null, socket, sess);
				});
			});
		}
	};

}());