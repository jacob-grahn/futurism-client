angular.module('futurism')
	.directive('turnAnimationDisplay', function($, $timeout, turnAnimation) {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			template: '<div ng-if="turnAnimation.showing" id="turn-anim"><h1>{{turnAnimation.name}}\'s turn begins!</h1></div>',
			link: function(scope, element) {
				scope.turnAnimation = turnAnimation;
				scope.active = false;

				scope.$watch('turnAnimation.name', function() {
					scope.active = true;
				});
			}
		};
	});