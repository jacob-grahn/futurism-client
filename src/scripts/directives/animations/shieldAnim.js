angular.module('futurism')
    .directive('shieldAnim', function($, animFns, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {

                scope.$on('post:shld', function(srcScope, update) {

                    sound.play('shield');

                    var animTarget = animFns.chainedAnimTargets(update, update.data.targetChain)[0];
                    animFns.animFlasher(boardElem, animTarget.center, 'shield');

                });
            }
        }
    });