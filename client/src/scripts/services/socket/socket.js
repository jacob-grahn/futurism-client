angular.module('futurism')
	.factory('socket', function(_, io, errorHandler, $rootScope, socketAuthenticator, socketErrors) {
		'use strict';

		var socket;
		var listeners = [];
		var uri;


		var applyListener = function(socket, event, listener) {
			socket.on(event, function(data) {
				$rootScope.$apply(function() {
					console.log('rec ' + event + ': ' + JSON.stringify(data));
					try {
						listener(data);
					}
					catch(err) {
						errorHandler.handle(err);
					}
				});
			});
		};


		var applyListeners = function(socket) {
			_.each(listeners, function(obj) {
				applyListener(socket, obj.event, obj.listener);
			});
		};


		var removeListeners = function(socket) {
			_.each(listeners, function(obj) {
				socket.removeAllListeners(obj.event);
			});
		};


		var face = {

			connect: function(newUri) {
				if(uri !== newUri) {
					face.disconnect();

					uri = newUri;
					socket = io.connect(uri);
					if(socket.authEmit) {
						//socket.socket.connect();
					}
					else {
						socketAuthenticator(socket);
						socketErrors(socket);
						applyListeners(socket);
					}
				}
			},

			disconnect: function() {
				if(socket) {
					removeListeners(socket);
					//socket.disconnect();
					socket = null;
					uri = null;
				}
			},

			emit: function(event, data) {
				if(socket) {
					socket.authEmit(event, data);
				}
			},

			$on: function(event, listener) {
				listeners.push({event: event, listener: listener});
				if(socket) {
					applyListener(socket, event, listener);
				}
			}
		};

		return face;

	});