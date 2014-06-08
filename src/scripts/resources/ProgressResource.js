angular.module('futurism')
    .factory('ProgressResource', function($resource) {
        'use strict';
        return $resource('/api/progress/:userId', {}, {});
    });