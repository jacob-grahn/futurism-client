angular.module('futurism')
    .factory('ConversationResource', function($resource) {
        'use strict';
        return $resource('/globe/conversations/:userId', {userId: '@userId'}, {
            query: {
                method: 'GET',
                isArray: false
            },
            get: {
                method: 'GET',
                isArray: true
            },
            post: {
                method: 'POST',
                isArray: true
            }
        });
    });