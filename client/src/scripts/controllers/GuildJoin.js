angular.module('futurism')
	.controller('GuildJoinCtrl', function($scope, GuildResource, dataUrlToBlob) {
		'use strict';

		$scope.joinOptions = ['invite', 'ask', 'open'];

		$scope.newGuild = {
			_id: '',
			desc: '',
			join: 'open',
			banner: null
		};

		$scope.page = 0;
		$scope.guilds = GuildResource.query({join: 'open', sort: 'gpToday', page: $scope.page});


		$scope.createGuild = function(guildData) {
			if($scope.uppedBanner) {
				guildData.banner = dataUrlToBlob($scope.uppedBanner.resized.dataURL);
			}

			var guild = GuildResource.put(guildData);

			return guild.$promise;
		};
	});