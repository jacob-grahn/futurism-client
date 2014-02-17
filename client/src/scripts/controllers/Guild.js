angular.module('futurism')
	.controller('GuildCtrl', function($scope, $routeParams, GuildResource) {
		'use strict';

		$scope.guildId = $routeParams.guildId;
		$scope.guild = GuildResource.get({guildId: $routeParams.guildId});
	});