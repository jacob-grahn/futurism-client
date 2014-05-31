angular.module('futurism')
    .directive('attackAnim', function($, maths, animFns, sound, _) {
        'use strict';
        
    

        return {
            restrict: 'A',
            link: function(scope, boardElement) {
                

                
                var animThrow = function(attacker, defender, className, message, callback) {
                    sound.play('attack-launch', 0.25);
                    var srcPoint = attacker.center;
                    var destPoint = defender.center;

                    var angleRad = Math.atan2(destPoint.y - srcPoint.y, destPoint.x - srcPoint.x);
                    var angleDeg = (angleRad * maths.RAD_DEG) + 90;


                    var effect = $('<div class="attack-effect"><div class="attack-effect-inner '+className+'"></div></div>');
                    boardElement.append(effect);
                    
                        effect.css({
                            transform: 'translate3d(' + (srcPoint.x-10) + 'px, ' + (srcPoint.y-75) + 'px, 0) rotate(' + angleDeg + 'deg) ',
                            opacity: 0
                        })
                        .animate({opacity: 1}, 1000, function() {
                            sound.play('attack-ready', 0.3);
                            
                            effect.css({
                                transform: 'translate3d(' + (destPoint.x-10) + 'px, ' + (destPoint.y-75) + 'px, 0) rotate(' + angleDeg + 'deg)'
                            });
                            
                            _.delay(function() {
                                
                                animFns.animNotif(boardElement, destPoint, message, 'danger');
                                
                                if(message !== 'miss!') {
                                    if(message === 'poisoned!') {
                                        sound.play('poison');
                                    }
                                    else {
                                        sound.play('hit');
                                    }
                                }
                                
                                if(defender.shield && defender.shield > 0) {
                                    animFns.animFlasher(boardElement, destPoint, 'shield');
                                }

                                effect.animate({opacity: 0}, 500, function() {
                                    effect.remove();
                                    if(callback) {
                                        callback();
                                    }
                                });
                                
                            }, 300);
                        });
                };


                
                var animAttack = function(attacker, defender, callback) {
                    var message;
                    if(defender.damage === 0 || isNaN(defender.damage)) {
                        message = 'miss!';
                    }
                    else {
                        message = '-' + defender.damage + ' health';
                    }


                    animThrow(attacker, defender, 'sword', message, callback);
                    if(attacker.heal) {
                        _.delay(function() {
                            animFns.animNotif(boardElement, attacker.center, '+' + attacker.heal + ' health', 'good');
                        }, 1500);
                    }
                };
                
                
                
                var animAttackAndCounter = function(update, delayer) {
                    var result = update.data.result;
                    var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
                    var attacker = animTargets[0];
                    var defender = animTargets[1];

                    attacker.damage = result.srcDamage;
                    attacker.shield = attacker.target.card.shield;
                    attacker.heal = result.srcHeal;
                    defender.damage = result.targetDamage;
                    defender.shield = defender.target.card.shield;

                    var counterAttack;
                    if( (!defender.newData || defender.newData.health > 0) && defender.target.card.attack > 0 && update.cause !== 'assn') {
                        counterAttack = true;
                        delayer.delay = 4000;
                    }
                    else {
                        delayer.delay = 2000;
                    }

                    animAttack(attacker, defender, function() {
                        if(counterAttack) {
                            animAttack(defender, attacker, function() {});
                        }
                    });

                    return animTargets;
                };
                
                  
                
                
                scope.$on('pre:attk', function(srcScope, update, delayer) {
                    animAttackAndCounter(update, delayer);
                });
                

                scope.$on('pre:siph', function(srcScope, update, delayer) {
                    animAttackAndCounter(update, delayer);
                });


                scope.$on('pre:assn', function(srcScope, update, delayer) {
                    animAttackAndCounter(update, delayer);
                });


                scope.$on('pre:frvt', function(srcScope, update, delayer) {
                    animAttackAndCounter(update, delayer);
                });


                scope.$on('pre:prci', function(srcScope, update, delayer) {
                    animAttackAndCounter(update, delayer);
                });


                scope.$on('pre:bees', function(srcScope, update, delayer) {
                    sound.play('bees');
                    delayer.delay = 2000;
                    var animTargets = animFns.updatedAnimTargets(update);
                    var attacker;
                    var defender;

                    _.each(animTargets, function(animTarget) {
                        if(animTarget.newData.health !== undefined) {
                            defender = animTarget;
                        }
                        else {
                            attacker = animTarget;
                        }
                    });

                    defender.shield = defender.target.card.shield;

                    animThrow(attacker, defender, 'bees', 'omg bees!');
                });


                scope.$on('pre:posn', function(srcScope, update, delayer) {
                    delayer.delay = 2000;
                    var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);

                    var attacker = animTargets[0];
                    var defender = animTargets[1];
                    var message = 'miss!';

                    var oldPoison = defender.target.card.poison || 0;

                    if(defender.newData && defender.newData.poison > oldPoison) {
                        message = 'poisoned!';
                    }

                    animThrow(attacker, defender, 'poison-sword', message);
                });

            }
        };
    });