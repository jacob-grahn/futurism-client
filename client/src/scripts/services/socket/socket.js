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


		return {

			connect: function(_uri_) {
				if(uri !== _uri_) {
					uri = _uri_;
				}
				if(socket) {
					socket.disconnect();
				}
				socket = io.connect(uri);
				socketAuthenticator(socket);
				socketErrors(socket);
				applyListeners();
			},

			disconnect: function() {
				if(socket) {
					socket.disconnect();
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

	});