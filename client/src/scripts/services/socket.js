angular.module('futurism')
	.factory('socket', function(session, _, io, errorHandler, $rootScope) {
		'use strict';

		var socket = io.connect();
		var buffer = [];
		var ready = false;
		var reAuthDelay = 3000;

		socket.$on = function(event, listener) {
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

		socket.on('disconnect',function() {
			ready = false;
		});

		socket.on('connect', function() {
			ready = false;
		});

		socket.on('auth', function () {
			sendAuth();
		});

		socket.on('authFail', function(data) {
			_.delay(sendAuth, reAuthDelay);
			reAuthDelay += 1000;
		});

		socket.on('ready', function() {
			ready = true;
			flushBuffer();
		});

		socket.$on('error', function(message) {
			errorHandler.show(message);
		});

		socket.authEmit = function(eventName, data) {
			if(ready) {
				console.log('emit', eventName, data);
				socket.emit(eventName, data);
			}
			else {
				console.log('buffer', eventName, data);
				buffer.push({eventName:eventName, data:data});
			}
		};

		var flushBuffer = function() {
			for(var i=0; i<buffer.length; i++) {
				var event = buffer[i];
				console.log('emit', event.eventName, event.data);
				socket.emit(event.eventName, event.data);
			}
			buffer = [];
		};

		var sendAuth = function() {
			socket.emit('auth', {token: session.getToken()});
		};


		return socket;

	});