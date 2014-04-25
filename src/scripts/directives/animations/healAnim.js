angular.module('futurism')
    .directive('healAnim', function($, animFns, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('pre:heal', function(srcScope, update, delayer) {

                    sound.play('heal');

                    var animChain = animFns.chainedAnimTargets(update, update.data.targetChain);
                    var healer = animChain[0];
                    var healee = animChain[1];

                    // heal beam, then heal effect
                    if(healer.target.card.cid !== healee.target.card.cid) {
                        delayer.delay = 2000;
                        addBeam(healer, healee);
                        _.delay(function() {
                            addEffects(healee, 0);
                        }, 1000);
                    }

                    // just heal effect
                    else {
                        delayer.delay = 1000;
                        addEffects(healee, 0);
                    }
                });



                var addBeam = function(healer, healee) {
                    var distX = healer.center.x - healee.center.x;
                    var distY = healer.center.y - healee.center.y;
                    var distTot = Math.sqrt(distX*distX + distY*distY);
                    var rad = Math.atan2(distY, distX) - Math.PI;

                    var beam = $('<div class="heal-beam"><div class="heal-beam-inner"></div></div>')
                        .css({
                            left: healer.center.x,
                            top: healer.center.y,
                            width: distTot,
                            transform: 'rotate('+rad+'rad)'
                        });

                    boardElem.append(beam);

                    _.delay(function() {
                        beam.remove();
                    }, 3000);
                };



                /**
                 * add some floaty plus signs to an animTarget
                 * @param {Object} healee
                 * @param {Number} effectCount
                 */
                var addEffects = function(healee, effectCount) {

                    // add the effect
                    var effect = $('<div class="heal-effect"><div class="heal-effect-inner">+</div></div>')
                        .css({
                            top: healee.offset.top + Math.random() * animFns.cardHeight,
                            left: healee.offset.left + Math.random() * animFns.cardWidth
                        });

                    boardElem.append(effect);

                    // remove the effect after some time
                    _.delay(function() {
                        effect.remove();
                    }, 2000);

                    // call this function again if there are more effects to be made
                    effectCount++;
                    if(effectCount < 10) {
                        _.delay(addEffects, 100, healee, effectCount);
                    }
                };
            }
        };
    });