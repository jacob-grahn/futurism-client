angular.module('futurism')
	.controller('GuildJoinerCtrl', function($scope, $location, GuildResource, MemberResource, LobbyResource, dataUrlToBlob, staticContentUrl, me) {
		'use strict';

		$scope.static = staticContentUrl;
		$scope.joinOptions = ['invite', 'ask', 'open'];

		$scope.guilds = {};
		$scope.find = {join: 'open'};
		$scope.sort = {gpToday: -1};
		$scope.GuildResource = GuildResource;

		$scope.newGuild = {
			_id: '',
			desc: '',
			join: 'open',
			banner: null
		};


		$scope.createGuild = function(guildData) {
			if($scope.uppedBanner) {
				guildData.bannerImg = dataUrlToBlob($scope.uppedBanner.resized.dataURL);
			}

			var guild = GuildResource.put(guildData, function() {
				LobbyResource.save();
				$location.url('/guilds/'+guildData._id);
			});

			return guild.$promise;
		};


		$scope.joinGuild = function(guild) {
			var data = {guildId: guild._id, userId: me.user._id};
			var member = MemberResource.put(data, function(result) {
				if(!result.error) {
					$location.url('/guilds/'+guild._id);
				}
			});

			return member.$promise;
		}
	});