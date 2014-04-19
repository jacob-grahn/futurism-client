angular.module('futurism')
    .factory('turn', function(players) {
        'use strict';

        var turn = {
            turnOwners: [],
            startTime: 0,
            maxDuration: 30000,

            /**
             * How much time is left before the turn is forced to end
             */
            getTimeLeft: function() {
                var elapsed = +new Date() - turn.startTime;
                return turn.maxDuration - elapsed;
            },


            /**
             * Returns true if it is this player's turn
             * @param {Number} playerId
             * @returns {Boolean}
             */
            isTheirTurn: function(playerId) {
                return turn.turnOwners.indexOf(playerId) !== -1;
            },


            /**
             * Returns true if it is your turn
             * @returns {boolean}
             */
            isMyTurn: function() {
                if(!players.findMe()) {
                    return false;
                }
                return turn.isTheirTurn(players.findMe()._id);
            }

        };

        return turn;
    });