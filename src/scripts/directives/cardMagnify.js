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
                
                
                var deZoom = function() {
                    if(scope.hovering) {
                        scope.$apply(function() {
                            scope.hovering = false;
                            $('body').off('click', deZoom);
                            elem.off('mouseleave', deZoom);
                        });
                    }
                };
                
                
                var zoom = function() {
                    if(!scope.hovering) {
                        _.delay(function() {
                            scope.$apply(function() {
                                scope.hovering = true;
                                _.delay(scrollIntoView, 400);
                                $('body').on('click', deZoom);
                                elem.on('mouseleave', deZoom);
                            });
                        });
                    }
                };


                elem.on('click', function() {
                    if(scope.active !== 'false') {
                        if(scope.hovering) {
                            deZoom();
                        }
                        else {
                            zoom();
                        }
                    }
                });
                
                
                scope.$on('$destory', function() {
                    $('body').off('click', deZoom);
                    elem.off('mouseleave', deZoom);
                });
            }
            
        };
    });