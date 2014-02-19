'use strict';

var Lobby = require('./lobby');


module.exports = {

	/**
	 * Hookup a socket to the functions in Lobby.js
	 * @param socket
	 */
	initSocket: function(socket) {

		socket.onLobby = function(event, callback) {
			socket.onAccount(event, function(data, account) {
				var lobby = Lobby.lookup.idToValue(data.lobbyName);
				if(!lobby) {
					lobby = Lobby.createRoom(data.lobbyName);
				}
				return callback(data, account, lobby);
			});
		};

		socket.onLobby('createMatchup', function(data, account, lobby) {
			lobby.createMatchup(account, data.rules);
		});

		socket.onLobby('joinMatchup', function(data, account, lobby) {
			lobby.joinMatchup(account, data.matchupId);
		});

		socket.onLobby('leaveMatchup', function(data, account, lobby) {
			lobby.leaveMatchup(account);
		});

		socket.onLobby('allMatchups', function(data, account, lobby) {
			socket.emit('allMatchups', lobby.matchups.toArray());
		});

		socket.on('disconnect', function() {
			socket.get('account', function(err, account) {
				if(err) {
					return err;
				}
				return Lobby.leaveAll(account);
			});
		});
	}
};