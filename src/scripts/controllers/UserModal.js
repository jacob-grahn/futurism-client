angular.module('futurism')
    .controller('UserModalCtrl', function($scope, userId, me, $location, UserResource, BanResource, ProgressResource, ApprenticeResource, ModeratorResource, GuildModResource, KickResource, InviteResource, modals, rankCalc) {
        'use strict';

        var includeBans = me.user.group === 'm' || me.user.group === 'a';

        $scope.rankCalc = rankCalc;
        $scope.user = UserResource.get({userId: userId, bans: includeBans});
        $scope.progress = ProgressResource.get({userId: userId});


        $scope.openGuild = function(guildId) {
            $location.url('guilds/' + guildId);
            $scope.$dismiss('openGuild');
        };


        /**
         * Open another modal to send user a message
         */
        $scope.message = function() {
            modals.openMessage(userId);
            $scope.$dismiss('message');
        };


        /**
         * go to a page showing the user's cards
         */
        $scope.cards = function() {
            $location.url('/card-selector/'+userId);
            $scope.$dismiss('cards');
        };


        /**
         * promote user to apprentice
         */
        $scope.apprentice = function() {
            ApprenticeResource.put({userId: userId});
            $scope.$dismiss('apprentice');
        };


        /**
         * demote an apprentice
         */
        $scope.deApprentice = function() {
            ApprenticeResource.delete({userId: userId});
            $scope.$dismiss('deApprentice');
        };


        /**
         * promote apprentice to moderator
         */
        $scope.mod = function() {
            ModeratorResource.put({userId: userId});
            $scope.$dismiss('mod');
        };


        /**
         * demote a moderator
         */
        $scope.deMod = function() {
            ModeratorResource.delete({userId: userId});
            $scope.$dismiss('deMod');
        };


        /**
         * ban a user
         */
        $scope.ban = function() {
            modals.openBanUser(userId);
            $scope.$dismiss('ban');
        };


        /**
         * un-ban a user
         */
        $scope.deBan = function() {
            BanResource.delete({userId: userId, banId: $scope.user.ban._id});
            $scope.$dismiss('deBan');
        };


        /**
         * promote guild member to guild mod
         */
        $scope.guildMod = function() {
            GuildModResource.put({userId: userId, guildId: $scope.user.guild});
            $scope.$dismiss('guildMod');
        };


        /**
         * demote guild mod
         */
        $scope.deGuildMod = function() {
            GuildModResource.delete({userId: userId, guildId: $scope.user.guild});
            $scope.$dismiss('deGuildMod');
        };


        /**
         * kick a user from your guild
         */
        $scope.kick = function() {
            KickResource.put({userId: userId, guildId: $scope.user.guild});
            $scope.$dismiss('kick');
        };


        /**
         * allow a user back into your guild
         */
        $scope.deKick = function() {
            KickResource.delete({userId: userId, guildId: $scope.user.guild});
            $scope.$dismiss('deKick');
        };


        /**
         * goto a list of their bans
         */
        $scope.viewBans = function() {
            $location.url('/users/'+userId+'/bans');
            $scope.$dismiss('viewBans');
        };
        
        
        /**
         * invite user to your guild
         */
        $scope.invite = function() {
            InviteResource.put({guildId: me.user.guild, userId: userId});
            $scope.$dismiss('invite');
        };
        
        
        /**
         * remove guild invite
         */
        $scope.deInvite = function() {
            InviteResource.delete({guildId: me.user.guild, userId: userId});
            $scope.$dismiss('deInvite');
        };
    });