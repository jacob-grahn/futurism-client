angular.module('futurism')
    .directive('battleCryAnim', function($, animFns, shared, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('pre:'+shared.actions.BATTLECRY, function(srcScope, update, delayer) {

                    sound.play('battle-cry');

                    var src = animFns.chainedAnimTargets(update, update.data.targetChain)[0];
                    var animTargets = animFns.updatedAnimTargets(update);
                    delayer.delay = (animTargets.length * 250) + 1000;


                    // trumpets
                    var trumpets = $('<div><div class="battlecry-effect battlecry-effect-left"></div><div class="battlecry-effect battlecry-effect-right"></div></div>')
                        .css({
                            position: 'absolute',
                            'z-index': 50,
                            left: src.center.x,
                            top: src.center.y
                        });

                    boardElem.append(trumpets);

                    _.delay(function() {
                        trumpets.remove();
                    }, 3000);


                    // +1 attack floaters
                    var waitTime = 1000;
                    _.each(animTargets, function(animTarget) {
                        _.delay(function() {

                            animFns.animNotif(boardElem, animTarget.center, '+1 attack', '');

                        }, waitTime);
                        waitTime += 250;
                    });

                });
            }
        }
    });