angular.module('futurism')
	.directive('cardDisplay', function(staticContentUrl, lang) {
		'use strict';

		return {
			restrict: 'E',
			replace: false,
			templateUrl: 'views/card-display.html',

			scope: {
				card: '=',
				size: '@',
				abilityFn: '&'
			},

			link: function (scope, elem, params) {
				scope.lang = lang;
				scope.size = scope.size || 'large';
				scope.staticContentUrl = staticContentUrl;
			}
		};

	});