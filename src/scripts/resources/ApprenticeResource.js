angular.module('futurism')
    .factory('ApprenticeResource', function($resource) {
        'use strict';

        return $resource('/globe/apprentices/:userId', {userId: '@userId'}, {
            put: {
                method: 'PUT'
            }
        });
    });