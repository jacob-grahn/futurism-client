angular.module('futurism')
	.controller('UserModalCtrl', function($scope, userId, UserResource, StatsResource) {
		'use strict';

		$scope.user = UserResource.get({userId: userId});
		$scope.stats = StatsResource.get({userId: userId});
	});