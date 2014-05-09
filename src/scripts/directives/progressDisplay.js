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
                
                scope.$watch('perc', function() {
                    
                    var perc = Number(scope.perc);
                    
                    if(perc < 0.5) {
                        scope.rotate1 = 135;
                        scope.rotate2 = -45 + (180 * perc * 2);
                    }
                    else {
                        scope.rotate1 = 135 + (180 * (perc - 0.5) * 2);
                        scope.rotate2 = 135;
                    }
                });
                
            }
        };
    });