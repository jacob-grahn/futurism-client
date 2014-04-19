angular.module('futurism')
    .directive('banner', function(staticContentUrl) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                guild: '='
            },
            templateUrl: 'views/banner.html',

            link: function (scope) {
                scope.staticContentUrl = staticContentUrl;
            }
        };

    });