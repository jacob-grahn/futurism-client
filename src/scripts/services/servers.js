angular.module('futurism')
    .factory('servers', function(ServerResource, _) {
        'use strict';

        return {

            getUri: function(serverId, callback) {

                ServerResource.query({}, function(serverList) {

                    var matches = _.filter(serverList, function(server) {
                        return server.id === serverId;
                    });

                    if(matches.length === 0) {
                        return callback('server not found');
                    }

                    return callback(null, matches[0].uri);
                });
            }
        }
    });