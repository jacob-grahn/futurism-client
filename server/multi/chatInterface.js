'use strict';

var Chat = require('./chat');
var canJoinRoom = require('./canJoinRoom');


var ChatInterface = {
	initSocket: function(socket) {


		socket.onAccount('chat', function(data, account) {
			socket.isSilenced(function(err, silenced) {
				if(err) {
					return err;
				}
				if(silenced) {
					return socket.emit('silenced', 'you have been silenced');
				}
				if(!canJoinRoom(account, data.roomName)) {
					return 'You can not send messages to this room';
				}
				return Chat.safeAdd(account, data.txt, data.roomName);
			});
		});


		socket.on('chatHistory', function(roomName) {
			socket.emit('chatHistory', {
				roomName: roomName,
				history: Chat.safeGetHistory(roomName)
			});
		});


		socket.on('createChat', function(roomName) {
			Chat.safeCreate(roomName);
		});
	}
};


module.exports = ChatInterface;