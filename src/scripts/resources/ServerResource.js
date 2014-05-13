angular.module('futurism')
    .factory('ServerResource', function($resource) {
        'use strict';

        return $resource('/api/servers/', {}, {
            cache: true
        });

    });