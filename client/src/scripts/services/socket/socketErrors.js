angular.module('futurism')
	.factory('socketErrors', function($location, me, session, errorHandler) {
		'use strict';

		var setup = function(socket) {

			socket.on('error', function(data) {
				errorHandler.show(data);
			});

			socket.on('banned', function(data) {
				$location.url('/users/'+me.user._id+'/bans');
				session.destroy();
			});
		};
		
		return setup;
	});