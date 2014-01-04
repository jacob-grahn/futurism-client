angular.module('futurism')
	.directive('matchScreenHeight', function($, window, $timeout) {
		'use strict';

		return {


			/**
			 * example: <div match-screen-height>bla bla</div>
			 */
			restrict: 'A',


			/**
			 * Allow content inside the div to remain if you add the ng-transclude attribute
			 */
			transclude: true,


			/**
			 * example: <div match-screen-height subtract="20"></div>
			 */
			/*scope: {
				subtract: '@',
				resizeElement: '@',
				breakWidth: '@',
				breakHeight: '@'
			},*/


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
				var breakHeight = attrs.breakHeight || 300;
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

					// calculate the target height
					var targetHeight;
					if(jWindow.width() < breakWidth) {
						targetHeight = breakHeight;
					}
					else {
						targetHeight = jWindow.height() - subtractHeight;
					}

					// try tp make the html element that height
					if(!attrs.resizeElement) {
						elem.css({
							'height': targetHeight
						});
					}
					else {
						var target = elem.find(resizeElement);
						var diff = elem.height() - target.height();
						target.css({
							'height': (targetHeight - diff)
						});
					}
				};
				jWindow.on('resize', resizeHandler);


				/**
				 *
				 */
				var scrollHandler = function() {
					var scrollTo = 0;
					if(jWindow.width() >= breakWidth) {
						scrollTo = offsetTop + $(window).scrollTop();
					}
					elem.css({
						'margin-top': scrollTo
					});
				};
				jWindow.on('scroll', scrollHandler);


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
				 * Clean up the event listener when this element is removed
				 */
				scope.$on('$destroy', function() {
					jWindow.off('resize', resizeHandler);
					jWindow.off('scroll', scrollHandler);
				});
			}
		};

	});