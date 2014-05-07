angular.module('futurism')
    .factory('ConversationResource', function($resource) {
        'use strict';
        return $resource('/globe/conversations/:userId', {userId: '@userId'}, {
            query: {
                method: 'GET',
                array: false
            }
        });
    });