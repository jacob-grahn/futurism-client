angular.module('futurism')
    .factory('modals', function($modal) {
        'use strict';

        return {


            openUser: function(userId) {
                $modal.open({
                    templateUrl: 'views/user-modal.html',
                    controller: 'UserModalCtrl',
                    resolve: {
                        userId: function () {
                            return userId;
                        }
                    }
                });
            },


            openBanUser: function(userId) {
                $modal.open({
                    templateUrl: 'views/ban-user-modal.html',
                    controller: 'BanUserModalCtrl',
                    resolve: {
                        userId: function () {
                            return userId;
                        }
                    }
                });
            },


            openMessage: function(userId) {
                $modal.open({
                    templateUrl: 'views/message-modal.html',
                    controller: 'MessageModalCtrl',
                    resolve: {
                        toUserId: function () {
                            return userId;
                        }
                    }
                });
            },
            
            
            openFracture: function() {
                $modal.open({
                    templateUrl: 'views/fracture-modal.html',
                    controller: 'FractureModalCtrl'
                });
            },
            
            
            openGuildCreate: function(guildId) {
                $modal.open({
                    templateUrl: 'views/guild-create-modal.html',
                    controller: 'GuildCreateModalCtrl',
                    resolve: {
                        guildId: function () {
                            return guildId;
                        }
                    }
                });
            },
            
            
            openInvites: function() {
                $modal.open({
                    templateUrl: 'views/invites-modal.html',
                    controller: 'InvitesModalCtrl'
                });
            },
            
            
            openApplicants: function() {
                $modal.open({
                    templateUrl: 'views/applicant-modal.html',
                    controller: 'ApplicantModalCtrl'
                });
            },
            
            
            openCustomGame: function() {
                $modal.open({
                    templateUrl: 'views/custom-game-modal.html',
                    controller: 'CustomGameModalCtrl'
                });
            },
            
            
            openGameEnd: function(gameId) {
                $modal.open({
                    templateUrl: 'views/game-end-modal.html',
                    controller: 'GameEndModalCtrl',
                    resolve: {
                        gameId: function () {
                            return gameId;
                        }
                    }
                });
            },

        };

    });