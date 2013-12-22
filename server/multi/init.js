(function() {
	'use strict';

	var auth = require('./auth');
	var _ = require('lodash');
	var ChatInterface = require('./chatInterface');
	var LobbyInterface = require('./lobbyInterface');


	module.exports = {

		/**
		 * Ask new sockets to authorize
		 */
		listenForConnections: function(io) {
			io.sockets.on('connection', function (socket) {
				auth.authorizeSocket(socket, onAuthorized);
			});
		}
	};




	/**
	 * Set up a socket's interface after it has authorized
	 * @param err
	 * @param socket
	 * @returns {*}
	 */
	var onAuthorized = function(err, socket, user) {
		if(err) {
			if(socket) {
				return socket.emitError(err);
			}
			return 'no socket';
		}


		/**
		 * Store values for later
		 */
		socket.set('account', _.pick(user, '_id', 'name', 'site', 'group'), function (err) {
			if(err) {
				return err;
			}

			socket.set('silencedUntil', user.silencedUntil, function(err) {
				if(err) {
					return err;
				}

				socket.set('_id', user._id, function(err) {
					if(err) {
						return err;
					}
				})
			});
		});


		/**
		 * Subscribe and unsubscribe to rooms
		 */
		socket.on('subscribe', function(roomName) {
			socket.join(roomName);
		});
		socket.on('unsubscribe', function(roomName) {
			socket.leave(roomName);
		});


		/**
		 * Return true if silencedUntil > curTime
		 * @param callback
		 */
		socket.isSilenced = function(callback) {
			socket.get('silencedUntil', function(err, silencedUntil) {
				if(err) {
					return callback(err);
				}
				var isSilenced = new Date(silencedUntil) > new Date();
				return callback(null, isSilenced);
			});
		};


		/**
		 * Standard way to return errors to the client
		 * @param message
		 */
		socket.emitError = function(message) {
			console.log('socket error:', message);
			socket.emit('error', message);
		};


		/**
		 * Route an event to an account
		 * @param eventName
		 * @param callback
		 */
		socket.onAccount = function(eventName, callback) {
			socket.on(eventName, function(data) {

				// get the account
				socket.get('account', function(err, account) {
					if(err) {
						return socket.emitError(err);
					}
					if(!account) {
						return socket.emitError('No account is registered to this connection.');
					}

					//everything worked
					callback(data, account);
				});
			});
		};


		/**
		 * Interface with different systems
		 */
		LobbyInterface.initSocket(socket);
		ChatInterface.initSocket(socket);


		/**
		 * let the client know that the server is ready to roll
		 */
		socket.emit('ready');
	}
}());