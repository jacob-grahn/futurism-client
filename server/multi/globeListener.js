'use strict';

var io = require('io');
var redisSession = require('../fns/redisSession');
var redisClient = require('../fns/redisConnect')();


redisClient.subscribe('sessionUpdate');
//redisClient.subscribe('ipBan');

redisClient.on('message', function(channel, data) {
	if(channel === 'sessionUpdate') {
		updateUser(data);
	}
	if(channel === 'ipBan') {
		//disconnectIp(data); have to figure out how to determine client ip address first
	}
});


var updateUser = function(userId) {

	redisSession.get(userId, function(err, sessionData) {
		if(err) {
			return err;
		}

		var sockets = io.sockets.clients();

		return _.each(sockets, function(socket) {
			socket.get('account', function(err, account) {
				if(err) {
					return err;
				}
				if(!account) {
					return 'no session';
				}

				if(sessionData._id === account._id) {
					_.extend(account, sessionData);
					if(sessionData.bannedUntil > new Date()) {
						socket.emit('banned', 'Your account has been banned.');
						_.delay(2000, function() {
							socket.disconnect();
						});
					}
				}
				return null;
			});
		});
	});
};