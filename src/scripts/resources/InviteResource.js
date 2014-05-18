angular.module('futurism')
    .factory('InviteResource', function($resource) {
        'use strict';

        return $resource('/globe/guilds/:guildId/invites/:userId', {guildId: '@guildId', userId: '@userId'}, {
            put: {
                method: 'PUT'
            },
            post: {
                method: 'POST'
            },
            delete: {
                method: 'DELETE'
            }
        });
    });