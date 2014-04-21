angular.module('futurism')
    .factory('deckInProgress', function(DeckResource, shared) {
        'use strict';

        var self = {
            deck: null,
            reset: function() {
                self.deck = new DeckResource();
                shared.deckFns.applyDefaults(self.deck);
            }
        };
        
        self.reset();
        
        return self;
    });