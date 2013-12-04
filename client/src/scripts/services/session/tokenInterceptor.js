angular.module('futurism')

	.factory('tokenInterceptor', ['account', function(account) {
		return {
			request: function(config) {
				config.headers['Session-Token'] = account.token;
				return config;
			}
		}
	}])

	.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('tokenInterceptor');
	}]);