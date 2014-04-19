angular.module('futurism')
    .directive('cardDisplay', function(staticContentUrl, lang) {
        'use strict';

        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'views/card-display.html',

            scope: {
                card: '=',
                size: '@',
                useButtons: '@',
                actionFn: '&'
            },

            link: function (scope) {
                scope.lang = lang;
                scope.staticContentUrl = staticContentUrl;
            }
        };

    });