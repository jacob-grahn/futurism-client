angular.module('futurism')
	.controller('LoginCtrl', function($scope, $location, session, account) {
		'use strict';

		if(account.loggedIn) {
			$location.url('/lobby');
		}
		else {
			$scope.loggedIn = false;
		}

	});