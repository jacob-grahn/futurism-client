angular.module('futurism')
    .directive('teleporterAnim', function(_, $, board, animFns, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('pre:tlpt', function(srcScope, update, delayer) {

                    delayer.delay = 2000;
                    sound.play('teleport');

                    var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
                    var target = animTargets[1];
                    var dest = animTargets[2];

                    animFns.animNotif(boardElem, animTargets[0].center, 'How does this thing work?', '');

                    target.elem.removeClass('target-valid');
                    var card = target.elem.find('.card-small');
                    boardElem.append(card);


                    // fade out
                    card.css({
                        position: 'absolute',
                        top: target.offset.top,
                        left: target.offset.left
                    });
                    card.animate({
                        opacity: 0
                    }, 1000);


                    // fade in
                    _.delay(function() {
                        card.css({
                            top: dest.offset.top,
                            left: dest.offset.left
                        });
                        card.animate({
                            opacity: 1
                        });
                    }, 1000);
                    
                    
                    // remove copy
                    _.delay(function() {
                        card.remove();
                    }, 2000);
                    
                });
            }
        };
    });