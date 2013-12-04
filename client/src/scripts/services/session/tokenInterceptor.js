(function() {
	'use strict';

	angular.module('futurism')

		.factory('tokenInterceptor', function(account) {
			return {
				request: function(config) {
					config.headers['Session-Token'] = account.token;
					return config;
				}
			};
		})

		.config(function($httpProvider) {
			$httpProvider.interceptors.push('tokenInterceptor');
		});

}());