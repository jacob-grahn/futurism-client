angular.module('futurism')
    .controller('GuildModalCtrl', function($scope, $location, lang, guildId, GuildResource, MemberResource, $rootScope, me, _, modals) {
        'use strict';
        
        $scope.lang = lang;
        $scope.guild = GuildResource.get({guildId: guildId});
        $scope.me = me;
        
        
        $scope.join = function(guildId) {
            var data = {guildId: guildId, userId: me.user._id};
            var member = MemberResource.put(data, function(result) {
                if(!result.error) {
                    $rootScope.$broadcast('event:accountChanged');
                    $scope.$dismiss();
                    $location.url('/guilds/' + guildId);
                }
            });
            return member.$promise;
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