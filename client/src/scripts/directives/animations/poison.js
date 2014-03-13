angular.module('futurism')
	.directive('poisonAnim', function($, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				// poison effect
				scope.$on('post:poison', function(srcScope, update) {

					var waitTime = 0;

					var animTargets = animFns.updatedAnimTargets(update);

					_.each(animTargets, function(animTarget) {
						_.delay(function() {

							// skull
							var effect = $('<div class="poison-effect"><div class="poison-effect-inner"></div></div>');
							boardElem.append(effect);
							effect.css({
								left: animTarget.center.x,
								top: animTarget.center.y
							});

							// -1 health floaty
							var textEffect = $('<div class="rally-effect">-1 health</div>');
							textEffect.css({left: animTarget.center.x, top: animTarget.center.y, opacity: 0});
							textEffect.animate({top: animTarget.center.y-100, opacity: 1});
							boardElem.append(textEffect);

							// cleanup
							_.delay(function() {
								effect.remove();
								textEffect.remove();
							}, 2000);

						}, waitTime);
						waitTime += 100;
					});

				});
			}
		}
	});