(function() {
	'use strict';

	var Chat = require('./chat');


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
					Chat.safeAdd(account, data.txt, data.roomName);
				});
			});


			socket.on('chatHistory', function(roomName) {
				socket.emit('chatHistory', {
					roomName: roomName,
					history: Chat.safeGetHistory(roomName)
				});
			});


			socket.on('createChat', function(data) {
				//Chat.safeCreate(data.roomName);
			})
		}
	};


	module.exports = ChatInterface;

}());