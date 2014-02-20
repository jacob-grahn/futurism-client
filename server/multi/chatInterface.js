'use strict';

var Chat = require('./chat');
var canJoinRoom = require('./canJoinRoom');


var ChatInterface = {
	initSocket: function(socket) {

		socket.onChat = function(eventName, callback) {
			socket.onAccount(eventName, function(data, account) {

				var chat = Chat.getRoom(data.roomName);

				if(account.silenced) {
					return socket.emitError('You have been silenced');
				}
				if(!canJoinRoom(account, data.roomName)) {
					return socket.emitError('You can not send messages to this room');
				}

				if(!chat) {
					chat = new Chat(data.roomName);
				}

				return callback(data, account, chat);
			});
		};


		socket.onChat('chat', function(data, account, chat) {
			chat.add(account, data.txt);
		});


		socket.onChat('chatHistory', function(data, account, chat) {
			socket.emit('chatHistory', {
				roomName: data.roomName,
				history: chat.msgs
			});
		});


		socket.onChat('reportChat', function(data, account, chat) {
			chat.report(account, data.note, function(err) {
				if(err) {
					return socket.emitError(err);
				}
				return socket.emitNotif('Report filed successfully');
			});
		});
	}
};


module.exports = ChatInterface;