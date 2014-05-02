angular.module('futurism')
    .controller('LoadupDeckCtrl', function($scope, loadup, DeckResource) {
        'use strict';

        loadup.resumePrep();

        $scope.decks = DeckResource.query({canon: true}, function(){});
        $scope.rules = loadup.rules;

        $scope.select = function(deck) {
            loadup.selectDeck(deck._id);
        };

    });
