angular.module('futurism')
    .directive('delegateAnim', function($, animFns, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('pre:delg', function(srcScope, update) {
                    sound.play('delegate');
                    var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
                    var src = animTargets[0];
                    leaveAnim(src, 'I need a vacation!');
                });


                scope.$on('pre:bagm', function(srcScope, update) {
                    sound.play('bagem');
                    var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
                    var target = animTargets[1];
                    leaveAnim(target, 'Wow! Free candy!');
                });


                var leaveAnim = function(animTarget, message) {
                    var card = animFns.cloneCardElem(boardElem, animTarget);

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