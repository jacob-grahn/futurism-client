angular.module('futurism')
    .factory('UserResource', function($resource) {
        'use strict';
        return $resource('/globe/users/:userId', {}, {});
    });