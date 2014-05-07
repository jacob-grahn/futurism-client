angular.module('futurism')
    .controller('InvitesModalCtrl', function($scope, $location, UserInviteResource, InviteResource, lang, me, $rootScope) {
        'use strict';
        $scope.lang = lang;
        $scope.invites = [];
        
        
        UserInviteResource.get({userId: me.userId}, function(invites) {
            $scope.invites = invites.invites;
        });
        
        
        $scope.gotoGuild = function(guildId) {
            $location.url('guilds/' + guildId);
            $scope.$dismiss();
        };
        
        
        $scope.join = function(guildId) {
            InviteResource.post({action: 'accept', guildId: guildId, userId: me.userId}, function() {
                $rootScope.$broadcast('event:accountChanged');
            });
            $scope.$dismiss();
        };
        
        
        $scope.delete = function(guildId) {
            InviteResource.delete({guildId: guildId, userId: me.userId});
            $scope.$dismiss();
        };
    });