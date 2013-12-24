angular.module('futurism')
	.factory('errorHandler', function($location, messager) {
		'use strict';

		var message = '';

		var handle = function(str) {
			message = str;
			$location.url('/error');
		};

		var show = function(str) {
			messager.addMessage(str, 'error');
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
			reset: reset,
			show: show
		};
	});