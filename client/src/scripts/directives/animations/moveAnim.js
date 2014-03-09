angular.module('futurism')
	.directive('moveAnim', function($, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				scope.$on('post:move', function(srcScope, update) {

					_.delay(function() {
						var animTargets = animFns.chainedAnimTargets(update, update.data);
						var startPos = animTargets[0];
						var endPos = animTargets[1];

						endPos.elem.addClass('target-hidden');

						var cloneElem = endPos.elem.find('.card-small').clone();

						cloneElem
							.css({
								position: 'absolute',
								top: startPos.offset.top,
								left: startPos.offset.left,
								'z-index': 99
							})
							.animate({
								top: endPos.offset.top,
								left: endPos.offset.left
							}, 'slow', function() {
								endPos.elem.removeClass('target-hidden');
								cloneElem.remove();
							});

						boardElem.append(cloneElem);
					}, 0);


				});

			}
		}
	});