angular.module('futurism')
    .controller('GuildListCtrl', function($scope, GuildResource, modals, me, _, MemberResource, $rootScope) {
        'use strict';
        
        $scope.me = me;
        
        $scope.GuildResource = GuildResource;
        $scope.query = {
            sort: {gpWeek: -1}
        };
        
        $scope.selectGuild = function(guildId) {
            modals.openGuild(guildId);
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