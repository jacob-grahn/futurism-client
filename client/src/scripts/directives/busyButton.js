angular.module('futurism')
	.directive('busyButton', function() {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			scope: {
				onClick: '&'
			},
			template: '<button class="btn btn-default" type="submit" ng-click="startClick()" ng-disabled="{{!!promise}}">{{label}}</button>',
			link: function(scope, element, attr) {
				scope.defaultLabel = attr.label || 'Save';
				scope.label = scope.defaultLabel;
				scope.startClick = function() {
					if(!scope.promise) {
						scope.label = 'working...';
						scope.promise = scope.onClick();
						scope.promise.then(
							function(result) {
								scope.label = scope.defaultLabel;
								delete scope.promise;
							},
							function(error) {
								scope.label = 'error';
								delete scope.promise;
							}
						);
					}
				};
			}
		};
	});