angular.module('futurism')
    .factory('DeckResource', function($resource) {
        'use strict';
        return $resource('/api/user/:userId/decks', {}, {});
    });