angular.module('futurism')
    .controller('GuildCtrl', function ($scope, $routeParams, $location, $rootScope, GuildResource, MemberResource, me, modals, _) {
        'use strict';

        $scope.guildId = $routeParams.guildId;
        $scope.guild = GuildResource.get({
            guildId: $routeParams.guildId
        });
        $scope.modals = modals;


        $scope.iAmOwner = function () {
            var isOwner = false;
            _.each($scope.guild.owners, function (owner) {
                if (owner._id === me.userId) {
                    isOwner = true;
                }
            });
            return isOwner;
        };


        $scope.leaveGuild = function () {
            MemberResource.delete({
                guildId: $routeParams.guildId,
                userId: me.user._id
            }, function () {
                $rootScope.$broadcast('event:accountChanged');
            });
            $location.url('/guild-joiner');
        };


    });