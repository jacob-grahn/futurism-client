angular.module('futurism')
    .directive('progressDisplay', function() {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/progress-display.html',
            
            scope: {
                perc: '='
            },
            
            link: function (scope) {
                
                var dec = Number(scope.perc) / 100;
                
                if(dec < 0.5) {
                    scope.rotate1 = 135;
                    scope.rotate2 = -45 + (180 * dec * 2);
                }
                else {
                    scope.rotate1 = 135 + (180 * (dec - 0.5) * 2);
                    scope.rotate2 = 135;
                }
            }
        };

    });