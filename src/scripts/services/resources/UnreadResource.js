angular.module('futurism')
    .factory('UnreadResource', function($resource) {
        'use strict';
        return $resource('/globe/messages/unread/count', {}, {});
    });