angular.module('futurism')
    .factory('PublicDeckResource', function($resource) {
        'use strict';
        return $resource('/api/decks', {}, {});
    });