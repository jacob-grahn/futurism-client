angular.module('futurism')
    .controller('LoadupDeckCtrl', function($scope, loadup, DeckResource, FavoriteDeckResource, PublicDeckResource, me) {
        'use strict';

        loadup.resumePrep();

        $scope.DeckResource = DeckResource;
        $scope.FavoriteDeckResource = FavoriteDeckResource;
        $scope.PublicDeckResource = PublicDeckResource;
        
        $scope.myDecksQuery = {userId: me.userId};
        $scope.favoriteDecksQuery = {userId: me.userId};
        $scope.hotDecksQuery = {sort: 'hot', maxCards: loadup.rules.deckSize};
        
        $scope.rules = loadup.rules;

        $scope.select = function(deck) {
            loadup.selectDeck(deck._id);
        };

    });
