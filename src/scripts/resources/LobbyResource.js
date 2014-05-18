angular.module('futurism')
    .factory('LobbyResource', function($resource) {
        'use strict';

        return $resource('/api/lobbies/:lobbyId', {lobbyId: '@lobbyId'}, {
        });
    });