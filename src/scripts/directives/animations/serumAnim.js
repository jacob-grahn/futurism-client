angular.module('futurism')
    .directive('serumAnim', function($, animFns, shared, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('post:'+shared.actions.SERUM, function(srcScope, update, delayer) {

                    delayer.delay = 2000;
                    sound.play('serum');

                    var src = animFns.chainedAnimTargets(update, update.data.targetChain)[0];

                    animFns.animFlasher(boardElem, src.center, 'serum');

                    _.delay(function() {
                        animFns.animNotif(boardElem, src.center, '+3 attack');
                    }, 1000);

                    _.delay(function() {
                        animFns.animNotif(boardElem, src.center, 'poisoned!', 'danger');
                    }, 1500);
                });
            }
        }
    });