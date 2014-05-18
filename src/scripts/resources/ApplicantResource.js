angular.module('futurism')
    .factory('ApplicantResource', function($resource) {
        'use strict';

        return $resource('/globe/guilds/:guildId/applicants/:userId', {guildId: '@guildId', userId: '@userId'}, {
            put: {
                method: 'PUT'
            },
            post: {
                method: 'POST'
            },
            del: {
                method: 'DELETE'
            }
        });
    });