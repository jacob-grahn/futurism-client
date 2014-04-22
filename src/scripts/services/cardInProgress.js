angular.module('futurism')
    .factory('cardInProgress', function(CardResource, shared) {
        'use strict';

        var self = {
            card: null,
            reset: function() {
                self.card = new CardResource();
                shared.cardFns.applyDefaults(self.card);
            }
        };

        self.reset();

        return self;
    });