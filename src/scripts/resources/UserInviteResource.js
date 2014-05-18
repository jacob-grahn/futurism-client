angular.module('futurism')
    .factory('UserInviteResource', function($resource) {
        'use strict';

        return $resource('/globe/users/:userId/invites', {userId: '@userId'}, {
            get: {
                method: 'GET',
                isArray: false
            }
        });
    });