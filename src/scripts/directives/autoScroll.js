angular.module('futurism')
    .directive('autoScroll', function($, socket, scrollToElement, _) {
        'use strict';
        
        
        var findTaggedElems = function(possibleElems, tag) {
            var confirmedElems = [];
            _.each(possibleElems, function(possibleElem) {
                possibleElem = $(possibleElem);
                var matches = possibleElem.find('.' + tag);
                if(matches.length > 0) {
                    confirmedElems.push(possibleElem);
                }
            });
            return confirmedElems;
        };
        
        
        var findNearestElem = function(elems) {
            if(!_.isArray(elems)) {
                return null;
            }
            
            var screenHeight = $(window).height();
            var screenTop = $(document).scrollTop();
            var screenBottom = screenTop + screenHeight;
            var screenCenterY = (screenTop + screenBottom) / 2;
            
            var sorted = _.sortBy(elems, function(elem) {
                var offset = elem.offset();
                var elemTop = offset.top;
                var elemBottom = offset.top + elem.height();
                var elemCenterY = (elemTop + elemBottom) / 2;
                return Math.abs(screenCenterY - elemCenterY);
            });
            
            return sorted[0];
        };
        
        

        return {
            restrict: 'A',
            replace: false,
            scope: {
                watch: '=',
                find: '@',
                target: '@'
            },
            link: function(scope, element) {

                scope.$watch(

                    function() {
                        return JSON.stringify(scope.watch);
                    },

                    function() {
                        _.delay(function() {

                            var possibleElems = element.find('.'+scope.target);
                            var confirmedElems = findTaggedElems(possibleElems, scope.find);
                            var nearestElem = findNearestElem(confirmedElems);

                            if(nearestElem) {
                                scrollToElement(nearestElem, 1000);
                            }

                        }, 100);
                    }
                );
            }
        };
    });