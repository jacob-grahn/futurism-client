angular.module('futurism')
	.factory('socketErrors', function(errorHandler) {
		'use strict';

		var setup = function(socket) {

			socket.on('error', function(data) {
				errorHandler.show(data);
			});

			socket.on('banned', function(data) {
				errorHandler.fatal(data);
			});
		};
		
		return setup;
	});