angular.module('futurism')
    .factory('players', function(me, _) {
        'use strict';

        var players = {

            list: [],


            /**
             * Find a player using their id
             * @param {ObjectId} playerId
             */
            idToPlayer: function(playerId) {
                var playerMatch = null;
                _.each(players.list, function(player) {
                    if(String(player._id) === String(playerId)) {
                        playerMatch = player;
                    }
                });
                return playerMatch;
            },


            /**
             * Find a player with your _id
             */
            findMe: function() {
                return players.idToPlayer(me.userId);
            }

        };

        return players;

    });