angular.module('futurism')
    .controller('GuildJoinerCtrl', function($scope, $location, $rootScope, GuildResource, MemberResource, LobbyResource, dataUrlToBlob, me) {
        'use strict';

        $scope.joinOptions = ['invite', 'ask', 'open'];

        $scope.GuildResource = GuildResource;
        $scope.guilds = {};
        $scope.query = {
            find: {join: 'open'},
            sort: {gpToday: -1}
        };

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
                $rootScope.$broadcast('event:accountChanged');
                $location.url('/guilds/'+guildData._id);
            });

            return guild.$promise;
        };


        $scope.joinGuild = function(guild) {
            var data = {guildId: guild._id, userId: me.user._id};
            var member = MemberResource.put(data, function(result) {
                if(!result.error) {
                    $rootScope.$broadcast('event:accountChanged');
                    $location.url('/guilds/'+guild._id);
                }
            });

            return member.$promise;
        };
    });