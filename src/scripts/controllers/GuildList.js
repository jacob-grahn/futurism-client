angular.module('futurism')
    .controller('GuildListCtrl', function($scope, $location, $rootScope, GuildResource, modals, me, _, MemberResource) {
        'use strict';
        
        $scope.me = me;
        
        $scope.GuildResource = GuildResource;
        $scope.query = {
            count: 20
        };
        
        
        $scope.selectGuild = function(guildId) {
            $location.url('guilds/' + guildId);
        };


        $scope.leaveGuild = function () {
            MemberResource.delete({
                guildId: me.user.guild,
                userId: me.user._id
            }, function () {
                $rootScope.$broadcast('event:accountChanged');
            });
        };
        
        
        $scope.makeNewGuild = function() {
            modals.openGuildCreate(null);
        };
    });