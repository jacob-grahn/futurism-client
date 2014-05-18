angular.module('futurism')
    .factory('BanResource', function($resource) {
        'use strict';

        return $resource('/globe/bans/:userId/:banId', {userId: '@userId', banId: '@banId'}, {
        });
    });