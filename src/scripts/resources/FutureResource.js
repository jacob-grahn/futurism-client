angular.module('futurism')
    .factory('FutureResource', function($resource) {
        'use strict';

        return $resource('/api/users/:userId/futures/:futureId', {userId: '@userId', futureId: '@futureId'}, {
            put: {
                method: 'PUT'
            }
        });
    });