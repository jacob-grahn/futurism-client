angular.module('futurism')
    .controller('GuildModalCtrl', function($scope, lang, guildId, GuildResource, me, _, modals) {
        'use strict';
        
        $scope.lang = lang;
        $scope.guild = GuildResource.get({guildId: guildId});
        $scope.me = me;
        
        $scope.join = function(guildId) {
            $scope.$dismiss();
        };
        
        $scope.askToJoin = function(guildId) {
            $scope.$dismiss();
        };
        
        $scope.iAmOwner = function (guild) {
            var isOwner = false;
            _.each(guild.owners, function (owner) {
                if (owner._id === me.userId) {
                    isOwner = true;
                }
            });
            return isOwner;
        };
        
        $scope.edit = function(guildId) {
            modals.openGuildCreate(guildId);
            $scope.$dismiss();
        };
    });