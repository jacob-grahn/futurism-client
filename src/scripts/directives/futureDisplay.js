angular.module('futurism')
    .directive('futureDisplay', function(lang) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/future-display.html',
            scope: {
                'future': '@'
            },
            link: function (scope) {
                scope.lang = lang;
            }
        };

    });