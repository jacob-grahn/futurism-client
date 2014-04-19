/**
 * reverse targets if field is owned by an opposing team
 */

angular.module('futurism')
    .filter('inverseFoes', function() {
        'use strict';

        return function(targets, myTeam) {
            if(targets[0].player.team !== myTeam) {
                return targets.slice().reverse();
            }
            return targets;
        };

    });