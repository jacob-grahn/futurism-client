angular.module('futurism')
	.controller('UserModalCtrl', function($scope, userId, UserResource) {
		'use strict';

		$scope.user = UserResource.get({userId: userId});
	});