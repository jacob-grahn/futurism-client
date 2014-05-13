angular.module('futurism')
    .factory('MessageResource', function($resource) {
        'use strict';
        return $resource('/globe/messages/:userId', {}, {});
    });