angular.module('futurism')
	.factory('autoLogin', function($location, $rootScope, authService, session) {
		'use strict';

		var self = this;
		var removeListener;

		self.activate = function() {
			if(!removeListener) {
				removeListener = $rootScope.$on('event:auth-loginRequired', loginRequiredHandler);
			}
		};

		self.deactivate = function() {
			if(removeListener) {
				removeListener();
				removeListener = null;
			}
		};

		var loginRequiredHandler = function() {
			session.renew(function(error) {
				if(error) {
					return $location.path('/error');
				}
				return authService.loginConfirmed(null);
			});
		};

		return self;
	});