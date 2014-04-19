angular.module('futurism')
    .controller('GuildCtrl', function($scope, $routeParams, $location, $rootScope, GuildResource, MemberResource, me) {
        'use strict';

        $scope.guildId = $routeParams.guildId;
        $scope.guild = GuildResource.get({guildId: $routeParams.guildId});


        $scope.leaveGuild = function() {
            MemberResource.delete({guildId: $routeParams.guildId, userId: me.user._id}, function() {
                $rootScope.$broadcast('event:accountChanged');
            });
            $location.url('/guild-joiner');
        };


    });