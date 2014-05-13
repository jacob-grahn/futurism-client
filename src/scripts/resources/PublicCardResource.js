angular.module('futurism')
    .factory('PublicCardResource', function($resource) {
        'use strict';
        return $resource('/api/cards', {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    });