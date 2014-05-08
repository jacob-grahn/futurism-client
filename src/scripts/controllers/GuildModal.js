angular.module('futurism')
    .controller('GuildModalCtrl', function($scope, lang, guildId, GuildResource, me) {
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
    });