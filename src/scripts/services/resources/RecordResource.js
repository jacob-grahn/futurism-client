angular.module('futurism')
    .factory('RecordResource', function($resource) {
        'use strict';
        return $resource('/api/records/:gameId', {}, {});
    });