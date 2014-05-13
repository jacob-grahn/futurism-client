angular.module('futurism')
    .factory('FavoriteDeckResource', function($resource) {
        'use strict';
        return $resource('/api/user/:userId/favorite-decks/:deckId', {userId: '@userId', deckId: '@deckId'}, {
            query: {
                method: 'GET',
                isArray: false
            },
            put: {
                method: 'PUT'
            }
        });
    });