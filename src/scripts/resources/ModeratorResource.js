angular.module('futurism')
    .factory('ModeratorResource', function($resource) {
        'use strict';

        return $resource('/globe/moderators/:userId', {userId: '@userId'}, {
            put: {
                method: 'PUT'
            }
        });
    });