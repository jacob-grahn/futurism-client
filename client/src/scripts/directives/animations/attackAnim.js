angular.module('futurism')
	.directive('attackAnim', function($, maths, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElement) {


				scope.$on('pre:attk', function(srcScope, update) {

					var animTargets = animFns.chainedAnimTargets(update, update.data);

					var attacker = animTargets[0];
					var defender = animTargets[1];

					attacker.damage = attacker.newData ? (attacker.newData.health - attacker.target.card.health) : 0;
					defender.damage = defender.newData ? (defender.newData.health - defender.target.card.health) : 0;

					animAttack(attacker, defender, function() {
						if( (!defender.newData || defender.newData.health > 0) && defender.target.card.attack > 0) {
							animAttack(defender, attacker, function() {});
						}
					});
				});


				var animAttack = function(attacker, defender, callback) {
					console.log('anim attack', attacker, defender);
					var srcPoint = animFns.targetCenter(attacker.target, boardElement);
					var destPoint = animFns.targetCenter(defender.target, boardElement);

					var angleRad = Math.atan2(destPoint.y - srcPoint.y, destPoint.x - srcPoint.x);
					var angleDeg = (angleRad * maths.RAD_DEG) + 90;

					var displayDamage;
					if(defender.damage === 0 || isNaN(defender.damage)) {
						displayDamage = 'miss!';
					}
					else {
						displayDamage = defender.damage;
					}

					boardElement.append($('<div class="attack-effect"><div class="sword"></div></div>')
						.css({left: srcPoint.x-10, top: srcPoint.y-75, opacity: 0, transform: 'rotate('+angleDeg+'deg)'})
						.animate({opacity: 1}, 1000)
						.animate({left: destPoint.x-10, top: destPoint.y-75}, 400, 'linear', function() {

							boardElement.append($('<div class="life-effect life-effect-dec">'+displayDamage+'</div>')
								.css({left: destPoint.x, top: destPoint.y})
								.animate({top: destPoint.y-100}, 'slow')
								.animate({opacity: 0}, 'slow', function() {
									this.remove();
								}));

						})
						.animate({opacity: 0}, 500, function() {
							this.remove();
							callback();
						}));
				};

			}
		};
	});