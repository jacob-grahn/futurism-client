angular.module('futurism')
    .factory('FavoriteCardResource', function($resource) {
        'use strict';
        return $resource('/api/user/:userId/favorite-cards/:cardId', {userId: '@userId', cardId: '@cardId'}, {
            query: {
                method: 'GET',
                isArray: false
            },
            put: {
                method: 'PUT'
            }
        });
    });