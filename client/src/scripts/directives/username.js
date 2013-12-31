angular.module('futurism')
	.directive('username', function() {
		'use strict';

		return {
			restrict: 'AE',
			replace: true,
			scope: {
				name: '@',
				id: '@',
				site: '@',
				group: '@'
			},
			templateUrl: 'views/username.html'
		};

	});