angular.module('futurism')
	.factory('errorHandler', function($location, messager) {
		'use strict';

		var message = '';

		var fatal = function(err) {
			err.stack = err.stack;
			message = err;
			$location.url('/error');
		};

		var show = function(str) {
			messager.addMessage({txt: str, type: 'error'});
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
			fatal: fatal,
			callback: callback,
			reset: reset,
			show: show
		};
	});