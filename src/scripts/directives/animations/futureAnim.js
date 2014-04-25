angular.module('futurism')
    .directive('futureAnim', function($, $timeout, shared, sound) {
        'use strict';


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('pre:'+shared.actions.FUTURE, function(srcScope, update, delayer) {

                    delayer.delay = 1000;
                    sound.play('future');

                    var futureDisplay = $('#game-panel .future-display');

                    boardElem.addClass('shake shake-slow shake-opacity shake-constant');
                    futureDisplay.addClass('shake shake-opacity shake-constant');

                    $timeout(function() {
                        boardElem.removeClass('shake shake-slow shake-opacity shake-constant');
                    }, 1000);

                    $timeout(function() {
                        futureDisplay.removeClass('shake shake-slow shake-opacity shake-constant');
                    }, 2000);

                });
            }
        }
    });