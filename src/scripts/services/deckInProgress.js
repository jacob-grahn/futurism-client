angular.module('futurism')
    .factory('deckInProgress', function(DeckResource, shared) {
        'use strict';

        var deck = new DeckResource();
        shared.deckFns.applyDefaults(deck);

        return {
            deck: deck
        };
    });