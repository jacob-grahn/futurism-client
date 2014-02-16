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


		var face = {

			connect: function(newUri) {
				console.log(uri, newUri, socket);
				if(uri !== newUri || !socket) {
					uri = newUri;
					face.disconnect();

					socket = io.connect(uri);
					if(socket.authEmit) {
						socket.socket.connect();
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
					socket.disconnect();
					socket = null;
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