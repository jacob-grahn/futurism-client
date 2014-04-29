angular.module('futurism')
    .directive('banner', function() {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                guild: '='
            },
            templateUrl: 'views/banner.html'
        };

    });