angular.module('futurism')
    .factory('KickResource', function($resource) {
        'use strict';

        return $resource('/globe/guilds/:guildId/kicks/:userId', {userId: '@userId', guildId: '@guildId'}, {
            put: {
                method: 'PUT'
            }
        });
    });