angular.module('futurism')
	.directive('username', [function() {
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
			template: '' +
				'<a class="username username-{{group}}">' +
					'<img class="avatar" ng-if="id" ng-src="http://avatars.jiggmin.com/avatars/{{id}}.gif"/>' +
					'<img class="site-icon" ng-if="site" ng-src="/images/sites/{{site}}.png">' +
					'<span class="name">{{name}}</span>' +
				'</a>'
		};

	}]);