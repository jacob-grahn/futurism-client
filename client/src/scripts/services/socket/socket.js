angular.module('futurism')
	.factory('socket', function(_, io, errorHandler, $rootScope, socketAuthenticator, socketErrors) {
		'use strict';

		var socket;
		var listeners = [];
		var uri;


		var applyListener = function(socket, obj) {

			var event = obj.event;
			var listener = obj.listener;

			var wrappedListener = function(data) {
				$rootScope.$apply(function() {
					console.log('rec ' + event + ': ' + JSON.stringify(data));
					try {
						listener(data);
					}
					catch(err) {
						errorHandler.fatal(err);
					}
				});
			};

			obj.wrappedListener = wrappedListener;
			socket.on(event, wrappedListener);
		};


		var applyListeners = function(socket) {
			_.each(listeners, function(obj) {
				applyListener(socket, obj);
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
				var obj = {event: event, listener: listener};
				listeners.push(obj);
				if(socket) {
					applyListener(socket, obj);
				}
			},

			$off: function(event, listener) {
				listeners = _.filter(listeners, function(obj) {
					if(obj.event === event && obj.listener === listener) {
						socket.removeListener(event, obj.wrappedListener);
						return false;
					}
					return true;
				});
			}
		};

		return face;

	});