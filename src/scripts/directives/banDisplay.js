angular.module('futurism')
    .directive('banDisplay', function() {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/ban-display.html',
            scope: {
                ban: '='
            }
        };

    });