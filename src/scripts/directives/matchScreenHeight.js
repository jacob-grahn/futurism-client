angular.module('futurism')
    .directive('matchScreenHeight', function($, window, $timeout) {
        'use strict';

        return {


            /**
             * example: <div match-screen-height>bla bla</div>
             */
            restrict: 'A',


            /**
             * Auto resize the target element to match the height of the screen
             * example: <div ng-transclude match-screen-height subtract="20">transclude allows these words to appear here</div>
             * @param {object} scope
             * @param {jQuery} elem
             * @param {object} attrs
             */
            link: function(scope, elem, attrs) {

                /**
                 * defaults
                 */
                var offsetTop = Number(attrs.offsetTop) || 0;
                var offsetBottom = Number(attrs.offsetBottom) || 0;
                var subtractHeight = offsetTop + offsetBottom;
                var breakWidth = attrs.breakWidth || 768;
                var defaultHeight = attrs.defaultHeight || 300;
                var resizeElement = attrs.resizeElement;


                /**
                 * wrap window with jquery
                 * @type {jQuery}
                 */
                var jWindow = $(window);


                /**
                 * resize elem to match the height of the screen
                 */
                var resizeHandler = function() {

                    // default display for phones
                    if(jWindow.width() < breakWidth) {
                        elem.removeAttr( 'style' );
                        becomeHeight(defaultHeight)
                    }

                    // fixed display for wider screens
                    else {

                        // detatch from document flow
                        elem.css({
                            'position': 'fixed'
                        });

                        // match screen height
                        var targetHeight = jWindow.height() - subtractHeight;
                        becomeHeight(targetHeight);

                        // match containing element width
                        var parent = elem.parent();
                        elem.css({
                            'width': parent.width()
                        });
                    }

                };


                var becomeHeight = function(height) {
                    if(!attrs.resizeElement) {
                        elem.css({
                            'height': height
                        });
                    }
                    else {
                        var target = elem.find(resizeElement);
                        var diff = elem.height() - target.height();
                        target.css({
                            'height': (height - diff)
                        });
                    }
                };



                /**
                 * call resizeHandler after the template has rendered
                 * $timeout is a quirky trick to do this
                 */
                $timeout(function() {
                    resizeHandler();
                }, 100);
                $timeout(function() {
                    resizeHandler();
                }, 1000);
                $timeout(function() {
                    resizeHandler();
                }, 10000);



                /**
                 * add listeners
                 */
                jWindow.on('resize', resizeHandler);



                /**
                 * Clean up the event listener when this element is removed
                 */
                scope.$on('$destroy', function() {
                    jWindow.off('resize', resizeHandler);
                });
            }
        };

    });