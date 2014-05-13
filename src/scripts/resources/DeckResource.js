angular.module('futurism')
    .factory('DeckResource', function($resource) {
        'use strict';
        return $resource('/api/user/:userId/decks/:deckId', {userId: '@userId', deckId: '@deckId'}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    });