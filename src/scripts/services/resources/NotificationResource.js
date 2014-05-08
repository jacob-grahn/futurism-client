angular.module('futurism')
    .factory('NotificationResource', function($resource) {
        'use strict';
        return $resource('/globe/notifications', {}, {});
    });