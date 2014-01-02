angular.module('futurism')
	.directive('cardMagnify', function($timeout) {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/card-magnify.html',

			scope: {
				size: '@',
				magnify: '@',
				card: '=',
				actionFn: '&'
			},

			link: function (scope, elem) {
				scope.size = scope.size || 'small';
				scope.magnify = scope.magnify || 'medium';
				scope.hovering = false;

				//$timeout(function() {
					//var base = elem.find('.card-base .card');
					elem.hover(
						function() {
							scope.$apply(function() {
								scope.hovering = true;
							});
						},
						function() {
							scope.$apply(function() {
								scope.hovering = false;
							});
						}
					);
				//}, 1000);

			}
		};

	});