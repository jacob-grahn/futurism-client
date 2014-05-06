angular.module('futurism')
    .factory('autoTurnEnder', function($timeout, $routeParams, turn, me, board, socket) {
        'use strict';

        return {

            /**
             * End your turn if all of your cards are spent
             */
            run: function() {

                if(turn.isMyTurn()) {

                    var targets = board.playerTargets(me.user._id);

                    var filledTargets = _.filter(targets, function(target) {
                        return target.card;
                    });

                    var unusedTargets = _.filter(targets, function(target) {
                        return target.card && target.card.moves > 0 && target.card.abilities && target.card.abilities.length > 0;
                    });

                    if(unusedTargets.length === 0 && filledTargets.length > 0) {
                        _.delay(function() {
                            socket.emit('endTurn', {gameId: $routeParams.gameId});
                        }, 1000);
                    }
                }
            }
        }
    });