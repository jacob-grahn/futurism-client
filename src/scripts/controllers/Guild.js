angular.module('futurism')
    .controller('GuildCtrl', function ($scope, $routeParams, $location, $rootScope, GuildResource, MemberResource, ApplicantResource, me, modals, _) {
        'use strict';

        $scope.guildId = $routeParams.guildId;
        $scope.guild = GuildResource.get({guildId: $scope.guildId});
        $scope.me = me;


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
                guildId: $scope.guildId,
                userId: me.user._id
            }, function () {
                $rootScope.$broadcast('event:accountChanged');
            });
            $location.url('/guild-list');
        };
        
        
        $scope.join = function(guildId) {
            var data = {guildId: guildId, userId: me.user._id};
            var member = MemberResource.put(data, function(result) {
                if(!result.error) {
                    $rootScope.$broadcast('event:accountChanged');
                    $location.url('/guilds/' + guildId + '?newmember');
                }
            });
            return member.$promise;
        };
        
        
        $scope.askToJoin = function(guildId) {
            var result = ApplicantResource.put({guildId: guildId, userId: me.userId});
            return result.$promise;
        };
        
        
        $scope.edit = function(guildId) {
            modals.openGuildCreate(guildId);
        };


    });