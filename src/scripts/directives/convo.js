angular.module('futurism')
    .directive('convo', function() {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/convo.html',
            scope: {
                messages: '='
            }
        };

    });