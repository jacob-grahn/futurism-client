angular.module('futurism')
	.controller('ErrorCtrl', ['$scope', function($scope) {
		'use strict';
		$scope.error = 'I am afraid there has been an error of some sort.';
	}]);