angular.module('futurism')
	.controller('navBarCtrl', function($scope, account) {
		'use strict';

		$scope.path = '';
		$scope.account = account;

		$scope.$on('$routeChangeSuccess', function(event, current) {
			if(current.$$route) {
				$scope.path = current.$$route.originalPath;
			}
			else {
				$scope.path = '/';
			}
		});
	});