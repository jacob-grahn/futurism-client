angular.module('futurism')
    .directive('abominationAnim', function($, maths, animFns, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('pre:abom', function(srcScope, update, delayer) {

                    delayer.delay = 2000;
                    sound.play('abomination');

                    var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
                    var abom = animTargets[0];
                    var victim = animTargets[1];

                    makeGrabbers(4, abom.offset, victim.offset, function() {
                        $('.grabber-effect')
                            .animate({
                                width: 1
                            }, function() {
                                $('.grabber-effect').remove();
                            });

                        animFns.animMove(boardElem, victim, abom);
                    });
                });


                var makeGrabbers = function(count, abomOffset, victimOffset, callback) {
                    var done = _.after(count, function() {
                        callback();
                    });

                    _.times(count, function(n) {
                        _.delay(function() {
                            makeGrabber(abomOffset, victimOffset, done);
                        }, n*200);
                    });
                };


                var makeGrabber = function(abomOffset, victimOffset, callback) {
                    var p1 = {
                        x: abomOffset.left + (Math.random() * animFns.cardWidth),
                        y: abomOffset.top + (Math.random() * animFns.cardHeight)
                    };
                    var p2 = {
                        x: victimOffset.left + (Math.random() * animFns.cardWidth),
                        y: victimOffset.top + (Math.random() * animFns.cardHeight)
                    };
                    var distX = p1.x - p2.x;
                    var distY = p1.y - p2.y;
                    var distTot = Math.sqrt(distX*distX + distY*distY);
                    var angleRad = Math.atan2(distY, distX) + Math.PI;

                    var grabber = $('<div class="grabber-effect"></div>');
                    boardElem.append(grabber);
                    grabber
                        .css({
                            left: p1.x,
                            top: p1.y,
                            width: 1,
                            transform: 'rotate('+angleRad+'rad)'
                        })
                        .animate({
                            width: distTot
                        }, callback)
                };
            }
        };
    });