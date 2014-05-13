angular.module('futurism')
    .controller('LoadupDeckCtrl', function($scope, loadup, DeckResource, FavoriteDeckResource, PublicDeckResource, me) {
        'use strict';

        loadup.resumePrep();

        $scope.DeckResource = DeckResource;
        $scope.myDecksQuery = {userId: me.userId};
        $scope.myDecks = [];
        
        $scope.FavoriteDeckResource = FavoriteDeckResource;
        $scope.favoriteDecksQuery = {userId: me.userId};
        $scope.favoriteDecks = [];
        
        $scope.PublicDeckResource = PublicDeckResource;
        $scope.hotDecksQuery = {maxCards: loadup.rules.deckSize};
        $scope.hotDecks = [];
        
        $scope.rules = loadup.rules;

        $scope.select = function(deck) {
            loadup.selectDeck(deck._id);
        };

    });
