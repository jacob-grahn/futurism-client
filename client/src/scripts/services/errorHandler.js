angular.module('futurism')
	.factory('errorHandler', function($location) {
		'use strict';

		var message = '';

		var handle = function(str) {
			message = str;
			$location.url('/error');
		};

		var callback = function(err) {
			if(err) {
				handle(err);
			}
		};

		var getLastError = function() {
			return message;
		};

		var reset = function() {
			message = null;
		};

		return {
			getLastError: getLastError,
			handle: handle,
			callback: callback,
			reset: reset
		};
	});