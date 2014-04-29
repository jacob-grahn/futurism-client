angular.module('futurism')
    .directive('deckDisplay', function(_) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/deck-display.html',

            link: function (scope, elem, attrs) {
                scope.size = attrs.size || 'large';
                scope.active = attrs.active || 'active';
                scope.displayIds = [];

                var deck = scope.deck;
                var cards = deck.cards;

                // give up if there are no cards
                if(cards.length === 0) {
                    return null;
                }

                // pick three cards to show
                scope.displayIds[0] = cards[0];
                scope.displayIds[1] = cards[Math.round((cards.length-1)/2)];
                scope.displayIds[2] = cards[cards.length-1];

                //remove dupes
                scope.displayIds = _.unique(scope.displayIds);
            }
        };

    });