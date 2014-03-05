angular.module('futurism')
	.directive('attackAnim', function($, $rootScope, maths, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElement) {


				scope.$on('event:attk', function(srcScope, update) {

					var targets = update.data;

					var attacker = animFns.getUpdatedTarget(update, targets[0]);
					var defender = animFns.getUpdatedTarget(update, targets[1]);

					animAttack(attacker, defender, function() {
						console.log('defender', defender);
						if( (!defender.newData || defender.newData.health > 0) && defender.target.card.attack > 0) {
							animAttack(defender, attacker, function() {
								done();
							});
						}
						else {
							done();
						}
					});
				});


				var animAttack = function(attacker, defender, callback) {
					var srcPoint = animFns.getTargetPoint(attacker.target, boardElement);
					var destPoint = animFns.getTargetPoint(defender.target, boardElement);

					var angleRad = Math.atan2(destPoint.y - srcPoint.y, destPoint.x - srcPoint.x);
					var angleDeg = (angleRad * maths.RAD_DEG) + 90;

					var effect = $('<div class="attack-effect"><div class="sword"></div></div>')
						.css({left: srcPoint.x-10, top: srcPoint.y-75, opacity: 0, transform: 'rotate('+angleDeg+'deg)'})
						.animate({opacity: 1}, 1000)
						.animate({left: destPoint.x-10, top: destPoint.y-75}, 400, 'linear')
						.animate({opacity: 0}, 500, function() {
							this.remove();
							callback();
						});

					boardElement.append(effect);
				};


				var done = function() {
					$rootScope.$apply(function() {
						$rootScope.$broadcast('event:animationComplete');
					});
				};



			}
		};
	});