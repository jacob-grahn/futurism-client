angular.module('futurism')
    .factory('FavoriteDeckResource', function($resource) {
        'use strict';
        return $resource('/api/user/:userId/favorite-decks', {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    });