angular.module('futurism')
    .directive('sacrificeAnim', function($, animFns, shared, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('pre:'+shared.actions.HERO, function(srcScope, update, delayer) {

                    delayer.delay = 1000;
                    sound.play('hero');

                    var src = animFns.chainedAnimTargets(update, update.data.targetChain)[0];
                    animFns.animFlasher(boardElem, src.center, 'hero');
                });
            }
        }
    });