angular.module('futurism')
	.factory('Chat', function(socket, $rootScope) {
		'use strict';

		/**
		 * Send and receive messages from a chat room
		 * @param roomName
		 * @returns {object} chat
		 * @constructor
		 */
		var Chat = function(roomName) {
			var msgs = [];
			var maxMsgs = 25;


			/**
			 * Start listening to this chat room
			 */
			var subscribe = function() {
				socket.authEmit('subscribe', roomName);
				socket.authEmit('chatHistory', roomName);
			};


			/**
			 * Stop listening to this chat room
			 */
			var unsubscribe = function() {
				socket.authEmit('unsubscribe', roomName);
				clear();
			};


			/**
			 * Send a text message off to the chat server
			 * @param {string} txt
			 */
			var send = function(txt) {
				socket.authEmit('chat', {roomName: roomName, txt: txt});
			};


			/**
			 * Add a chat to the msgs array
			 * @param {object} chat
			 */
			var add = function(chat) {
				msgs.push(chat);
				prune(maxMsgs);
			};


			/**
			 * Remove old chat messages
			 * @param {number} max
			 */
			var prune = function(max) {
				while(msgs.length > max) {
					msgs.shift();
				}
			};


			/**
			 * Empty all chat messages
			 */
			var clear = function() {
				msgs.splice(0, msgs.length);
			};


			/**
			 * Listen for incoming chat messages
			 */
			socket.on('chat', function(msg) {
				if(msg.roomName === roomName) {
					$rootScope.$apply(function() {
						add(msg);
					});
				}
			});


			/**
			 * Listen for incoming chatHistory
			 */
			socket.on('chatHistory', function(data) {
				if(data.roomName === roomName) {
					$rootScope.$apply(function() {
						for(var i=0; i<data.history.length; i++) {
							var chat = data.history[i];
							add(chat);
						}
					});
				}
			});


			return {
				subscribe: subscribe,
				unsubscribe: unsubscribe,
				msgs: msgs,
				send: send
			};
		};

		return Chat;

	});