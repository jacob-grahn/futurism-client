angular.module('futurism')
    .controller('DeckSelectorCtrl', function($scope, $location, deckInProgress, DeckResource, me, _) {
        'use strict';

        $scope.decks = DeckResource.query(function(){});
        $scope.me = me;

        
        $scope.select = function(deck) {
            deckInProgress.deck = DeckResource.get({deckId: deck._id});
            $location.url('/deck-builder');
        };
        
        
        $scope.newDeck = function() {
            deckInProgress.reset();
            $location.url('/deck-builder');
        };
        
        
        $scope.canDelete = function(deck) {
            return deck.user._id === me.user._id;
        };
        
        
        $scope.deleteDeck = function(deck) {
            var r = DeckResource.delete({
                userId: deck.userId,
                deckId: deck._id
            }, function () {
                _.pull($scope.decks, deck);
            });
            return r.$promise;
        };
    });