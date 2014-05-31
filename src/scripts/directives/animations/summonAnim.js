angular.module('futurism')
    .directive('summonAnim', function(_, $, $timeout, animFns, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElement) {


                scope.$on('pre:male', function(srcScope, update, delayer) {
                    sound.play('mate');
                    anim(update, 'summon-sex', delayer);
                });


                scope.$on('pre:feml', function(srcScope, update, delayer) {
                    sound.play('mate');
                    anim(update, 'summon-sex', delayer);
                });


                scope.$on('pre:smmn', function(srcScope, update, delayer) {
                    sound.play('summon');
                    anim(update, '', delayer);
                });


                scope.$on('pre:rbld', function(srcScope, update, delayer) {
                    sound.play('rebuild');
                    anim(update, 'summon-rebuild', delayer);
                });


                scope.$on('pre:tree', function(srcScope, update, delayer) {
                    sound.play('trees');
                    anim(update, 'summon-trees', delayer);
                });



                var anim = function(update, cssClass, delayer) {

                    delayer.delay = 1000;


                    _.delay(function() {


                        // get positions
                        var chain = animFns.chainedAnimTargets(update, update.data.targetChain);
                        var src;
                        var dest;
                        if(chain.length === 3) {
                            src = chain[0] || chain[2];
                            dest = chain[2];
                        }
                        if(chain.length === 2) {
                            src = chain[0];
                            dest = chain[1];
                        }


                        // make the swirly animation
                        var effect = $('<div class="summon-holder"><div class="summon-effect '+cssClass+'"><div class="effect"></div><div class="effect"></div></div></div>');
                        
                        boardElement.append(effect);
                        
                        effect.css({transform: 'translate3d(' + (src.center.x) + 'px, ' + (src.center.y) + 'px, 0)'});
                        _.delay(function() {
                            effect.css({transform: 'translate3d(' + (dest.center.x) + 'px, ' + (dest.center.y) + 'px, 0)'});
                        });

                        $timeout(function() {
                            effect.remove();
                        }, 2000);
                    });


                };


            }
        };
    });