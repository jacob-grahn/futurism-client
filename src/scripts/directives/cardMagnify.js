angular.module('futurism')
    .directive('cardMagnify', function($, _) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/card-magnify.html',

            scope: {
                size: '@',
                magnify: '@',
                useButtons: '@',
                active: '@',
                card: '=',
                actionFn: '&'
            },

            link: function (scope, elem) {
                scope.hovering = false;


                var scrollIntoView = function() {
                    if(scope.hovering) {

                        var zoomedCard = elem.find('.card-bigger');

                        var cardHeight = zoomedCard.height();
                        var cardTop = +zoomedCard.offset().top;
                        var cardBottom = cardTop + cardHeight;

                        var screenHeight = $(window).height();
                        var screenTop = $(document).scrollTop();
                        var screenBottom = screenTop + screenHeight;

                        if(cardBottom > screenBottom) {
                            $('html, body').animate({scrollTop: screenTop + (cardBottom - screenBottom)}, 500);
                        }
                        else if(cardTop < screenTop) {
                            $('html, body').animate({scrollTop: screenTop + (cardTop - screenTop)}, 500);
                        }
                    }
                };


                elem.click(function() {
                    if(scope.active !== 'false' || scope.hovering) {
                        scope.$apply(function() {
                            scope.hovering = !scope.hovering;
                            if(scope.hovering) {
                                _.delay(scrollIntoView, 400);
                            }
                        });
                    }
                });

                elem.mouseleave(function() {
                    scope.$apply(function() {
                        scope.hovering = false;
                    });
                });

                /*elem.hover(
                    function() {
                        scope.$apply(function() {
                            scope.hovering = true;
                        });
                    },
                    function() {
                        scope.$apply(function() {
                            scope.hovering = false;
                        });
                    }
                );*/

            }
        };

    });