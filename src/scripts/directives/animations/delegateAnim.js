angular.module('futurism')
    .directive('delegateAnim', function($, animFns, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('pre:delg', function(srcScope, update, delayer) {
                    delayer.delay = 2000;
                    sound.play('delegate');
                    var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
                    var src = animTargets[0];
                    leaveAnim(src, 'I need a vacation!');
                });


                scope.$on('pre:bagm', function(srcScope, update, delayer) {
                    delayer.delay = 2500;
                    sound.play('bagem');
                    var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
                    var src = animTargets[0];
                    var target = animTargets[1];

                    animFns.animFlasher(boardElem, src.center, 'seduction');

                    _.delay(function() {
                        leaveAnim(target, 'Wow! Free candy!');
                    }, 500);

                    _.delay(function() {
                        var srcCardElem = src.elem.find('.card-small');
                        srcCardElem.animate({
                            opacity: 0
                        }, 'slow');
                    }, 1500);
                });


                var leaveAnim = function(animTarget, message) {
                    var card = animTarget.elem.find('.card-small');
                    animTarget.elem.removeClass('target-valid');
                    animFns.animNotif(boardElem, animTarget.center, message);

                    _.delay(function() {
                        card.animate({
                            opacity: 0,
                            left: animTarget.offset.left - 400,
                            top: animTarget.offset.top - 200
                        }, 'slow', function() {
                            card.remove();
                        });
                    }, 1500);
                };

            }
        }
    });