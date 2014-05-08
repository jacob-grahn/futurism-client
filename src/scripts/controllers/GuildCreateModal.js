angular.module('futurism')
    .controller('GuildCreateModalCtrl', function ($scope, $, $rootScope, $location, guildId, GuildResource, LobbyResource, lang, dataUrlToBlob) {
        'use strict';
        
        $scope.guildId = guildId;
        $scope.joinOptions = ['invite', 'ask', 'open'];
        $scope.lang = lang;
        
        if(guildId) {
            $scope.guild = GuildResource.get({
                guildId: guildId
            });
        }
        else {
            $scope.guild = {
                join: 'open'
            };
        }
       

        $scope.save = function (uppedBanner) {
            
            var updatedGuild;
            
            // attach the image if a new one was uploaded
            if (uppedBanner) {
                $scope.guild.bannerImg = dataUrlToBlob(uppedBanner.resized.dataURL);
            }
            
            // save
            if(guildId) {
                updatedGuild = GuildResource.save($scope.guild, function () {
                    $location.url('/guilds/' + $scope.guild._id + '?' + new Date());
                    $scope.$dismiss();
                });
            }
            else {
                updatedGuild = GuildResource.put($scope.guild, function() {
                    LobbyResource.save();
                    $rootScope.$broadcast('event:accountChanged');
                    $scope.$dismiss();
                });
            }
            
            
            //
            return updatedGuild.$promise;
        };
    });