'use strict';

var _ = require('lodash');
var redisSession = require('../fns/redisSession');
var redisClient = require('../fns/redisConnect')();

var io;


redisClient.on('message', function(channel, data) {
	if(channel === 'sessionUpdate') {
		updateUser(data);
	}
	if(channel === 'ipBan') {
		//disconnectIp(data); have to figure out how to determine client ip address first
	}
});


var updateUser = function(userId) {

	redisSession._get(userId, function(err, sessionData) {
		if(err) {
			sessionData = null;
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

				if(userId === account._id) {

					if(sessionData) {
						_.extend(account, sessionData);
					}

					if(!sessionData || sessionData.bannedUntil > new Date()) {
						socket.emit('banned', 'Your account has been banned.');
						_.delay(function() {
							socket.disconnect();
						}, 2000);
					}
				}
				return null;
			});
		});
	});
};



var self = {

	startListening: function(_io_) {
		io = _io_;
		redisClient.subscribe('sessionUpdate');
		redisClient.subscribe('ipBan');
	},

	stopListening: function() {
		redisClient.unsubscribe('sessionUpdate');
		redisClient.unsubscribe('ipBan');
	}
};

module.exports = self;