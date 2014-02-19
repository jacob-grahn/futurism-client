'use strict';

var auth = require('./auth');
var _ = require('lodash');
var ChatInterface = require('./chatInterface');
var LobbyInterface = require('./lobbyInterface');
var GameInterface = require('./game/gameInterface');
var canJoinRoom = require('./canJoinRoom');


module.exports = {

	/**
	 * Ask new sockets to authorize
	 */
	listenForConnections: function(io) {
		io.sockets.on('connection', function (socket) {
			init(socket);
		});
	}
};



var init = function(socket) {

	/**
	 * Standard way to return errors to the client
	 * @param message
	 */
	socket.emitError = function(message) {
		socket.emit('error', message);
	};

	/**
	 * verify the owner of this connection
	 */
	auth.authorizeSocket(socket, onAuthorized);
};




/**
 * Set up a socket's interface after it has authorized
 * @param err
 * @param socket
 * @param user
 * @returns {*}
 */
var onAuthorized = function(err, socket, user) {
	if(err) {
		return socket.emit('authFail', err);
	}


	/**
	 * Store values for later
	 */
	socket.set('account', _.pick(user, '_id', 'name', 'site', 'group', 'guild', 'silencedUntil'));


	/**
	 * Subscribe and unsubscribe to rooms
	 */
	socket.on('subscribe', function(roomName) {
		socket.get('account', function(err, account) {
			if(canJoinRoom(account, roomName)) {
				socket.join(roomName);
			}
		});
	});

	socket.on('unsubscribe', function(roomName) {
		socket.leave(roomName);
	});


	/**
	 * Return true if silencedUntil > curTime
	 * @param callback
	 */
	socket.isSilenced = function(callback) {
		socket.get('account', function(err, account) {
			if(err) {
				return callback(err);
			}
			var isSilenced = new Date(account.silencedUntil) > new Date();
			return callback(null, isSilenced);
		});
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
	GameInterface.initSocket(socket);


	/**
	 * let the client know that the server is ready to roll
	 */
	socket.emit('ready');
};