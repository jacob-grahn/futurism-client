angular.module('futurism')
    .factory('InvitationResource', function($resource) {
        'use strict';

        return $resource('globe/guilds/:guildId/invitations/:userId', {guildId: '@guildId', userId: '@userId'}, {
            put: {
                method: 'PUT'
            }
        });
    });