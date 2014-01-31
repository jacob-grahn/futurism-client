angular.module('futurism')
	.controller('TitleCtrl', function($scope, $location, session, account) {
		'use strict';

		$scope.login = function() {
			if(!account.loggedIn) {
				session.makeNew();
			}
			$location.url('/lobby');
		};
	});