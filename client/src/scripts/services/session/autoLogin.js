angular.module('futurism')
	.factory('autoLogin', ['$location', '$rootScope', 'authService', 'session', function($location, $rootScope, authService, session) {
		'use strict';

		var _removeListener;

		var _loginRequiredHandler = function() {
			session.create(function(error, result) {
				console.log('session results', error, result);
				if(error) {
					return $location.path('/error');
				}
				return authService.loginConfirmed(null);
			});
		};

		var activate = function() {
			if(!_removeListener) {
				_removeListener = $rootScope.$on('event:auth-loginRequired', _loginRequiredHandler);
			}
		};

		var deactivate = function() {
			if(_removeListener) {
				_removeListener();
				_removeListener = null;
			}
		};

		return {
			activate: activate,
			deactivate: deactivate
		};

	}]);