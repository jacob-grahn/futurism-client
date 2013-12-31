angular.module('futurism')
	.controller('FuturesCtrl', function($scope, shared) {
		'use strict';
		$scope.futures = shared.futures;
	});