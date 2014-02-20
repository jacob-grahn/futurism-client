angular.module('futurism')
	.factory('Chat', function(socket) {
		'use strict';




		/**
		 * Send and receive messages from a chat room
		 * @param roomName
		 * @returns {object} chat
		 * @constructor
		 */
		var Chat = function(roomName) {


			/**
			 * Listen for incoming chat messages
			 */
			var onChat = function(msg) {
				console.log('on chat', msg);
				if(msg.roomName === roomName) {
					chat.add(msg);
				}
			};


			/**
			 * Listen for incoming chatHistory
			 */
			var onChatHistory = function(data) {
				if(data.roomName === roomName) {
					for(var i=0; i<data.history.length; i++) {
						var msg = data.history[i];
						chat.add(msg);
					}
				}
			};


			/**
			 * public
			 */
			var chat = {
				msgs: [],
				maxMsgs: 35,
				receivedCount: 0,


				/**
				 * Start listening to this chat room
				 */
				subscribe: function() {
					socket.emit('subscribe', roomName);
					socket.emit('chatHistory', {roomName: roomName});
					socket.$on('chat', onChat);
					socket.$on('chatHistory', onChatHistory);
				},


				/**
				 * Stop listening to this chat room
				 */
				unsubscribe: function() {
					socket.emit('unsubscribe', roomName);
					socket.$off('chat', onChat);
					socket.$off('chatHistory', onChatHistory);
					chat.clear();
				},


				/**
				 * Send a text message off to the chat server
				 * @param {string} txt
				 */
				send: function(txt) {
					if(txt.indexOf('/report') === 0) {
						socket.emit('reportChat', {roomName: roomName, note: txt.substr(8)});
					}
					else {
						socket.emit('chat', {roomName: roomName, txt: txt});
					}
				},


				/**
				 * Add a chat to the msgs array
				 * @param {object} msg
				 */
				add: function(msg) {
					chat.receivedCount++;
					chat.msgs.push(msg);
					chat.prune(chat.msgs, chat.maxMsgs);
				},


				/**
				 * Remove old chat messages
				 */
				prune: function(msgs, max) {
					while(msgs.length > max) {
						msgs.shift();
					}
				},


				/**
				 * Empty all chat messages
				 */
				clear: function() {
					chat.msgs.splice(0, chat.msgs.length);
				}

			};

			return chat;
		};

		return Chat;

	});