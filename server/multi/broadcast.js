(function() {
	'use strict';

	var io;

	var broadcast = function(room, event, data) {
		if(io) {
			io.sockets.in(room).emit(event, data);
		}
		else {
			broadcast.lastMessage = {
				room: room,
				event: event,
				data: data
			};
		}
	};


	broadcast.setIo = function(socketIo) {
		io = socketIo;
	};


	module.exports = broadcast;

}());