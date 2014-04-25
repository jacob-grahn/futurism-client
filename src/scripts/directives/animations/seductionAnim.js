angular.module('futurism')
    .directive('seductionAnim', function($, animFns, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('pre:sduc', function(srcScope, update, delayer) {

                    delayer.delay = 3000;
                    sound.play('seduce');

                    var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
                    var src = animTargets[0];
                    var target = animTargets[1];
                    var dest = animTargets[2];

                    animFns.animFlasher(boardElem, src.center, 'seduction');

                    _.delay(function() {
                        animFns.animFlasher(boardElem, target.center, 'seduction');
                    }, 500);

                    _.delay(function() {
                        animFns.animMove(boardElem, target, dest);
                    }, 1500);

                    _.delay(function() {
                        animFns.animNotif(boardElem, src.center, '-1 health', 'danger');
                    }, 3000);
                });
            }
        }
    });