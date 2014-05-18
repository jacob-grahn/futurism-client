angular.module('futurism')
    .factory('GuildModResource', function($resource) {
        'use strict';

        return $resource('/globe/guilds/:guildId/mods/:userId', {userId: '@userId', guildId: '@guildId'}, {
            put: {
                method: 'PUT'
            }
        });
    });