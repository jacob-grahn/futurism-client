angular.module('futurism')
    .factory('hand', function(socket, $routeParams, players, _) {
        'use strict';

        /**
         * Receive the cards in your hand
         */
        socket.$on('hand', function(data) {
            self.cards = data.hand;
            self.futures = data.futures;

            var myPlayer = players.findMe();
            myPlayer.hand = self.cards;
            myPlayer.futures = self.futures;
        });


        /**
         *
         */
        var self = {
            cards: [],
            futures: [],


            clear: function() {
                self.cards = [];
                self.futures = [];
            },


            removeCid: function(cid) {
                self.cards = _.filter(self.cards, function(card) {
                    return card.cid !== cid;
                });
                players.findMe().hand = self.cards;
            },


            removeFuture: function(future) {
                var index = self.futures.indexOf(future);
                if(index !== -1) {
                    self.futures.splice(index, 1);
                }
                players.findMe().futures = self.futures;
            },


            refresh: function() {
                self.clear();
                if(players.findMe()) {
                    socket.emit('hand', {gameId: $routeParams.gameId});
                }
            }
        };

        return self;
    });