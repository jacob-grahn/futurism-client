angular.module('futurism')
	.controller('ErrorCtrl', function($scope, errorHandler) {
		'use strict';
		$scope.error = errorHandler.getLastError();
	});