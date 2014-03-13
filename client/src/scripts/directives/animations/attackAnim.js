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


				scope.$on('pre:bees', function(srcScope, update) {
					var animTargets = animFns.updatedAnimTargets(update);
					var attacker;
					var defender;

					_.each(animTargets, function(animTarget) {
						if(animTarget.newData.health !== undefined) {
							defender = animTarget;
						}
						else {
							attacker = animTarget;
						}
					});

					animThrow(attacker, defender, 'bees', 'omg bees!')
				});


				scope.$on('pre:posn', function(srcScope, update) {

					var animTargets = animFns.chainedAnimTargets(update, update.data);

					var attacker = animTargets[0];
					var defender = animTargets[1];
					var message = 'miss!';

					var oldPoison = defender.target.card.poison || 0;

					if(defender.newData && defender.newData.poison > oldPoison) {
						message = 'poisoned!';
					}

					animThrow(attacker, defender, 'poison-sword', message);
				});


				var animAttack = function(attacker, defender, callback) {
					var message;
					if(defender.damage === 0 || isNaN(defender.damage)) {
						message = 'miss!';
					}
					else {
						message = defender.damage;
					}

					animThrow(attacker, defender, 'sword', message, callback);
				};


				var animThrow = function(attacker, defender, className, message, callback) {
					var srcPoint = attacker.center;
					var destPoint = defender.center;

					var angleRad = Math.atan2(destPoint.y - srcPoint.y, destPoint.x - srcPoint.x);
					var angleDeg = (angleRad * maths.RAD_DEG) + 90;


					boardElement.append($('<div class="attack-effect"><div class="attack-effect-inner '+className+'"></div></div>')
						.css({left: srcPoint.x-10, top: srcPoint.y-75, opacity: 0, transform: 'rotate('+angleDeg+'deg)'})
						.animate({opacity: 1}, 1000)
						.animate({left: destPoint.x-10, top: destPoint.y-75}, 400, 'linear', function() {

							boardElement.append($('<div class="life-effect life-effect-dec">'+message+'</div>')
								.css({left: destPoint.x, top: destPoint.y})
								.animate({top: destPoint.y-100}, 'slow')
								.animate({opacity: 0}, 'slow', function() {
									this.remove();
								}));

						})
						.animate({opacity: 0}, 500, function() {
							this.remove();
							if(callback) {
								callback();
							}
						}));
				};

			}
		};
	});