'use strict';

var canJoinRoom = function(account, room) {
	var arr = room.split(':');
	if(arr[0] === 'open') {
		return true;
	}
	if(arr[0] === 'guild') {
		if(account.guild === arr[2]) {
			return true;
		}
	}
	return false;
};

module.exports = canJoinRoom;