angular.module('futurism')
    .factory('UserInvitationResource', function($resource) {
        'use strict';

        return $resource('globe/users/:userId/invitations', {userId: '@userId'}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
    });