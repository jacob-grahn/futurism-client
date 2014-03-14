angular.module('futurism')
	.directive('abominationAnim', function($, maths, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				scope.$on('post:abom', function(srcScope, update) {

					var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
					var abom = animTargets[0];
					var victim = animTargets[1];

					var cloneElem = victim.elem.find('.card-small').clone();

					cloneElem.css({
						position: 'absolute',
						top: victim.offset.top,
						left: victim.offset.left,
						'z-index': 99
					});

					makeGrabbers(4, abom.offset, victim.offset, function() {
						$('.grabber-effect')
							.animate({
								width: 1
							}, function() {
								$('.grabber-effect').remove();
							});

						cloneElem
							.animate({
								top: abom.offset.top,
								left: abom.offset.left
							}, 'slow')
							.animate({
								opacity: 0
							}, function() {
								cloneElem.remove();
							});
					});

					boardElem.append(cloneElem);
				});


				var makeGrabbers = function(count, abomOffset, victimOffset, callback) {
					var done = _.after(count, function() {
						callback();
					});

					_.times(count, function(n) {
						_.delay(function() {
							makeGrabber(abomOffset, victimOffset, done);
						}, n*200);
					});
				};


				var makeGrabber = function(abomOffset, victimOffset, callback) {
					console.log('make grabber');
					var p1 = {
						x: abomOffset.left + (Math.random() * animFns.cardWidth),
						y: abomOffset.top + (Math.random() * animFns.cardHeight)
					};
					var p2 = {
						x: victimOffset.left + (Math.random() * animFns.cardWidth),
						y: victimOffset.top + (Math.random() * animFns.cardHeight)
					};
					var distX = p1.x - p2.x;
					var distY = p1.y - p2.y;
					var distTot = Math.sqrt(distX*distX + distY*distY);
					var angleRad = Math.atan2(distY, distX) + Math.PI;

					var grabber = $('<div class="grabber-effect"></div>');
					boardElem.append(grabber);
					grabber
						.css({
							left: p1.x,
							top: p1.y,
							width: 1,
							transform: 'rotate('+angleRad+'rad)'
						})
						.animate({
							width: distTot
						}, callback)
				};
			}
		};
	});