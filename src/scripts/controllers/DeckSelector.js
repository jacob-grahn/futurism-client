angular.module('futurism')
    .controller('DeckSelectorCtrl', function($scope, $location, deckInProgress, DeckResource) {
        'use strict';

        $scope.decks = DeckResource.query(function(){});

        $scope.select = function(deck) {
            deckInProgress.deck = DeckResource.get({deckId: deck._id});
            $location.url('/deck-builder');
        };
    });