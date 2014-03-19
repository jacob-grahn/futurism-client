angular.module('futurism')
	.directive('sacrificeAnim', function($, animFns, shared) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				scope.$on('post:'+shared.actions.HERO, function(srcScope, update) {

					var waitTime = 0;

					var animTargets = animFns.updatedAnimTargets(update);

					_.each(animTargets, function(animTarget) {
						_.delay(function() {

							// skull
							animFns.animFlasher(boardElem, animTarget.center, 'poison');

							// -1 health floaty
							animFns.animNotif(boardElem, animTarget.center, '-1 health', 'danger');

						}, waitTime);
						waitTime += 100;
					});

				});
			}
		}
	});