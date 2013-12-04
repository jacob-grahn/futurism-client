module.exports = function(io) {
	'use strict';

	var auth = require('./auth')();
	var Lobby = require('./lobby');
	var Chat = require('./chat');
	var gamehub = require('./gamehub')(io);
	var deckPreload = require('./deckPreload');
	var broadcast = require('./broadcast');

	var lobby = Lobby('brutus');
	Chat.safeCreate('chat-brutus');
	broadcast.setIo(io);


	io.sockets.on('connection', function (socket) {
		auth.authorizeSocket(socket, init);
	});


	function init(err, socket) {
		if(err) {
			return socket.emit('authFail', err);
		}

		socket.on('subscribe', function(roomName) {
			socket.join(roomName);
		});
		socket.on('unsubscribe', function(roomName) {
			socket.leave(roomName);
		});


		socket.isSilenced = function(callback) {
			socket.get('account', function(err, account) {
				if(err) {
					return callback(err);
				}
				return callback(null, new Date(account.silencedUntil) > new Date(), account);
			});
		};

		Lobby.initSocket(socket);
		Chat.initSocket(socket);
		deckPreload.initSocket(socket);

		socket.emit('ready');
	}
};