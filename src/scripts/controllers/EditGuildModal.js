angular.module('futurism')
    .controller('EditGuildModalCtrl', function ($scope, $, $rootScope, $location, guildId, GuildResource, lang, dataUrlToBlob) {
        'use strict';

        $scope.joinOptions = ['invite', 'ask', 'open'];
        $scope.lang = lang;
        $scope.guild = GuildResource.get({
            guildId: guildId
        });

        $scope.submitChanges = function (uppedBanner) {
            
            // attach the image if a new one was uploaded
            if (uppedBanner) {
                $scope.guild.bannerImg = dataUrlToBlob(uppedBanner.resized.dataURL);
            }
            
            // save
            var updatedGuild = GuildResource.save($scope.guild, function () {
                
                // refresh page on success
                $location.url('/guilds/' + $scope.guild._id + '?' + new Date());
                $scope.$dismiss('updated');
            });
            
            //
            return updatedGuild.$promise;
        };

    });