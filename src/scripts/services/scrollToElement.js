angular.module('futurism')
    .factory('scrollToElement', function($) {
        'use strict';
        
        var scrollToElement = function(elem) {
            var cardHeight = elem.height();
            var cardTop = +elem.offset().top;
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
        };
        
        return scrollToElement;
        
    });