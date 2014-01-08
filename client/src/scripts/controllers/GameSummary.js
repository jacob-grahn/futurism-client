angular.module('futurism')
	.controller('GameSummaryCtrl', function($scope, $routeParams, SummaryResource, account) {
		'use strict';

		$scope.gameId = $routeParams.gameId;
		$scope.account = account;
		$scope.summ = SummaryResource.get({gameId: $scope.gameId});
	});