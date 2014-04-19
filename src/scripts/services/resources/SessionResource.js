angular.module('futurism')
    .factory('SessionResource', function($resource) {
        'use strict';

        var SessionResource = $resource('/globe/sessions/:token', {}, {
            post: {method: 'POST'}
        });

        return SessionResource;
    });