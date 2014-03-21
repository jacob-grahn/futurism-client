angular.module('futurism')
	.directive('reportDisplay', function() {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/report-display.html',
			scope: {
				report: '='
			}
		};

	});