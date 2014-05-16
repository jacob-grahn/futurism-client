angular.module('futurism')
    .directive('cardMagnify', function($, _, scrollToElement) {
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
                        scrollToElement(zoomedCard);
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
                    if(scope.hovering) {
                        scope.$apply(function() {
                            scope.hovering = false;
                        });
                    }
                });
            }
            
        };
    });