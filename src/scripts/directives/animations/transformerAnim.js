angular.module('futurism')
    .directive('transformerAnim', function($, animFns, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('pre:tran', function(srcScope, update, delayer) {

                    delayer.delay = 1000;
                    sound.play('transform');

                    var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
                    var src = animTargets[0];
                    var clone = animFns.cloneCardElem(boardElem, src);
                    var clone2 = animFns.cloneCardElem(boardElem, src);

                    clone.addClass('transformer-effect')
                        .delay(1000)
                        .animate({
                            left: src.offset.left - 50,
                            width: 30
                        }, 'slow')
                        .animate({
                            opacity: 0
                        }, 'slow', function() {
                            clone.remove();
                        });

                    clone2.addClass('transformer-effect')
                        .addClass('transformer-effect-reverse')
                        .delay(1000)
                        .animate({
                            left: src.offset.left + 50 + 35,
                            width: 30
                        }, 'slow')
                        .animate({
                            opacity: 0
                        }, 'slow', function() {
                            clone2.remove();
                        });
                });
            }
        };
    });