angular.module('futurism')
    .factory('CardResource', function($resource, formTransformer) {
        'use strict';

        var CardResource = $resource('/api/users/:userId/cards/:cardId', {userId: '@userId', cardId: '@cardId'}, {

            save: {
                method: 'POST',
                transformRequest: formTransformer,
                headers: {
                    'Content-Type': undefined
                }
            },

            query: {
                method: 'GET',
                array: false
            }
        });

        return CardResource;
    });