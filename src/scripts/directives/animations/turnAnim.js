angular.module('futurism')
    .directive('turnAnim', function($, $timeout, players, sound) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            template: '<div ng-if="active" id="turn-anim"><h1>{{name}}\'s turn begins!</h1></div>',
            link: function(scope) {

                scope.active = false;
                scope.name = '';

                scope.$on('post:turn', function(srcScope, changes) {

                    var playerId = changes.turnOwners[0];
                    var player = players.idToPlayer(playerId);

                    if(player) {
                        sound.play('turn', 1);
                        scope.name = player.name;
                        scope.active = true;
                        $timeout(function() {
                            scope.active = false;
                        }, 3000);
                    }
                });
            }
        };
    });