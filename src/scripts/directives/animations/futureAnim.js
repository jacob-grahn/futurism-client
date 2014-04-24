angular.module('futurism')
    .directive('futureAnim', function($, $timeout, _, animFns, shared, sound) {
        'use strict';


        /*var flashFuture = function(display) {
            var offset = display.offset();
            var copy = display.clone();

            var desc = copy.find('p');
            desc.remove();

            $('body').append(copy);

            copy.css({
                position: 'absolute',
                top: offset.top,
                left: offset.left,
                width: display.width(),
                height: 80
            });

            copy.addClass('future-flash-anim');
            copy.addClass('shake shake-constant');

            _.delay(function() {
               copy.remove();
            }, 1000);
        };*/


        return {
            restrict: 'A',
            link: function(scope, boardElem) {


                scope.$on('post:'+shared.actions.FUTURE, function(srcScope, update, delayer) {

                    var futureDisplay = $('#game-panel .future-display');

                    sound.play('future');
                    delayer.delay = 2000;
                    boardElem.addClass('shake shake-slow shake-opacity shake-constant');
                    futureDisplay.addClass('shake shake-opacity shake-constant');

                    /*$timeout(function() {
                        flashFuture(boardElem);
                    }, 10);

                    $timeout(function() {
                        flashFuture(boardElem);
                    }, 300);

                    $timeout(function() {
                        flashFuture(boardElem);
                    }, 600);*/

                    $timeout(function() {
                        boardElem.removeClass('shake shake-slow shake-opacity shake-constant');
                    }, 1000);

                    $timeout(function() {
                        futureDisplay.removeClass('shake shake-slow shake-opacity shake-constant');
                    }, 3000);

                });
            }
        }
    });