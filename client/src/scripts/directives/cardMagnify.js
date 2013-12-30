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
				card: '='
			},

			link: function (scope, elem, attrs) {
				scope.size = scope.size || 'small';
				scope.magnify = scope.magnify || 'medium';
				scope.hovering = false;

				$timeout(function() {
					var base = elem.find('.card-base .card');
					base.hover(
						function() {
							console.log('mouse over');
							scope.$apply(function() {
								scope.hovering = true;
							});
						},
						function() {
							console.log('mouse away');
							scope.$apply(function() {
								scope.hovering = false;
							});
						}
					);
				}, 1000);

			}
		};

	});