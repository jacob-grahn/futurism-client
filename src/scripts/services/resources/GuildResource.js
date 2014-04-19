angular.module('futurism')
    .factory('GuildResource', function($resource, formTransformer) {
        'use strict';

        return $resource('/globe/guilds/:guildId', {guildId: '@_id'}, {

            put: {
                method: 'PUT',
                transformRequest: formTransformer,
                headers: {
                    'Content-Type': undefined
                }
            },

            query:  {
                method: 'GET',
                isArray: false
            }
        });

    });