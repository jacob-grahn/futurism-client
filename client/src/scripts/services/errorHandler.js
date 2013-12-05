angular.module('futurism')
	.factory('errorHandler', function($location) {
		'use strict';

		var message = '';

		var handleError = function(str) {
			console.log('errorHandler', str);
			message = str;
			$location.url('/error');
		};

		var callback = function(err) {
			if(err) {
				handleError(err);
			}
		};

		var getLastError = function() {
			return message;
		};

		return {
			getLastError: getLastError,
			handleError: handleError,
			callback: callback
		};
	});