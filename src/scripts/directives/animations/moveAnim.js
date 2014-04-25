angular.module('futurism')
    .directive('moveAnim', function($, animFns, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('pre:move', function(srcScope, update, delayer) {

                    sound.play('move');
                    delayer.delay = 1000;

                    var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
                    var startPos = animTargets[0];
                    var endPos = animTargets[1];

                    animFns.animMove(boardElem, startPos, endPos);
                });

            }
        }
    });