angular.module('futurism')
    .controller('GuildListCtrl', function($scope, GuildResource, modals) {
        'use strict';
        
        $scope.GuildResource = GuildResource;
        $scope.query = {
            sort: {gpWeek: -1}
        };
        
        $scope.selectGuild = function(guildId) {
            modals.openGuild(guildId);
        };
    });