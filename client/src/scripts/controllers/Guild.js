angular.module('futurism')
	.controller('GuildCtrl', function($scope, $routeParams, $location, GuildResource, MemberResource, me) {
		'use strict';

		$scope.guildId = $routeParams.guildId;
		$scope.guild = GuildResource.get({guildId: $routeParams.guildId});


		$scope.leaveGuild = function() {
			MemberResource.delete({guildId: $routeParams.guildId, userId: me.user._id});
			$location.url('/guild-joiner');
		};


	});