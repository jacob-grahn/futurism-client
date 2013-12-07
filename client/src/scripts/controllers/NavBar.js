angular.module('futurism')
	.controller('navBarCtrl', function($scope, account, lang) {
		'use strict';

		$scope.path = '';
		$scope.account = account;
		$scope.lang = lang;

		$scope.$on('$routeChangeSuccess', function(event, current) {
			if(current.$$route) {
				$scope.path = current.$$route.originalPath;
			}
			else {
				$scope.path = '/';
			}
		});
	});