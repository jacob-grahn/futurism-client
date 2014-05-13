angular.module('futurism')
    .factory('SummaryResource', function($resource) {
        'use strict';
        return $resource('/api/summaries/:gameId', {}, {});
    });