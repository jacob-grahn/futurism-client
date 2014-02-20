'use strict';

var _ = require('lodash');
var broadcast = require('./broadcast');
var sanitize = require('validator').sanitize;
var gamehub = require('../fns/globe');




var Chat = function(roomName) {

	/**
	 * private
	 */

	/**
	 * public
	 */
	var chat = {

		msgs: [],
		maxHistory: 20,


		/**
		 * add new message
		 * @param user
		 * @param txt
		 */
		add: function(user, txt) {
			txt = txt.substr(0, 100);
			txt = sanitize(txt).xss();
			var msg = {user: _.pick(user, 'name', '_id', 'site', 'group'), txt: txt, roomName: roomName};
			chat.msgs.push(msg);
			chat.prune(chat.maxHistory);
			broadcast(roomName, 'chat', msg);
		},


		/**
		 * send a chat report to globe
		 * @param {Object} user
		 * @param {String} note
		 * @param {Function} callback
		 */
		report: function(user, note, callback) {
			gamehub.saveReport(user._id, {
				app: 'futurism',
				note: note,
				publicData: {
					chat: chat.msgs
				}
			}, callback);
		},


		/**
		 * remove oldest messages
		 * @param max
		 */
		prune: function(max) {
			while(chat.msgs.length > max) {
				chat.msgs.shift();
			}
		},


		/**
		 * reset to pristine state
		 */
		clear: function() {
			chat.msgs = [];
		}
	};

	Chat.rooms[roomName] = chat;
	return chat;
};


/**
 * Static
 */
Chat.rooms = {};


Chat.getRoom = function(roomName) {
	return Chat.rooms[roomName];
};


Chat.clear = function() {
	Chat.rooms = {};
};


module.exports = Chat;