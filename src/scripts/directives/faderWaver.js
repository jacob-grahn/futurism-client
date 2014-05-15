angular.module('futurism')
    .directive('faderWaver', function($, _, window) {
        'use strict';
        
        var freq = 150;
        var minOpacity = 0;
        var maxOpacity = 1;

        return {
            restrict: 'A',
            link: function(scope, elem) {
                
                
                var children = _.map(elem.children(), $);
                var intervalId;
                
                _.each(children, function(child) {
                    child.css({opacity: 0});
                });
                
                var next = function() {
                    var prevOpacity = Math.random() * (maxOpacity-minOpacity) + minOpacity;
                    _.each(children, function(child) {
                        var tmp = child.css('opacity');
                        child.css({opacity: prevOpacity});
                        prevOpacity = tmp;
                    });
                };
                
                scope.$on("$destroy", function() {
                    window.clearInterval(intervalId);
                });
                
                intervalId = window.setInterval(next, freq);
            }
        };
    });