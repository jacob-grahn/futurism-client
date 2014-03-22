angular.module('futurism')
	.directive('reportDisplay', function(modals) {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/report-display.html',
			scope: {
				report: '='
			},

			link: function(scope) {

				scope.openUser = function(userId) {
					modals.openUser(userId);
				};
			}
		};

	});