angular.module('futurism')
    .directive('networkingAnim', function($, animFns, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('pre:netw', function(srcScope, update, delayer) {

                    delayer.delay = 1000;
                    sound.play('network');

                    var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
                    var src = animTargets[0];
                    var target = animTargets[1];

                    animFns.makeGrabber(boardElem, {x: src.center.x, y: src.center.y - 15}, {x: target.center.x, y: target.center.y - 15}, 'recharge');
                    animFns.makeGrabber(boardElem, {x: target.center.x, y: target.center.y + 15}, {x: src.center.x, y: src.center.y + 15}, 'recharge');
                });
            }
        };
    });