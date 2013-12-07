angular.module('futurism')
	.controller('ErrorCtrl', function($scope, errorHandler) {
		'use strict';
		$scope.errorMessage = errorHandler.getLastError();
	});