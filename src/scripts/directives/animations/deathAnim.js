angular.module('futurism')
    .directive('deathAnim', function($, $timeout, _, shared, sound, animFns) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('post:death', function(srcScope, update, delayer) {

                    var timePerDeath = 500;
                    var animTargets = animFns.updatedAnimTargets(update);
                    delayer.delay = (animTargets.length * timePerDeath) + 500;

                    var waitTime = 0;

                    _.each(animTargets, function(animTarget) {

                        _.delay(function() {

                            sound.play('die');
                            var cloneCard = animFns.cloneCardElem(boardElem, animTarget);
                            cloneCard.addClass('death-anim');
                            cloneCard.find('.card-image-holder').addClass('shake shake-constant');
                            _.delay(function() {
                               cloneCard.remove();
                            }, 1000);

                        }, waitTime);

                        waitTime += timePerDeath;
                    });
                });
            }
        }
    });