(function() {
	'use strict';

	var _ = require('lodash');
	var broadcast = require('./broadcast');
	var sanitize = require('validator').sanitize;


	/**
	 *
	 * @param {string} roomName
	 * @returns {{add: Function, getHistory: Function, roomName: *, drainRecentMsgs: Function, clear: Function}}
	 * @constructor
	 */
	var Chat = function(roomName) {
		var msgs = [];
		var recentMsgs = [];

		/**
		 *
		 * @param user
		 * @param txt
		 */
		var add = function(user, txt) {
			txt = txt.substr(0, 100);
			txt = sanitize(txt).xss();
			var msg = {user: _.pick(user, 'name', '_id', 'site', 'group'), txt: txt, roomName: roomName};
			msgs.push(msg);
			recentMsgs.push(msg);
			prune(20);
			broadcast(roomName, 'chat', msg);
		};

		/**
		 *
		 * @returns {*}
		 */
		var drainRecentMsgs = function() {
			var ret = _.clone(recentMsgs);
			recentMsgs = [];
			return ret;
		};

		/**
		 *
		 * @returns {Array}
		 */
		var getHistory = function() {
			return msgs;
		};

		/**
		 *
		 * @param max
		 */
		var prune = function(max) {
			while(msgs.length > max) {
				msgs.shift();
			}
		};

		/**
		 *
		 */
		var clear = function() {
			msgs = [];
			recentMsgs = [];
		};



		var ret = {
			add: add,
			getHistory: getHistory,
			roomName: roomName,
			drainRecentMsgs: drainRecentMsgs,
			clear: clear
		};

		Chat.rooms[roomName] = ret;
		return ret;
	};


	Chat.rooms = {};


	Chat.getChat = function(roomName) {
		return Chat.rooms[roomName];
	};


	Chat.getRecent = function() {
		var recent = _.map(Chat.rooms, function(room) {
			return {roomName: room.roomName, msgs: room.drainRecentMsgs()};
		});
		return recent;
	};


	Chat.initSocket = function(socket) {

		socket.on('chat', function(data) {
			socket.isSilenced(function(err, silenced, account) {
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
	};


	Chat.safeAdd = function(user, txt, roomName) {
		var room = Chat.getChat(roomName);
		if(room) {
			room.add(user, txt);
		}
	};


	Chat.safeGetHistory = function(roomName) {
		var room = Chat.getChat(roomName);
		if(room) {
			return room.getHistory();
		}
		else {
			return [];
		}
	};


	Chat.safeCreate = function(roomName) {
		var room = Chat.getChat(roomName);
		if(!room) {
			new Chat(roomName);
		}
	};


	Chat.clear = function() {
		Chat.rooms = {};
	};


	module.exports = Chat;

}());