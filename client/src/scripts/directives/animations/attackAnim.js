angular.module('futurism')
	.directive('attackAnim', function($, $rootScope, maths, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElement) {

				/**
				 * attack animation
				 */
				scope.$on('event:attk', function(srcScope, update) {

					var attackerCid = update.data[0].cid;

					var updatingTargets = animFns.getUpdatedTargets(update);
					var attacker;
					var defender;
					if(updatingTargets[0].target.card.cid === attackerCid) {
						attacker = updatingTargets[0];
						defender = updatingTargets[1];
					}
					else {
						attacker = updatingTargets[1];
						defender = updatingTargets[0];
					}

					var srcPoint = animFns.getTargetPoint(attacker.target, boardElement);
					var destPoint = animFns.getTargetPoint(defender.target, boardElement);
					var angleRad = Math.atan2(destPoint.y - srcPoint.y, destPoint.x - srcPoint.x);
					var angleDeg = (angleRad * maths.RAD_DEG) + 90;

					var effect = $('<div class="attack-effect"><div class="sword"></div></div>')
						.css({left: srcPoint.x-10, top: srcPoint.y-75, opacity: 0, transform: 'rotate('+angleDeg+'deg)'})
						.animate({opacity: 1}, 1000)
						.animate({left: destPoint.x-10, top: destPoint.y-75}, 500, 'linear')
						.animate({opacity: 0}, 500, function() {
							$rootScope.$apply(function() {
								$rootScope.$broadcast('event:animationComplete');
							});
							this.remove();
						});

					boardElement.append(effect);
				});



			}
		};
	});