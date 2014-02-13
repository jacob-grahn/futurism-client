angular.module('futurism')
	.controller('GuildJoinerCtrl', function($scope, GuildResource, MemberResource, dataUrlToBlob, staticContentUrl, me) {
		'use strict';

		$scope.static = staticContentUrl;
		$scope.joinOptions = ['invite', 'ask', 'open'];
		$scope.guilds = {};

		$scope.newGuild = {
			_id: '',
			desc: '',
			join: 'open',
			banner: null
		};


		$scope.refreshGuilds = function(page) {
			$scope.guilds = GuildResource.query({find: {join: 'open'}, sort: {'gpToday': 1}, page: page});
		};
		$scope.refreshGuilds(1);


		$scope.createGuild = function(guildData) {
			if($scope.uppedBanner) {
				guildData.bannerImg = dataUrlToBlob($scope.uppedBanner.resized.dataURL);
			}

			var guild = GuildResource.put(guildData);

			return guild.$promise;
		};


		$scope.joinGuild = function(guild) {
			var data = {guildId: guild._id, userId: me.user._id};
			var member = MemberResource.put(data, function(result) {
				console.log('join result', result);
			});

			return member.$promise;
		}
	});