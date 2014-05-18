angular.module('futurism')
    .factory('ModLogResource', function($resource) {
        'use strict';

        return $resource('/globe/mod-logs/:logId', {logId: '@logId'}, {
            query: {
                method: 'GET',
                array: false
            }
        });
    });