/**
 * Sort player into teams
 * Your team should always be on bottom
 */

angular.module('futurism')
    .filter('teamSort', function(_) {
        'use strict';

        return function(arr, myTeam) {
            return _.sortBy(arr, function(target) {
                if(target.team === myTeam) {
                    return Infinity;
                }
                return 1;
            });
        };

    });