angular.module('futurism')
	.directive('abominationAnim', function($, $rootScope, maths, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				scope.$on('event:abom', function(srcScope, update) {

					var targetChain = update.data;

					var abom = animFns.makeAnimTarget(update, targetChain[0]);
					var victim = animFns.makeAnimTarget(update, targetChain[1]);

					var abomElem = $('.card-small.cid-'+abom.target.card.cid);
					var victimElem = $('.card-small.cid-'+victim.target.card.cid);

					var abomOffset = animFns.relativeOffset(abomElem, boardElem);
					var victimOffset = animFns.relativeOffset(victimElem, boardElem);

					var cloneElem = victimElem.clone(false);

					cloneElem.css({
						position: 'absolute',
						top: victimOffset.top,
						left: victimOffset.left,
						'z-index': 99
					});

					makeGrabbers(4, abomOffset, victimOffset, function() {
						$('.grabber-effect')
							.animate({
								width: 1
							}, function() {
								$('.grabber-effect').remove();
							});

						cloneElem
							.animate({
								top: abomOffset.top,
								left: abomOffset.left
							}, 'slow')
							.animate({
								opacity: 0
							}, function() {
								cloneElem.remove();
							});
					});

					boardElem.append(cloneElem);
					$rootScope.$broadcast('event:animationComplete');
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