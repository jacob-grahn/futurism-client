/**
 * puts you first
 */

angular.module('futurism')
    .filter('meFirst', function(_, me) {
        'use strict';

        return function(arr) {

            if(!me.userId) {
                return arr;
            }

            _.sortBy(arr, function(val) {
                if(val === me.userId || val._id === me.userId || val.userId === me.userId) {
                    return -1;
                }
                return 1;
            });

            return arr;
        };

    });