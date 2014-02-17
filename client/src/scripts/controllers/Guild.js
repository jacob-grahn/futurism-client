angular.module('futurism')
	.controller('GuildCtrl', function($scope, $routeParams) {
		'use strict';
		$scope.hi = 'hi';
		$scope.guildId = $routeParams.gameId;
	});