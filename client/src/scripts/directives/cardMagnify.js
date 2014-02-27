angular.module('futurism')
	.directive('cardMagnify', function() {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/card-magnify.html',

			scope: {
				size: '@',
				magnify: '@',
				useButtons: '@',
				card: '=',
				actionFn: '&'
			},

			link: function (scope, elem) {
				scope.hovering = false;

				elem.click(function() {
					scope.$apply(function() {
						scope.hovering = !scope.hovering;
					});
				});

				elem.mouseleave(function() {
					scope.$apply(function() {
						scope.hovering = false;
					});
				});

				/*elem.hover(
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
				);*/

			}
		};

	});