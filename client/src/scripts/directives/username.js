angular.module('futurism')
	.directive('username', function() {
		'use strict';

		return {
			restrict: 'A',
			replace: true,
			scope: {
				name: '@',
				id: '@',
				site: '@',
				group: '@'
			},
			templateUrl: 'views/name.html'
		};

	});