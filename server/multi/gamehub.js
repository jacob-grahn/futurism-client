(function() {
	'use strict';

	var chat = require('./chat.js');
	var _ = require('lodash');
	var request = require('request');
	var fns = require('../fns/fns');
	var User = require('../models/user');

	var chatInterval, banInterval, io;


	module.exports = {

		/**
		 * Start polling updates to gamehub
		 * @param socketIo
		 */
		start: function(socketIo) {
			io = socketIo;
			module.exports.stop();
			chatInterval = setInterval(recordChats, 5000);
			banInterval = setInterval(getRecentBans, 2500);
		},


		/**
		 * stop updating with gamehub
		 */
		stop: function() {
			clearInterval(chatInterval);
			clearInterval(banInterval);
		}
	};


	/**
	 * Send all recent chat messages off to be recorded at GameHub
	 * @returns {boolean}
	 */
	var recordChats = function() {
		var recent = chat.getRecent();
		var msgs = [];
		_.each(recent, function(room) {
			_.each(room.msgs, function(msg) {
				msgs.push({
					user_id: msg.user._id,
					text: msg.txt,
					ip: 'someip',
					room: room.roomName,
					private: false
				});
			});
		});

		if(msgs.length === 0) {
			return false;
		}

		var params = {pass: process.env.GAMEHUB_KEY, game: 'futurism', client: 'futurism', chats: JSON.stringify(msgs)};

		request.post({url: 'http://gamehub.jiggmin.com/save-chats.php', form: params}, function(err, response, body) {});
	};


	/**
	 * Get a list of recent bans and silences
	 */
	var getRecentBans = function() {
		var params = {pass: process.env.GAMEHUB_KEY, game: 'futurism', procedure: 'get_recent_bans', params: JSON.stringify([])};
		request.post({url: 'http://gamehub.jiggmin.com/call.php', form: params}, function(err, response, body) {
			if(err) {
				return err;
			}

			var result = JSON.parse(body);
			if(!result.success) {
				return result.error;
			}

			disconnectBanned(result.rows);
			saveBanned(result.rows);
		});
	};


	/**
	 * Disconnect sockets that match the user id or ip address of a ban
	 * @param {[{banned_user_id, banned_ip, expire_datetime}]} bans A list of recent bans from GameHub
	 */
	var disconnectBanned = function(bans) {

		var sockets = io.sockets.clients();

		_.each(bans, function(ban) {
			_.each(sockets, function(socket) {
				socket.get('account', function(err, account) {
					if(err) {
						return err;
					}
					if(!account) {
						return 'no session';
					}
					if(ban.banned_user_id === account._id || ban.banned_ip === account.ip) {
						if(ban.type === 'silence') {
							account.silencedUntil = ban.expire_datetime;
						}
						else {
							socket.emit('banned', 'Your account or ip address has been banned.');
							socket.disconnect();
						}
					}
				});
			});
		});
	};


	/**
	 * Save bans to mongo
	 * @param {[{banned_user_id, expire_datetime}]} bans A list of recent bans from GameHub
	 */
	var saveBanned = function(bans) {
		_.each(bans, function(ban) {
			if(ban.type === 'silence') {
				User.findByIdAndSave({_id: ban.banned_user_id, silencedUntil: ban.expire_datetime});
			}
			if(ban.type !== 'silence') {
				User.findByIdAndSave({_id: ban.banned_user_id, bannedUntil: ban.expire_datetime});
			}
		});
	};


}());