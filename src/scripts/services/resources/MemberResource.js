angular.module('futurism')
    .factory('MemberResource', function($resource) {
        'use strict';

        return $resource('/globe/guilds/:guildId/members/:userId', {guildId: '@guildId', userId: '@userId'}, {
            put: {
                method: 'PUT'
            },
            query:  {
                method: 'GET',
                isArray: false
            }
        });

    });