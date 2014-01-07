angular.module('futurism')
	.controller('GameSummaryCtrl', function($scope, $routeParams) {
		'use strict';

		$scope.gameId = $routeParams.gameId;
	});