//remove all falsy values from an object

angular.module('futurism')
    .filter('truthyFields', function() {
        'use strict';

        return function(obj, modify) {
            var filtered = {};
            var count = 0;
            angular.forEach(obj, function(value, key) {
                if(value) {
                    if(!modify || (modify === 'odds' && count % 2 === 1) || (modify === 'evens' && count % 2 === 0)) {
                        filtered[key] = value;
                    }
                    count++;
                }
            });

            return filtered;
        };

    });